"""
batch_ingest.py — Process chunked chapter text into Obsidian notes via Claude API.

Usage:
    python scripts/batch_ingest.py <book_slug> <chapter_number>
    python scripts/batch_ingest.py <book_slug> <chapter_number> --resume
    python scripts/batch_ingest.py <book_slug> <chapter_number> --dry-run
    python scripts/batch_ingest.py <book_slug> <chapter_number> --model claude-opus-4-7
    python scripts/batch_ingest.py <book_slug> <chapter_number> --thinking

Reads:
    pdfs/cache/{book_slug}/chunks/chapter_NN/manifest.json
    pdfs/cache/{book_slug}/chunks/chapter_NN/chunk_NNN.json
    cache/domains.json
    cache/concepts.json
    cache/ingest-state.json  (if --resume)

Writes:
    staging/chNN/{note_filename}.md
    cache/ingest-state.json
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone

try:
    import anthropic
except ImportError:
    print("[ingest] anthropic not found. Run: pip install 'anthropic>=0.44.0'", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DEFAULT_MODEL = "claude-sonnet-4-6"
DEFAULT_MAX_TOKENS = 8192
EXIT_RATE_LIMITED = 2  # both providers exhausted — resume-able

PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
STATE_PATH = os.path.join(PROJECT_ROOT, "cache", "ingest-state.json")

SYSTEM_PROMPT = """\
You are Guru, an AI knowledge engineer. You read textbook chapter text and emit deeply connected Obsidian notes. Output ONLY <note> blocks — no preamble, no commentary outside them.

## Output format

Emit each note exactly as:

<note>
<filename>concept name in lowercase with spaces.md</filename>
<content>
---
title: <full concept name — lowercase, singular, no abbreviations>
domain: <exact domain string>
parent-domain: <exact parent-domain string>
source: "<textbook title, Chapter N: Chapter Name>"
prereqs: ["[[note title]]"]
builds-into: ["[[note title]]"]
related: ["[[note title]]"]
---

# Concept Name in Title Case

## Plain English
One sentence — no symbols, no jargon: what is this thing?

## Intuition
Max 2 sentences. A concrete analogy or visual you can picture in 5 seconds — NOT a restatement of the definition.

## Formal Definition
> **Definition:**
> $$\\text{equation or definition in LaTeX}$$
>
> Where $x$ is ... and $A$ is ...

## Worked Example
A concrete numeric example with small numbers. Show every step and the result, each in $$...$$.

## Key Properties
Max 3. Only rules worth remembering.

## Why It Works
2–3 sentences: the insight that makes the formula inevitable. No full proof.

## Bridge to Other Domains
> **→ [Domain Name]:** one sentence naming the exact mechanism that connects this concept to that domain.
> *Why it matters:* one sentence on the practical payoff.

Max 2 bridges. Name a specific mechanism — never "this is used in X" without saying how. This section also covers where the concept appears elsewhere; there is no separate list.

## Common Confusions
Optional — include only if there is a genuine trap, max 1:
> ⚠ You might think **X** — but actually **Y** because **Z**.

## Guru's Note
One sentence of advice from a senior student. Conversational, no jargon.
</content>
</note>

## Quality rules (enforced)
- Plain English: one sentence; no math symbol or domain term.
- Intuition: a different angle from the definition; max 2 sentences.
- Worked Example: real numbers and every step, never only variables.
- Bridge: names a specific mechanism; max 2 entries.
- Guru's Note: exactly one sentence.

## LaTeX (enforced)
- ALL math in LaTeX: inline `$...$`, block `$$...$$`, matrices `\\begin{bmatrix}...\\end{bmatrix}`.
- Never plain-text math: write `$A = LU$` and `$a_{ij}$`, never `A = LU` or `a_ij`.

## Naming
- Filenames and `title:` are lowercase, singular, full phrases, no abbreviations; ambiguous terms get a full domain prefix (`probability bayes theorem.md`, not `bayes.md`). The `# Heading` is Title Case.

## Frontmatter
- `source:` always double-quoted. `prereqs:`/`builds-into:`/`related:` use `"[[wikilink]]"` syntax matching the linked note's `title:` exactly; empty lists are `[]`.

