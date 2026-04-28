# Guru — Pipeline Design Document

**Date:** 2026-04-25
**Status:** Proposal — pending implementation

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Critical Fixes](#2-critical-fixes)
3. [Architecture Proposal](#3-architecture-proposal)
4. [Cache Layer](#4-cache-layer)
5. [New Phase: Review](#5-new-phase-review)
6. [Enhanced Approve: Merge Workflow](#6-enhanced-approve-merge-workflow)
7. [Additional Improvements](#7-additional-improvements)
8. [Information Accuracy Tradeoffs](#8-information-accuracy-tradeoffs)
9. [Local Model Analysis](#9-local-model-analysis)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. Current State Assessment

### Pipeline Phases

```
PDF
 │
 ▼
overview.md       → book map written to vault root
 │
 ▼
ingest.md         → notes written to staging/chNN/
 │
 ▼
[informal review] → user reads a few notes manually
 │
 ▼
approve.md        → notes moved from staging to vault/{domain}/
```

All three phases are triggered manually by the user prompting Claude Code. There is no persistent state between sessions.

### Token Cost Breakdown (per session)

| Operation | Why it's expensive | Grows with vault? |
|---|---|---|
| Domain registry build | Reads every `.md` file's frontmatter | Yes — O(n) |
| Bridge prediction in overview | Reads all vault notes against each chapter topic | Yes — O(n) |
| Domain registry rebuild in ingest | Same scan, done again from scratch | Yes — O(n) |
| PDF TOC re-parsing in ingest | Overview already extracted this; ingest ignores it | No |
| Conflict detection in approve | Another vault traversal to find destination paths | Yes — O(n) |
| Chunk re-processing on crash | No progress state; full chapter re-read | No |

The core structural problem: **no persistent state between sessions**. Every phase re-derives everything from the vault on every run. As the vault grows toward thousands of notes this becomes the dominant cost.

---

## 2. Critical Fixes

These must be resolved before any new feature work.

### 2a. `config.json` Does Not Exist

Every prompt starts with "read `config.json` and do not proceed without it." The file is referenced in README.md and CLAUDE.md but is not in the repository. Every session currently fails at step one.

**Fix:** Create `config.json` at the project root:

```json
{
  "vault_path": "/Users/sriharisrinivasan/Documents/Obsidian/Vedam",
  "staging_path": "/Users/sriharisrinivasan/Documents/Github/GURU-AI/staging",
  "pdfs_path": "/Users/sriharisrinivasan/Documents/Github/GURU-AI/pdfs"
}
```

Also create the `staging/` and `pdfs/` directories, which do not exist.

### 2b. Overview Writes Directly to Vault

The book map is the only artifact that skips staging and writes directly to the vault. This is an intentional design choice (book maps are reference documents, not concept notes) but it is undocumented and inconsistent with the "staging before committing" design principle stated in the README.

**Fix:** Document this exception explicitly in CLAUDE.md and the overview prompt so the behavior is clearly intentional, not an oversight.

### 2c. No Rollback on Failed Approve

The approve prompt writes a note to the vault, verifies success, then deletes the staging copy. But "verify success" only checks that the write call did not throw an error — it does not read back the written file and compare it. A partial write (disk full, MCP timeout mid-write) would delete the staging copy while leaving a corrupted vault note.

**Fix:** Add a hold folder pattern. Instead of deleting staging copies immediately, move them to `staging/.completed/chNN/`. After the full approve session prints its summary and the user confirms, then delete the hold folder. This gives a one-session recovery window.

### 2d. Wikilinks Break on Note Rename

`prereqs`, `builds-into`, and `related` fields use `"[[note title]]"` wikilink syntax. If a note is renamed after being approved, all notes that reference it by the old title silently break — Obsidian will not show them as connected in the graph. There is currently no detection or repair path.

**Fix documented in Section 7c.**

### 2e. Note Schema Mismatch Between README and Prompts

The README describes the note schema as: Definition, Intuition, Formal notation, Bridge to other domains, Where it appears, Common confusions.

The ingest prompt uses a different schema: Plain English, Intuition, Formal Definition, Worked Example, Key Properties, Why It Works, Bridge to Other Domains, Where It Appears, Common Confusions, Guru's Note.

These have diverged and the README has not been updated. Any contributor or future session reading the README gets incorrect information about what notes look like.

**Fix:** Update README to reflect the schema in `prompts/ingest.md`, which is the operative definition.

---

## 3. Architecture Proposal

### Revised Pipeline

```
PDF
 │
 ▼
[pre-processing script]   ← local tool: extract text, structure, token estimate
 │  output: pdfs/cache/{book}/toc.json, chapters/{N}.txt
 │
 ▼
overview.md               ← reads: cache/domains.json, extracted TOC
 │  writes: vault/{book} - book map.md, cache/domains.json
 │
 ▼
ingest.md                 ← reads: cache/domains.json, cache/concepts.json,
 │                                 extracted chapter text, book map
 │  writes: staging/chNN/, cache/ingest-state.json (progress)
 │
 ▼
review.md                 ← reads: staging/chNN/
 │  validates schema, flags failures, presents only flagged notes
 │  writes: staging/chNN/ (fixes in place), staging/chNN/.review-log.json
 │
 ▼
approve.md                ← reads: cache/concepts.json (O(1) conflict lookup)
 │  handles: new notes, conflicts (merge / overwrite / skip)
 │  writes: vault/{domain}/, staging/.completed/chNN/
 │  updates: cache/domains.json, cache/concepts.json
 │  clears: staging/.completed/ on user confirmation
```

### What Changed and Why

| Phase | Current | Proposed | Reason |
|---|---|---|---|
| Pre-processing | None — Claude reads PDF directly | Local script extracts text/structure | Deterministic, free, no token cost |
| Overview input | PDF + vault scan | Extracted TOC + cache | Eliminates O(n) vault scan |
| Ingest input | PDF + vault scan | Extracted chapter text + cache + book map | Eliminates scan; avoids PDF re-parsing |
| Review | Informal / none | Formal schema validation prompt | Catches bad notes before vault entry |
| Approve conflict | Yes / no / skip | Merge / overwrite / skip | Enables multi-book enrichment |
| Approve cleanup | Delete staging immediately | Move to hold, delete on confirm | Recovery window for failed writes |

---

## 4. Cache Layer

Two JSON files in `cache/` replace all vault scanning. They are the source of truth for domain assignments and concept existence during sessions. The vault remains the source of truth for note content.

### `cache/domains.json`

Maps domain string → parent-domain string. Built from vault frontmatter; updated by approve when new domains are confirmed.

```json
{
  "probability": "mathematics",
  "machine learning": "computer science",
  "linear algebra": "mathematics",
  "signal processing": "applied science"
}
```

**Read by:** overview, ingest (replaces vault scan for domain registry)
**Written by:** approve (after new domains are confirmed), and cache verify command

### `cache/concepts.json`

Maps note title → metadata. Used for bridge prediction, conflict detection, and wikilink validation.

```json
{
  "probability bayes theorem": {
    "path": "probability/probability bayes theorem.md",
    "domain": "probability",
    "parent-domain": "mathematics",
    "summary": "A rule for updating belief given new evidence using prior probability and likelihood.",
    "source": "Introduction to Probability, Chapter 2: Conditional Probability"
  },
  "linear algebra eigenvalue": {
    "path": "linear algebra/linear algebra eigenvalue.md",
    "domain": "linear algebra",
    "parent-domain": "mathematics",
    "summary": "A scalar λ such that Av = λv for a non-zero vector v; characterizes how a matrix stretches space.",
    "source": "Applied Linear Algebra, Chapter 4: Eigenvalues and Eigenvectors"
  }
}
```

**Read by:** ingest (bridge prediction via summary similarity), approve (O(1) conflict lookup)
**Written by:** approve (adds new entries on successful vault write)

### Cache Lifecycle

```
First run (empty vault):
  → cache/domains.json initialized from seed hierarchy in CLAUDE.md
  → cache/concepts.json initialized as {}

Normal session:
  → overview/ingest read cache at session start
  → approve writes cache updates at session end

Manual vault edits (Obsidian):
  → cache can drift (see Section 8b)
  → user runs: "verify the Guru cache" to trigger a re-sync scan
```

### Cache Verify Procedure

When triggered, re-scans all vault `.md` files, rebuilds both cache files from scratch, and reports:
- Notes found in vault but missing from `concepts.json`
- Entries in `concepts.json` with no corresponding vault file (deleted notes)
- Domain mismatches between `domains.json` and actual frontmatter

This is the only operation that still requires an O(n) vault scan — but it is on-demand, not on every session.

---

## 5. New Phase: Review

A new prompt `prompts/review.md` inserted between ingest and approve.

### What It Does

1. Lists all notes in `staging/chNN/`
2. Runs the quality checklist from `ingest.md` against each note automatically:

| Section | Pass condition | Fail condition |
|---|---|---|
| Plain English | No symbols or domain jargon, exactly one sentence | Contains a math symbol or technical term |
| Intuition | Concrete visual or analogy, distinct from definition | Restates the definition in simpler words |
| Worked Example | Uses actual numbers, shows every step | Abstract, uses variables instead of numbers |
| Bridge | Names a specific mechanism between two domains | Says "used in X" without explaining how |
| Formal Definition | All math in LaTeX, no plain-text equations | Contains `A = LU` or `a_ij` outside LaTeX |
| Guru's Note | Exactly one sentence | More than one sentence |

3. Auto-approves notes that pass all checks
4. For flagged notes: shows the note title, the specific failing check, and the offending text
5. User responds: `approve` (pass as-is), `fix: <instruction>` (Guru edits in place), or `drop` (remove from staging)
6. Writes a `.review-log.json` into the chapter staging folder recording decisions

### Why This Matters at Scale

Without a formal review gate, quality issues compound. A note with a vague Bridge section or plain-text equations enters the vault and stays there — future bridge predictions and concept summaries built on it inherit the flaw. The review prompt catches structural problems when the cost of fixing them is lowest (before vault entry, while chapter context is still active).

---

## 6. Enhanced Approve: Merge Workflow

When approve detects a conflict (a staged note's destination path already exists in the vault), the current options are overwrite or skip. Neither handles the common case where the new note contains genuinely new information about the same concept from a different textbook.

### Merge Path

For each conflict, after the user selects `merge`:

1. Load the existing vault note and the staged note
2. Generate a structured comparison:
   - **Shared content** — information appearing substantively in both (safe to deduplicate)
   - **Vault-only content** — information only in the existing note (must be preserved)
   - **Staged-only content** — new information from the new source (candidate to append)
3. Propose a merged note:
   - Keeps the existing note's body intact
   - Appends staged-only content under a new subsection: `## Additional Perspectives`
   - Adds the new source to a `sources:` frontmatter list (replacing the single `source:` field)
   - Merges `prereqs`, `builds-into`, and `related` lists, deduplicating entries
4. Show the user the proposed merged note
5. User approves, edits, or rejects

### Updated Conflict Resolution Options

`merge` (default for conflicts) / `overwrite` (replace entirely) / `skip` (leave in staging)

### Frontmatter Change for Multi-Source Notes

Once a note has been enriched by a second source, `source:` becomes a list:

```yaml
sources:
  - "Introduction to Probability, Chapter 2: Conditional Probability"
  - "Pattern Recognition and Machine Learning, Chapter 1: Introduction"
```

The ingest and approve prompts need to handle both `source:` (single) and `sources:` (list) formats.

---

## 7. Additional Improvements

### 7a. Incremental Ingest State

If a chapter is processed in multiple calls (split-by-section or sliding window) and the session is interrupted, there is no record of which sections were completed. The user must re-process the entire chapter.

Add `cache/ingest-state.json`:

```json
{
  "book": "Applied Linear Algebra",
  "chapter_number": 3,
  "chapter_title": "Vector Spaces",
  "chunking_strategy": "split-by-section",
  "sections_completed": ["3.1 Subspaces", "3.2 Span"],
  "sections_remaining": ["3.3 Basis", "3.4 Dimension"],
  "notes_generated_so_far": 7,
  "started_at": "2026-04-25T14:32:00Z"
}
```

Written after each section completes. On session start, ingest checks for an in-progress state file and asks: **"Resume Chapter 3 from section 3.3? (yes / restart)"** Cleared when the chapter completes successfully.

### 7b. PDF Pre-Processing Script

Currently Claude Code reads PDFs natively. This is expensive (counts against context), lossy (multi-column layouts, table structure, and figure captions are frequently mangled), and non-deterministic (the same PDF read twice may yield different text ordering depending on the PDF's internal structure).

A local Python script using **PyMuPDF** (`pip install pymupdf`) should handle PDF extraction before any Claude session begins:

```
scripts/extract.py <pdf_path>
```

Output (written to `pdfs/cache/{book_slug}/`):
- `toc.json` — structured table of contents with chapter numbers, titles, section headings, and page ranges
- `chapter_{N}.txt` — clean plain-text extraction of each chapter
- `meta.json` — book title, author, total pages, estimated token counts per chapter

The ingest prompt then reads `chapter_{N}.txt` instead of the PDF. Text files have no extraction overhead and can be read exactly. Token estimates are pre-computed, not approximated at session start.

**Why this matters for accuracy:** Claude's native PDF reading often misreads equations in multi-column layouts and drops content between figure captions and body text. Clean text extraction is a prerequisite for reliable LaTeX generation.

### 7c. Wikilink Integrity Checker

`prereqs`, `builds-into`, and `related` fields use `"[[note title]]"` strings that must exactly match the `title:` field of the target note. If a note is renamed, all references to it break silently.

Add a wikilink check to the cache verify procedure:

1. For every entry in `concepts.json`, read the note's `prereqs`, `builds-into`, and `related` fields
2. Check each wikilink title against the keys of `concepts.json`
3. Report broken links: `"[[linear algebra eigenvector]]" in probability bayes theorem.md — no matching note found`

This surfaces breaks as soon as verify is run, rather than discovering them as dead graph edges in Obsidian.

### 7d. Bridge Concept Index

Bridge concepts are identified during ingest and generated as standalone notes, but they are mixed in with chapter notes in `staging/chNN/`. There is no way to see all bridge concepts across all chapters without a full vault scan.

Add a `bridges:` frontmatter field to bridge concept notes:

```yaml
bridges: ["linear algebra", "signal processing"]
```

The cache verify procedure and the approve prompt populate a `cache/bridges.json` index:

```json
{
  "singular value decomposition": {
    "bridges": ["linear algebra", "signal processing"],
    "path": "linear algebra/linear algebra singular value decomposition.md"
  }
}
```

This enables a future "show me all bridge concepts between domain A and domain B" query without scanning the vault.

### 7e. Book Processing Status Tracker

For a long-running knowledge base spanning many books and hundreds of chapters, there is no record of which chapters have been fully processed (overview → ingest → review → approve) versus partially processed or not started.

Add `cache/books.json`:

```json
{
  "applied linear algebra": {
    "book_map_path": "applied linear algebra - book map.md",
    "total_chapters": 10,
    "chapters": {
      "1": "approved",
      "2": "approved",
      "3": "in-staging",
      "4": "not-started"
    }
  }
}
```

Updated by each phase. Gives a single-file answer to "what's left to process in this book?"

---

## 8. Information Accuracy Tradeoffs

### 8a. Cache Staleness

The cache layer trades freshness for speed. The cache is authoritative during a session but can drift if vault notes are edited directly in Obsidian between sessions.

**Scenarios that cause drift:**

| Action in Obsidian | Cache effect |
|---|---|
| Rename a note | `concepts.json` key is stale; wikilinks in other notes break |
| Edit a note's `domain:` frontmatter | `concepts.json` summary may be outdated |
| Delete a note | `concepts.json` has a dangling entry |
| Create a note manually | `concepts.json` is missing the entry; bridge predictions can't reference it |
| Edit a note's `parent-domain:` | `domains.json` may have the old parent |

**Mitigation:** Run cache verify at the start of any session after a manual Obsidian editing session. The verify is O(n) but infrequent. Add a visual indicator: the verify output shows `Last verified: 2026-04-24` so you know how stale the cache might be.

**Risk rating:** Low for read-heavy use (just browsing Obsidian). High for workflows that involve frequent manual note editing between Guru sessions.

### 8b. LLM Hallucination in Bridge Identification

The most intellectually valuable output of the pipeline — bridge concepts — is also the most hallucination-prone. A language model may:
- Claim a connection between two domains that sounds plausible but is mathematically false
- Name a real connection but misstate the mechanism
- Invent a note title in `prereqs` or `related` that does not exist

**Current mitigations:**
- The review prompt checks that Bridge sections name a specific mechanism (not a vague link)
- Wikilink integrity checker (Section 7c) catches references to non-existent notes
- The `cache/concepts.json` summary field is populated from the ingest output, so if the ingest hallucinated, the summary inherits the error

**Mitigations to add:**
- During review, flag Bridge sections that reference a domain not in `domains.json` (likely hallucinated domain name)
- Flag `prereqs` / `related` wikilinks that do not appear in `concepts.json` at time of review (note doesn't exist yet — either it will be generated in this session, or it's a hallucination)
- For bridge concepts, require the review step to confirm: "does this bridge describe a real, named mathematical/scientific relationship?" before approving

**Inherent limitation:** There is no automated way to verify that a stated bridge is mathematically correct. That verification requires domain expertise and falls to the user during review. This is by design — Guru proposes, you decide.

### 8c. Domain Taxonomy Drift

As the vault grows and new books introduce new domains, the taxonomy can fragment. Two books might introduce "statistical inference" and "bayesian inference" as separate domains when they should be unified under one, or "optimization" might appear as a domain under both "mathematics" and "machine learning" independently.

**Current system:** Domains are locked in once confirmed and written to the cache. There is no reconciliation path.

**Mitigation:** Add a `guru merge-domains <domain-a> <domain-b>` operation to the approve prompt that:
1. Updates all notes in `domain-a/` to `domain: domain-b` in their frontmatter
2. Moves the files to `vault/domain-b/`
3. Updates `domains.json` to remove `domain-a`
4. Updates `concepts.json` entries
5. Logs the merge for the session summary

This is a manual operation but having a formal path for it prevents taxonomic rot.

### 8d. Worked Example Accuracy

LaTeX generation by language models is high-quality for standard notation but degrades for:
- Unusual notation introduced by specific textbooks
- Multi-line derivations where intermediate steps can be dropped
- Numerical results that the model computes rather than transcribes (arithmetic errors)

**Mitigation:** The review prompt's check for the Worked Example section (real numbers, every step shown) catches structural problems but cannot verify arithmetic. For notes in numerics-heavy domains (numerical methods, signal processing), flag Worked Example sections for manual arithmetic verification during review.

---

## 9. Local Model Analysis

### 9a. What "Local Model" Means Here

Three categories of local processing are worth distinguishing:

| Category | Examples | What it replaces |
|---|---|---|
| **Document parsing libraries** | PyMuPDF, pdfplumber, pypandoc | Claude reading PDFs natively |
| **Local embedding models** | sentence-transformers, nomic-embed-text | Claude doing similarity comparisons |
| **Local LLMs** | Ollama + LLaMA 3, Mistral, Phi-4 | Claude generating note content |

These have very different feasibility and quality profiles.

### 9b. Document Parsing Libraries (Recommended — High Value)

**Recommendation: Adopt immediately. No tradeoff.**

PDF parsing is a mechanical task — extract text, preserve structure, identify headings. It is not a reasoning task. A local library does this better than a language model in every dimension:

| Dimension | Claude (native PDF) | PyMuPDF |
|---|---|---|
| Cost | High — PDF tokens count against context | Free |
| Determinism | No — same PDF may parse differently | Yes — identical output every time |
| Multi-column layout | Often mangled | Handled correctly |
| Table structure | Often flattened | Preserved as structured data |
| Figure captions | Mixed into body text | Can be separated by bounding box |
| Math in PDF | Rendered as image regions — lost or garbled | Extracted as-is (depends on PDF encoding) |
| Speed | Slow (LLM inference time) | Fast (milliseconds per page) |

**Setup:** `pip install pymupdf` — no GPU, no model weights, runs on any machine.

**Limitation:** If math is stored as images in the PDF (scanned textbooks, older PDFs), PyMuPDF returns empty regions for equations. In this case, an OCR step (Tesseract + LaTeX-OCR) is needed before ingest. This is a separate, optional preprocessing path.

### 9c. Local Embedding Models (Recommended — Medium Value)

**Recommendation: Adopt for bridge prediction and concept deduplication. Small setup cost, meaningful token savings.**

Currently, bridge prediction works by asking Claude to read all vault notes and identify connections to the current chapter. As the vault grows this is the single most expensive operation in the pipeline.

A local embedding model replaces this with vector similarity search:

1. When a note is approved, compute its embedding from the `summary` field and store it in `cache/embeddings.npy`
2. At ingest time, embed the current chapter's concepts and run cosine similarity against all stored embeddings
3. Return the top-K most similar existing notes as bridge candidates
4. Claude only needs to read those K candidates (not the whole vault) to decide which bridges are meaningful

**Models:**
- `nomic-embed-text` (via Ollama) — 137M parameters, runs on CPU, excellent quality
- `sentence-transformers/all-MiniLM-L6-v2` — 23M parameters, very fast, good for English

**Setup:** `pip install sentence-transformers` or `ollama pull nomic-embed-text` — runs on CPU, no GPU required.

**Quality tradeoff:** Embeddings measure surface-level semantic similarity, not mathematical equivalence. Two concepts that use different terminology for the same idea (e.g., "covariance matrix" in statistics vs "Gram matrix" in machine learning) may have low cosine similarity despite being deeply related. Embedding-based search improves recall for obvious bridges but may miss subtle ones. Claude still makes the final judgment — the embedding only controls which candidates it sees.

**Expected token reduction:** If the vault has 500 notes and K=10, bridge prediction goes from reading 500 notes to reading 10 — a 98% reduction in that step.

### 9d. Local LLMs for Note Generation (Not Recommended — Quality Gap Too Large)

**Recommendation: Do not replace Claude for note generation. The quality gap is prohibitive for the core value of this pipeline.**

The highest-value output of Guru — bridge concepts, intuitions, and cross-domain connections — requires the kind of reasoning that current local models handle poorly at practical sizes.

**Specific failure modes of local models (7B–13B) on note generation:**

| Task | Claude Sonnet/Opus | Local 13B |
|---|---|---|
| LaTeX correctness | High — rarely misses braces, environments | Moderate — drops subscripts, mangles environments |
| Bridge concept identification | High — recognizes non-obvious cross-domain equivalences | Low — tends to surface obvious connections only |
| Intuition quality | High — generates genuinely novel analogies | Low — frequently restates the definition |
| Multi-step worked examples | High — arithmetic usually correct | Moderate — arithmetic errors in multi-step problems |
| Domain terminology accuracy | High | Moderate — may mix notation between traditions |
| Guru's Note (single-sentence insight) | High | Low — tends toward generic statements |

**At 70B sizes (LLaMA 3 70B, Mixtral 8x22B):** Quality is substantially better — LaTeX is mostly correct, bridges are reasonable — but still below Claude Sonnet on the tasks that matter most for this pipeline. Requires GPU hardware (48GB+ VRAM) that is not assumed to be available.

**The cost tradeoff framed correctly:** The expensive part of the current pipeline is not note generation — it is the mechanical vault scanning that happens before note generation. Fixing that (cache layer + local PDF parsing) brings the cost down dramatically while keeping Claude for the reasoning tasks where it has a real advantage. Replacing Claude with a local LLM to save cost while keeping the expensive vault scans is solving the wrong problem.

**When a local LLM would make sense:**
- Batch pre-screening: a small local model (Phi-4, Gemma 3) could do a first pass to identify which sections of a chapter contain major concepts worth generating notes for, reducing what Claude needs to read
- This is an optional optimization once the cache layer is in place and the remaining cost is the note generation itself

### 9e. Recommended Hybrid Architecture

```
PDF
 │
 ▼
PyMuPDF (local, free)
 │  → clean chapter text
 │  → structured TOC
 │  → token count estimates
 │
 ▼
sentence-transformers (local, free)
 │  → embed chapter concepts against cache/embeddings.npy
 │  → return top-K candidate bridge notes
 │
 ▼
Claude Code (API cost, high quality)
 │  reads: extracted text, book map, domains.json, concepts.json, top-K bridge candidates
 │  does: note generation, bridge identification, LaTeX, intuitions, domain proposals
 │  writes: staging/chNN/
```

**Expected cost reduction vs current approach:**

| Component | Current | Proposed |
|---|---|---|
| PDF parsing | API tokens | Free (PyMuPDF) |
| Vault scanning (domain registry) | O(n) reads per session | O(1) cache read |
| Bridge prediction | O(n) note reads | O(K) candidate reads, K << n |
| Note generation | API tokens | API tokens (unchanged) |
| **Total session cost** | High, grows unboundedly | Low, approximately constant |

---

## 10. Implementation Roadmap

Ordered by: impact first, dependencies respected.

### Phase 0 — Critical Fixes (do before anything else)

- [ ] Create `config.json` with correct paths
- [ ] Create `staging/` and `pdfs/` directories
- [ ] Update README to match current note schema (ingest.md is authoritative)
- [ ] Document the overview→vault-direct exception in CLAUDE.md and overview.md
- [ ] Add hold-folder pattern to approve.md (staging/.completed/ before delete)

### Phase 1 — Cache Layer

- [ ] Define `cache/domains.json` schema; seed from CLAUDE.md hierarchy
- [ ] Define `cache/concepts.json` schema
- [ ] Update `overview.md` to read `cache/domains.json` instead of scanning vault
- [ ] Update `ingest.md` to read both cache files; remove vault scan
- [ ] Update `approve.md` to write cache updates after successful vault write
- [ ] Write cache verify procedure into a new `prompts/verify.md`

### Phase 2 — PDF Pre-Processing

- [ ] Write `scripts/extract.py` using PyMuPDF
- [ ] Define output structure under `pdfs/cache/{book_slug}/`
- [ ] Update `ingest.md` to read from extracted text files, not PDF directly
- [ ] Update `overview.md` to read from `toc.json`, not PDF directly
- [ ] Add scanned-PDF detection: if a page has no extractable text, warn and suggest OCR path

### Phase 3 — Review Phase

- [ ] Write `prompts/review.md` with the quality checklist
- [ ] Add `.review-log.json` output format
- [ ] Update CLAUDE.md pipeline diagram to include review phase
- [ ] Update README pipeline diagram

### Phase 4 — Enhanced Approve

- [ ] Add merge workflow to `approve.md`
- [ ] Define `## Additional Perspectives` subsection format
- [ ] Define `sources:` (list) frontmatter field; update approve to handle both `source:` and `sources:`
- [ ] Update `cache/concepts.json` schema to support multiple sources per note

### Phase 5 — Embedding-Based Bridge Prediction

- [ ] Write `scripts/embed.py` using sentence-transformers
- [ ] Define `cache/embeddings.npy` + `cache/embedding-index.json` (title → row mapping)
- [ ] Update approve.md to compute and store embeddings when adding to concepts.json
- [ ] Update ingest.md to query embeddings for top-K bridge candidates instead of vault scan
- [ ] Instrument: log how many bridge candidates were surfaced vs how many became actual bridges

### Phase 6 — Operational Tooling

- [ ] Add `cache/books.json` chapter status tracker; update each phase to write to it
- [ ] Add `cache/ingest-state.json` incremental progress; update ingest to check on startup
- [ ] Add `cache/bridges.json` bridge index; update approve to maintain it
- [ ] Add wikilink integrity check to verify procedure
- [ ] Add domain merge operation to approve prompt

---

*Document end. All proposed changes to prompt files should be implemented in `prompts/`. All new scripts go in `scripts/`. All cache files go in `cache/` (add `cache/` to `.gitignore` except for `domains.json` which should be version-controlled as the canonical domain taxonomy).*
