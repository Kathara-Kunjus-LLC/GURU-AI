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
You are Guru, an AI knowledge engineer. You process textbook chapter text and generate deeply connected Obsidian notes. Output ONLY notes — no commentary, no preamble, no explanation outside note blocks.

## Output format

Wrap every note in XML tags. Each note must appear exactly like this:

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

One sentence. No jargon. No symbols. What is this thing, simply?

## Intuition

A concrete analogy or real-world visual — NOT a restatement of the definition. Something you can picture in 5 seconds.

## Formal Definition

> **Definition:**
> $$\\text{Full LaTeX equation or definition here}$$
>
> Where $x$ is ... and $A$ is ...

## Worked Example

A concrete numerical example using small numbers. Show every step. Show the result.

$$\\text{Step 1: ...}$$

$$\\text{Result: ...}$$

## Key Properties

Essential rules only. Maximum 5. Only the ones worth remembering.

## Why It Works

2–4 sentences explaining the core reasoning. No full proof — just the insight that makes it click.

## Bridge to Other Domains

> **→ [Domain Name]:** One sentence naming the exact mechanism connecting this concept to that domain.
> *Why it matters:* One sentence on the practical payoff.

Maximum 3 bridges. Each bridge must name a specific mechanism, not a vague link.

## Where It Appears

- Domain — specific use case
- Domain — specific use case

Maximum 5 bullets.

## Common Confusions

> ⚠ You might think **X** — but actually **Y** because **Z**.

Maximum 2.

## Guru's Note

One sentence written as advice from a senior student. Conversational, no jargon.
</content>
</note>

## Quality rules — enforced strictly

| Section | Passes if | Fails if |
|---|---|---|
| Plain English | No symbols, no jargon, genuinely one sentence | Contains a math symbol or domain term |
| Intuition | A different angle from the definition — visual or physical | Restates the definition in simpler words |
| Worked Example | Has actual numbers and shows every step | Is abstract or uses variables |
| Bridge | Names a specific mechanism linking two domains | Says "this concept is used in X" without explaining how |
| Guru's Note | Exactly one sentence | More than one sentence |

## LaTeX rules — strictly enforced

- ALL mathematical notation must be in LaTeX — never write math in plain text
- Inline math: `$...$` for variables and short expressions within sentences
- Block math: `$$...$$` for standalone equations, definitions, and worked example steps
- Matrices: use `\\begin{bmatrix}...\\end{bmatrix}`
- Never write `a_ij` — always write `$a_{ij}$`
- Never write `A = LU` in plain text — always write `$A = LU$`

## Naming convention

- Filenames: lowercase, singular, full phrases, no abbreviations
- Ambiguous terms get a full domain name prefix: `probability bayes theorem.md`, NOT `bayes.md`
- The frontmatter `title:` is always lowercase
- The `# Heading` at the top of the note body is always Title Case

## What warrants its own note

Generate a note for every concept that:
- Has a definition that can be stated precisely
- Has at least one non-trivial connection to another concept
- Would appear in an index or glossary of the subject

Pay special attention to bridge concepts — ideas that sit at the boundary between two subjects and are rarely named explicitly in either course. Generate bridge concepts as standalone notes in addition to component concept notes.

## Frontmatter rules

- `source:` always wrapped in double quotes
- `prereqs:`, `builds-into:`, `related:` always use `"[[wikilink]]"` syntax
- Empty lists: `prereqs: []`
- Each wikilink must exactly match the `title:` of the linked note
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

def build_session_context(domains, concepts, book_title, chapter_num, chapter_title):
    """Stable session context — cached at breakpoint 2."""
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

    lines += ["", f"### Existing vault concepts ({len(concepts)} concepts)", ""]

    if concepts:
        for title, meta in sorted(concepts.items()):
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
        lines += [
            "### Notes generated earlier in this chapter (available for wikilinks)",
            "",
        ]
        for n in session_notes:
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


def call_claude_code_cli(system_text, session_context, chunk_prompt):
    """Call Claude via Claude Code CLI using Pro plan auth. No prompt caching."""
    combined = "\n\n".join([
        "SYSTEM INSTRUCTIONS:\n" + system_text,
        session_context,
        chunk_prompt,
    ])
    try:
        result = subprocess.run(
            ["claude", "-p", combined, "--output-format", "json"],
            capture_output=True,
            text=True,
            timeout=300,
        )
    except FileNotFoundError:
        raise FileNotFoundError("claude CLI not found")
    except subprocess.TimeoutExpired:
        raise RuntimeError("claude CLI timed out after 5 minutes")

    combined_out = (result.stdout + result.stderr).lower()
    rate_limit_kws = ("rate limit", "usage limit", "too many request", "quota exceeded", "overloaded")
    if any(kw in combined_out for kw in rate_limit_kws):
        raise ClaudeCodeRateLimitError()

    if result.returncode != 0:
        raise RuntimeError(result.stderr[:300] or result.stdout[:300])

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
            return call_claude_code_cli(system_text, session_context, chunk_prompt)
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
    session_context = build_session_context(domains, concepts, book_title, args.chapter, chapter_title)

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
        bridge_cands = get_bridge_candidates(query, top_n=15)
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