## What warrants a note
Emit a note for every concept that has a precise definition, at least one non-trivial connection, and would appear in a glossary. Pay special attention to bridge concepts — ideas at the boundary between two subjects, rarely named in either — and emit them as standalone notes too.
"""

NOTE_PATTERN = re.compile(
    r"<note>\s*<filename>(.*?)</filename>\s*<content>(.*?)</content>\s*</note>",
    re.DOTALL,
)

FRONTMATTER_PATTERN = re.compile(
    r"^---\s*\n(.*?)\n---", re.DOTALL | re.MULTILINE
)


# ---------------------------------------------------------------------------
# Provider fallback exceptions
# ---------------------------------------------------------------------------

class ClaudeCodeRateLimitError(Exception):
    pass

class BothProvidersExhausted(Exception):
    def __init__(self, providers):
        self.providers = providers


# ---------------------------------------------------------------------------
# Config and cache
# ---------------------------------------------------------------------------

def load_config():
    path = os.path.join(PROJECT_ROOT, "config.json")
    with open(path) as f:
        return json.load(f)


def load_cache():
    domains_path = os.path.join(PROJECT_ROOT, "cache", "domains.json")
    concepts_path = os.path.join(PROJECT_ROOT, "cache", "concepts.json")

    domains = {}
    if os.path.exists(domains_path):
        with open(domains_path) as f:
            domains = json.load(f)
    else:
        print("[ingest] WARN: cache/domains.json not found — domain registry will be empty", file=sys.stderr)

    concepts = {}
    if os.path.exists(concepts_path):
        with open(concepts_path) as f:
            concepts = json.load(f)

    return domains, concepts


# ---------------------------------------------------------------------------
# Session state
# ---------------------------------------------------------------------------

def load_session_state():
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH) as f:
            return json.load(f)
    return None


def save_session_state(state):
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2)


def clear_session_state():
    if os.path.exists(STATE_PATH):
        os.remove(STATE_PATH)


# ---------------------------------------------------------------------------
# Bridge candidates
# ---------------------------------------------------------------------------

def get_bridge_candidates(query, top_n=15):
    embeddings_path = os.path.join(PROJECT_ROOT, "cache", "embeddings.npy")
    if not os.path.exists(embeddings_path):
        return []

    embed_script = os.path.join(PROJECT_ROOT, "scripts", "embed.py")
    try:
        result = subprocess.run(
            [sys.executable, embed_script, "--query", query, "--top", str(top_n)],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode != 0:
            return []
        return json.loads(result.stdout.strip())
    except Exception:
        return []


# ---------------------------------------------------------------------------
# Prompt construction
# ---------------------------------------------------------------------------

def build_session_context(domains, concepts, book_title, chapter_num, chapter_title,
                          chapter_domain=None, chapter_parent_domain=None):
    """Stable session context — cached at breakpoint 2."""
    if chapter_domain is not None or chapter_parent_domain is not None:
        filtered_concepts = {
            title: meta for title, meta in concepts.items()
            if meta.get("parent-domain") == chapter_parent_domain
            or meta.get("domain") == chapter_domain
        }
    else:
        filtered_concepts = concepts

    lines = [
        f"## Session context",
        f"",
        f"Book: {book_title}",
        f"Chapter: {chapter_num} — {chapter_title}",
        f"",
        f"### Domain registry ({len(domains)} domains)",
        "",
    ]

    if domains:
        for domain, parent in sorted(domains.items()):
            lines.append(f"- {domain} (parent: {parent})")
    else:
        lines.append("- (empty — propose new domains as needed)")

    lines += ["", f"### Existing vault concepts ({len(filtered_concepts)} concepts)", ""]

    if filtered_concepts:
        for title, meta in sorted(filtered_concepts.items()):
            summary = meta.get("summary", "")
            domain = meta.get("domain", "")
            lines.append(f"- {title} [{domain}]: {summary}")
    else:
        lines.append("- (vault is empty — no existing concepts to link against)")

    return "\n".join(lines)


def build_chunk_prompt(chunk, session_notes, bridge_candidates, source_str, concepts):
    """Dynamic per-chunk prompt — not cached."""
    lines = ["## Chunk to process", ""]

    lines.append(f"Section: {chunk['section_title']}")
    lines.append(f"Source: {source_str}")
    lines.append(f"Chunk: {chunk['chunk_index'] + 1} of {chunk['total_chunks']}")
    lines.append(f"Strategy: {chunk['strategy']}")
    lines.append("")

    if chunk.get("window_context"):
        lines += [
            "### Sliding window context (tail of previous section)",
            "",
            chunk["window_context"],
            "",
        ]

    lines += ["### Chapter text", "", chunk["text"], ""]

    if session_notes:
        notes_to_show = session_notes
        if len(session_notes) > 15:
            with_bridges = [n for n in session_notes if n.get("bridges")]
            without_bridges = [n for n in session_notes if not n.get("bridges")]
            remaining = max(0, 15 - len(with_bridges))
            notes_to_show = with_bridges + (without_bridges[-remaining:] if remaining else [])
        lines += [
            "### Notes generated earlier in this chapter (available for wikilinks)",
            "",
        ]
        for n in notes_to_show:
            bridges_str = (", ".join(n.get("bridges", []))) if n.get("bridges") else ""
            bridge_note = f" — bridges: {bridges_str}" if bridges_str else ""
            lines.append(f"- [[{n['title']}]] [{n['domain']}]: {n['summary']}{bridge_note}")
        lines.append("")

    if bridge_candidates:
        lines += [
            "### Semantic bridge candidates (existing vault concepts — consider for `related:` and Bridge sections)",
            "",
        ]
        for bc in bridge_candidates:
            title = bc["title"]
            score = bc["score"]
            meta = concepts.get(title, {})
            summary = meta.get("summary", "")
            domain = meta.get("domain", "")
            lines.append(f"- [[{title}]] [{domain}] (score: {score}): {summary}")
        lines.append("")

    lines += [
        "Generate notes for every major concept in this section. ",
        "If you find a bridge concept (an idea that sits at the boundary between two subjects), ",
        "generate it as a standalone note in addition to the component concept notes.",
        "",
        "Use the domain registry for domain assignments. If you need a new domain, note it at the ",
        "end of your response after all <note> blocks, in this format:",
        "",
        "<new_domains>",
        "domain_name: parent_domain_name",
        "</new_domains>",
    ]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Claude API call
# ---------------------------------------------------------------------------

def call_claude(client, model, system_text, session_context, chunk_prompt, max_tokens, use_thinking):
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": session_context,
                    "cache_control": {"type": "ephemeral"},  # breakpoint 2
                },
                {
                    "type": "text",
                    "text": chunk_prompt,
                },
            ],
        }
    ]

    kwargs = {
        "model": model,
        "max_tokens": max_tokens,
        "system": [
            {
                "type": "text",
                "text": system_text,
                "cache_control": {"type": "ephemeral"},  # breakpoint 1
            }
        ],
        "messages": messages,
    }

    if use_thinking:
        kwargs["thinking"] = {"type": "adaptive"}

    response = client.messages.create(**kwargs)
    text = "".join(block.text for block in response.content if hasattr(block, "text"))
    usage = response.usage
    return text, usage


# ---------------------------------------------------------------------------
# Provider fallback logic
# ---------------------------------------------------------------------------

def get_api_reset_time(err):
    """Extract the latest reset timestamp from a RateLimitError's response headers."""
    try:
        headers = err.response.headers
        resets = [
            headers.get("anthropic-ratelimit-requests-reset"),
            headers.get("anthropic-ratelimit-tokens-reset"),
        ]
        resets = [r for r in resets if r]
        return max(resets) if resets else None
    except Exception:
        return None


def _find_claude():
    """Locate the claude binary across common install paths."""
    search_path = ":".join(filter(None, [
        os.path.expanduser("~/.local/bin"),
        os.path.expanduser("~/.claude/local"),
        os.path.expanduser("~/.npm/bin"),
        "/usr/local/bin",
        "/opt/homebrew/bin",
        os.environ.get("PATH", ""),
    ]))
    return shutil.which("claude", path=search_path)


def _cli_model_alias(model):
    """Map a model id to a Claude Code CLI alias. The CLI inherits the user's
    saved default model otherwise — which may be Opus and burns Pro-plan rate
    limits far faster than Sonnet. Passing --model pins bulk generation."""
    m = (model or "").lower()
    if "opus" in m:
        return "opus"
    if "haiku" in m:
        return "haiku"
    if "sonnet" in m:
        return "sonnet"
    return model  # pass an unrecognised id through unchanged


def call_claude_code_cli(system_text, session_context, chunk_prompt, model):
    """Call Claude via Claude Code CLI using Pro plan auth. No prompt caching."""
    claude_bin = _find_claude()
    if not claude_bin:
        raise FileNotFoundError("claude CLI not found — install via: npm install -g @anthropic-ai/claude-code")

    combined = "\n\n".join([
        "SYSTEM INSTRUCTIONS:\n" + system_text,
        session_context,
        chunk_prompt,
    ])
    # Strip ANTHROPIC_API_KEY so the CLI authenticates with the Pro/Max
    # subscription login instead of pay-as-you-go API billing. If the key is
    # present the CLI charges API credits — which a subscription-only user
    # does not have, surfacing as "Credit balance is too low".
    cli_env = {k: v for k, v in os.environ.items()
               if k not in ("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN")}
    cli_env["HOME"] = os.path.expanduser("~")
    # Disable extended thinking. Claude Code turns it on by default, and on dense
    # chapter text the model burns thousands of thinking tokens (and can hit the
    # 5-minute timeout) before emitting a single note. Note generation is
    # structured extraction, not deep reasoning — output quality is unaffected.
    cli_env["MAX_THINKING_TOKENS"] = "0"
    try:
        result = subprocess.run(
            # --strict-mcp-config with no --mcp-config loads ZERO MCP servers, so
            # the CLI does not boot the project's obsidian-vault MCP (which hangs
            # the call). Note generation is pure text and needs no tools/MCP.
            [claude_bin, "-p", combined, "--model", _cli_model_alias(model),
             "--strict-mcp-config", "--output-format", "json"],
            stdin=subprocess.DEVNULL,   # prevent 3s stdin wait / TTY warning
            capture_output=True,
            text=True,
            timeout=600,
            env=cli_env,
        )
    except FileNotFoundError:
        raise FileNotFoundError(f"claude CLI not found at {claude_bin}")
    except subprocess.TimeoutExpired:
        raise RuntimeError("claude CLI timed out after 10 minutes")

    combined_out = (result.stdout + result.stderr).lower()
    rate_limit_kws = ("rate limit", "usage limit", "too many request", "quota exceeded", "overloaded")
    if any(kw in combined_out for kw in rate_limit_kws):
        raise ClaudeCodeRateLimitError()

    if result.returncode != 0:
        err_detail = (result.stderr + result.stdout).strip()[:500]
        raise RuntimeError(err_detail or f"claude CLI exited {result.returncode}")

    try:
        data = json.loads(result.stdout)
        if data.get("is_error"):
            msg = str(data.get("error") or data.get("result", ""))
            if any(kw in msg.lower() for kw in rate_limit_kws):
                raise ClaudeCodeRateLimitError()
            raise RuntimeError(msg[:300])
        return data.get("result", result.stdout), None
    except (json.JSONDecodeError, KeyError):
        return result.stdout, None


def call_with_fallback(state, client, model, system_text, session_context,
                       chunk_prompt, max_tokens, use_thinking):
    """Try Claude Code CLI (Pro) first → API fallback → raise BothProvidersExhausted."""
    providers = state.setdefault("providers", {
        "api": {"status": "available", "reset_at": None},
        "claude_code": {"status": "available", "reset_at": None},
    })
    api_key = os.environ.get("ANTHROPIC_API_KEY")

    # --- Claude Code CLI (Pro plan) — primary ---
    cc_status = providers.get("claude_code", {}).get("status")
    if cc_status not in ("rate_limited", "unavailable", "no_credits"):
        try:
            return call_claude_code_cli(system_text, session_context, chunk_prompt, model)
        except ClaudeCodeRateLimitError:
            providers["claude_code"] = {"status": "rate_limited", "reset_at": None}
            save_session_state(state)
            print(
                "  [ingest] Claude Code CLI rate limited. "
                "Trying Anthropic API...",
                file=sys.stderr,
            )
        except FileNotFoundError:
            providers["claude_code"] = {"status": "unavailable", "reset_at": None}
            save_session_state(state)
            print(
                "  [ingest] Claude Code CLI not installed. "
                "Trying Anthropic API...",
                file=sys.stderr,
            )
        except RuntimeError as e:
            print(f"  [ingest] Claude Code CLI error: {e} — trying API...", file=sys.stderr)

    # --- Anthropic API — fallback ---
    if api_key and providers.get("api", {}).get("status") == "available":
        try:
            return call_claude(client, model, system_text, session_context,
                               chunk_prompt, max_tokens, use_thinking)
        except anthropic.RateLimitError as e:
            reset_at = get_api_reset_time(e)
            providers["api"] = {"status": "rate_limited", "reset_at": reset_at}
            save_session_state(state)
            print(
                f"  [ingest] API rate limited. Reset: {reset_at or 'unknown'}.",
                file=sys.stderr,
            )
        except anthropic.BadRequestError as e:
            if "credit balance" in str(e).lower() or "credits" in str(e).lower():
                providers["api"] = {"status": "no_credits", "reset_at": None}
                save_session_state(state)
                print("  [ingest] API: insufficient credits.", file=sys.stderr)
            else:
                raise

    raise BothProvidersExhausted(providers)


# ---------------------------------------------------------------------------
# Note parsing and writing
# ---------------------------------------------------------------------------

def parse_notes(response_text):
    """Extract (filename, content) pairs from XML-delimited response."""
    matches = NOTE_PATTERN.findall(response_text)
    notes = []
    for filename, content in matches:
        filename = filename.strip()
        content = content.strip()
        if filename and content:
            notes.append({"filename": filename, "content": content})
    return notes


def extract_note_metadata(content):
    """Parse frontmatter fields from note content for session state tracking."""
    m = FRONTMATTER_PATTERN.search(content)
    if not m:
        return {}

    frontmatter = m.group(1)
    meta = {}

    for field in ("title", "domain", "parent-domain"):
        pattern = re.compile(rf"^{field}:\s*(.+)$", re.MULTILINE)
        fm = pattern.search(frontmatter)
        if fm:
            meta[field] = fm.group(1).strip().strip('"')

    return meta


def extract_summary(content):
    """Extract the Plain English section as a one-sentence summary."""
    m = re.search(r"## Plain English\s*\n\s*\n(.+?)(?:\n\n|\Z)", content, re.DOTALL)
    if m:
        return m.group(1).strip().split("\n")[0]
    return ""


def extract_bridges(content):
    """Extract bridge domain names from Bridge section."""
    bridges = re.findall(r"\*\*→ \[([^\]]+)\]:", content)
    return bridges


def parse_new_domains(response_text):
    """Extract proposed new domains from response."""
    m = re.search(r"<new_domains>\s*(.*?)\s*</new_domains>", response_text, re.DOTALL)
    if not m:
        return {}
    result = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if ":" in line:
            domain, parent = line.split(":", 1)
            result[domain.strip()] = parent.strip()
    return result


def write_notes(notes, staging_dir, dry_run=False):
    """Write parsed notes to staging directory. Returns list of written filenames."""
    written = []
    os.makedirs(staging_dir, exist_ok=True)

    for note in notes:
        filename = note["filename"]
        if not filename.endswith(".md"):
            filename += ".md"

        # Sanitize: ensure lowercase, no path traversal
        filename = os.path.basename(filename.lower())
        out_path = os.path.join(staging_dir, filename)

        if dry_run:
            print(f"  [dry-run] Would write: {out_path}")
        else:
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(note["content"])
            print(f"  [ingest] Written: {filename}")

        written.append(filename)

    return written


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description="Batch-ingest chunked chapter text into Obsidian notes via Claude.")
    p.add_argument("book_slug", help="Book slug (e.g. applied-linear-algebra)")
    p.add_argument("chapter", type=int, help="Chapter number")
    p.add_argument("--resume", action="store_true", help="Resume from saved session state")
    p.add_argument("--dry-run", action="store_true", help="Print notes without writing to disk")
    p.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model (default: {DEFAULT_MODEL})")
    p.add_argument("--max-tokens", type=int, default=DEFAULT_MAX_TOKENS, help=f"Max tokens per response (default: {DEFAULT_MAX_TOKENS})")
    p.add_argument("--thinking", action="store_true", help="Enable adaptive thinking (adds reasoning depth, increases cost)")
    p.add_argument("--chapter-domain", default=None, help="Domain for this chapter (e.g. 'linear algebra') — filters vault concepts shown in context")
    p.add_argument("--parent-domain", default=None, help="Parent domain for this chapter (e.g. 'mathematics') — filters vault concepts shown in context")
    args = p.parse_args()

    cfg = load_config()
    book_dir = os.path.join(cfg["pdfs_path"], "cache", args.book_slug)
    chunk_dir = os.path.join(book_dir, "chunks", f"chapter_{args.chapter:02d}")
    manifest_path = os.path.join(chunk_dir, "manifest.json")

    if not os.path.exists(manifest_path):
        print(f"[ingest] Manifest not found: {manifest_path}", file=sys.stderr)
        print(f"[ingest] Run: python scripts/chunk.py {args.book_slug} {args.chapter}", file=sys.stderr)
        sys.exit(1)

    with open(manifest_path) as f:
        manifest = json.load(f)

    chapter_title = manifest["chapter_title"]
    total_chunks = manifest["total_chunks"]
    strategy = manifest["strategy"]

    # Load meta for book title
    meta_path = os.path.join(book_dir, "meta.json")
    with open(meta_path) as f:
        book_meta = json.load(f)
    book_title = book_meta["title"]

    domains, concepts = load_cache()

    # Staging directory: staging/chNN/
    staging_base = cfg["staging_path"]
    staging_dir = os.path.join(staging_base, f"ch{args.chapter:02d}")

    # Session state
    state = None
    if args.resume:
        state = load_session_state()
        if state and (state.get("book_slug") != args.book_slug or state.get("chapter_number") != args.chapter):
            print("[ingest] WARN: saved state is for a different book/chapter — ignoring", file=sys.stderr)
            state = None
        elif state:
            # Always try all providers fresh on resume (tokens may have refreshed)
            state["providers"] = {
                "api": {"status": "available", "reset_at": None},
                "claude_code": {"status": "available", "reset_at": None},
            }

    if state is None:
        state = {
            "book_slug": args.book_slug,
            "book_title": book_title,
            "chapter_number": args.chapter,
            "chapter_title": chapter_title,
            "total_chunks": total_chunks,
            "completed_chunks": [],
            "session_notes": [],
            "new_domain_proposals": {},
            "total_usage": {
                "input_tokens": 0,
                "output_tokens": 0,
                "cache_creation_input_tokens": 0,
                "cache_read_input_tokens": 0,
            },
            "started_at": datetime.now(timezone.utc).isoformat(),
            "providers": {
                "api": {"status": "available", "reset_at": None},
                "claude_code": {"status": "available", "reset_at": None},
            },
        }

    completed = set(state["completed_chunks"])
    remaining = [i for i in range(total_chunks) if i not in completed]

    print(f"[ingest] {book_title} — Chapter {args.chapter}: {chapter_title}")
    print(f"[ingest] Strategy: {strategy}  |  Chunks: {total_chunks}  |  Remaining: {len(remaining)}")
    print(f"[ingest] Model: {args.model}  |  Max tokens: {args.max_tokens}")
    if args.thinking:
        print("[ingest] Adaptive thinking: ON")
    if args.dry_run:
        print("[ingest] Dry-run mode — notes will not be written to disk")
    print()

    if not remaining:
        print("[ingest] All chunks already completed. Use a fresh run (without --resume) to reprocess.")
        return

    client = anthropic.Anthropic()
    source_str = f"{book_title}, Chapter {args.chapter}: {chapter_title}"
    session_context = build_session_context(
        domains, concepts, book_title, args.chapter, chapter_title,
        chapter_domain=args.chapter_domain,
        chapter_parent_domain=args.parent_domain,
    )

    all_written = []

    for chunk_idx in remaining:
        chunk_path = os.path.join(chunk_dir, f"chunk_{chunk_idx:03d}.json")
        with open(chunk_path) as f:
            chunk = json.load(f)

        section = chunk["section_title"]
        tokens_est = chunk["estimated_tokens"]
        print(f"[ingest] Chunk {chunk_idx + 1}/{total_chunks}: {section[:60]} (~{tokens_est:,} tokens)")

        # Bridge candidates for this chunk's content
        query = f"{section} {chunk['text'][:300]}"
        bridge_cands = get_bridge_candidates(query, top_n=8)
        if bridge_cands:
            print(f"  [ingest] Bridge candidates: {len(bridge_cands)} found")

        chunk_prompt = build_chunk_prompt(
            chunk,
            state["session_notes"],
            bridge_cands,
            source_str,
            concepts,
        )

        try:
            response_text, usage = call_with_fallback(
                state,
                client,
                args.model,
                SYSTEM_PROMPT,
                session_context,
                chunk_prompt,
                args.max_tokens,
                args.thinking,
            )
        except BothProvidersExhausted as exc:
            print(
                f"[ingest] Both providers rate-limited — pausing. "
                f"Providers: {json.dumps(exc.providers)}",
                file=sys.stderr,
            )
            save_session_state(state)
            sys.exit(EXIT_RATE_LIMITED)

        # Parse and write notes
        notes = parse_notes(response_text)
        print(f"  [ingest] Notes parsed: {len(notes)}")

        if not args.dry_run:
            written = write_notes(notes, staging_dir, dry_run=False)
        else:
            written = write_notes(notes, staging_dir, dry_run=True)
        all_written.extend(written)

        # Update session_notes for concept continuity
        for note in notes:
            meta = extract_note_metadata(note["content"])
            if meta.get("title"):
                summary = extract_summary(note["content"])
                bridges = extract_bridges(note["content"])
                state["session_notes"].append({
                    "title": meta["title"],
                    "domain": meta.get("domain", ""),
                    "summary": summary,
                    "bridges": bridges,
                    "is_new_domain": meta.get("domain", "") not in domains,
                })

        # Track new domain proposals
        new_domains = parse_new_domains(response_text)
        if new_domains:
            state["new_domain_proposals"].update(new_domains)
            print(f"  [ingest] New domain proposals: {list(new_domains.keys())}")

        # Accumulate usage (usage is None when Claude Code CLI was used)
        u = state["total_usage"]
        u["input_tokens"] += getattr(usage, "input_tokens", 0) if usage else 0
        u["output_tokens"] += getattr(usage, "output_tokens", 0) if usage else 0
        u["cache_creation_input_tokens"] += getattr(usage, "cache_creation_input_tokens", 0) if usage else 0
        u["cache_read_input_tokens"] += getattr(usage, "cache_read_input_tokens", 0) if usage else 0

        state["completed_chunks"].append(chunk_idx)

        if not args.dry_run:
            save_session_state(state)

        print()

    # Final summary
    u = state["total_usage"]
    total_notes = len(state["session_notes"])
    bridge_notes = [n for n in state["session_notes"] if n.get("bridges")]

    print("=== batch_ingest.py summary ===")
    print(f"Book:      {book_title}")
    print(f"Chapter:   {args.chapter} — {chapter_title}")
    print(f"Strategy:  {strategy}")
    print(f"Notes:     {total_notes}")
    print(f"Staging:   {staging_dir}")
    print()
    print(f"Token usage:")
    print(f"  Input:          {u['input_tokens']:,}")
    print(f"  Output:         {u['output_tokens']:,}")
    print(f"  Cache creation: {u['cache_creation_input_tokens']:,}")
    print(f"  Cache reads:    {u['cache_read_input_tokens']:,}")
    cache_savings = u["cache_read_input_tokens"]
    if cache_savings > 0:
        print(f"  Cache savings:  ~{cache_savings:,} tokens read from cache (90% cost reduction on those tokens)")

    if bridge_notes:
        print()
        print("Bridge concepts identified:")
        for n in bridge_notes:
            bridges_str = " ↔ ".join(n["bridges"])
            print(f"  - {n['title']} — {bridges_str}")

    if state["new_domain_proposals"]:
        print()
        print("New domain proposals (require user confirmation before approval step):")
        for domain, parent in state["new_domain_proposals"].items():
            notes_using = [n["title"] for n in state["session_notes"] if n.get("domain") == domain]
            print(f"  - {domain} (parent: {parent}) — used in: {', '.join(notes_using)}")

    if not args.dry_run:
        print()
        print(f"Session state saved: {STATE_PATH}")
        print("Run 'python scripts/approve.py' to move staged notes into the vault.")
        clear_session_state()


if __name__ == "__main__":
    main()
