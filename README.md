# Guru

Guru is an AI-powered knowledge pipeline that transforms textbook PDFs into deeply connected Obsidian notes, building a personal knowledge base called **Vedam**.

---

## The Problem

University courses teach concepts in isolation. Calculus doesn't mention signal processing. Linear algebra doesn't mention machine learning. Thermodynamics doesn't mention information theory. By the time a concept appears in a second course under a different name, the connection is never made explicit.

The result: knowledge that feels fragmented even when it isn't. Concepts you "know" that you can't transfer.

Guru solves this by treating every concept as a node in a graph. When it processes a textbook chapter, it doesn't just extract definitions — it hunts for **bridge concepts**: ideas that sit at the boundary between two subjects, rarely named explicitly in either course. These bridges become first-class notes in Vedam.

---

## Architecture

Guru has two parts that work together:

**Pipeline** — runs in Claude Code. Extracts text from PDFs using a local Python script, generates notes using Claude, and manages a staging area before anything enters the vault.

**UI (`guru-ui/`)** — a local web app that reads the Vedam vault live and renders it as an interactive force-directed graph. Runs alongside the pipeline; the graph updates automatically whenever notes are approved into the vault.

```
PDF
 │
 ▼
scripts/extract.py          ← local Python: extracts text + structure from PDF (free, no API cost)
 │  output: pdfs/cache/{book}/
 │
 ▼
Claude Code — prompts/overview.md
 │  reads extracted TOC, builds book map, identifies bridge predictions
 │  writes: vault/{book} - book map.md
 │
 ▼
Claude Code — prompts/ingest.md
 │  reads extracted chapter text + cache/concepts.json (bridge candidates via embeddings)
 │  generates one note per concept, writes to staging/chNN/
 │
 ▼
Claude Code — prompts/review.md
 │  validates each staged note against quality checklist
 │  surfaces only failing notes for your review
 │
 ▼
Claude Code — prompts/approve.md
 │  checks for conflicts, supports merge for overlapping concepts
 │  moves approved notes into vault/{domain}/
 │  updates cache/domains.json and cache/concepts.json
 │
 ▼
Vedam vault                 ← permanent knowledge base
 │
 ▼
guru-ui/                    ← graph updates live via WebSocket
```

---

## Note Schema

Every note in Vedam follows this structure:

```yaml
---
title: <concept name — lowercase, singular, full phrase>
domain: <subject area>
parent-domain: <top-level category>
source: "<textbook title, Chapter N: Chapter Name>"
prereqs: ["[[note title]]", "[[note title]]"]
builds-into: ["[[note title]]"]
related: ["[[note title]]"]
---
```

Followed by these sections in order:

1. **Plain English** — one sentence, no jargon or symbols
2. **Intuition** — a concrete analogy or visual, distinct from the definition
3. **Formal Definition** — full LaTeX definition
4. **Worked Example** — concrete numbers, every step shown
5. **Key Properties** — maximum five, in LaTeX
6. **Why It Works** — 2–4 sentences explaining the core insight
7. **Bridge to Other Domains** — the most important section; names the exact mechanism connecting this concept to another subject
8. **Where It Appears** — maximum five bullets
9. **Common Confusions** — maximum two misconceptions
10. **Guru's Note** — one sentence of advice from a senior student

---

## Repository Layout

```
GURU-AI/
├── pdfs/                   # drop source PDFs here (gitignored)
├── staging/                # generated notes await review here (gitignored)
├── cache/
│   ├── domains.json        # live domain registry — version-controlled
│   ├── concepts.json       # note index for bridge lookup — version-controlled
│   ├── embeddings.npy      # embedding matrix — gitignored (regeneratable)
│   └── embedding-index.json
├── prompts/
│   ├── overview.md         # book map generation
│   ├── ingest.md           # note generation
│   ├── review.md           # pre-approve quality check
│   ├── approve.md          # move staged notes to vault
│   └── verify.md           # re-sync cache from vault (run after manual edits)
├── scripts/
│   ├── extract.py          # PDF → plain text (PyMuPDF)
│   └── embed.py            # concepts.json → embeddings (sentence-transformers)
├── guru-ui/                # web graph viewer
│   ├── server/             # Express + WebSocket (local mode)
│   ├── scripts/            # build-vault script (deploy mode)
│   └── src/                # React app
├── sample-vault/           # example notes for testing
├── config.json             # machine-specific paths — gitignored, must be created
├── requirements.txt        # pinned Python dependencies
├── Pipfile                 # Pipenv dependency spec
├── CLAUDE.md               # pipeline instructions for Claude Code
└── DESIGN.md               # architecture and improvement proposals
```

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Python](https://python.org) | 3.11 | PDF extraction + embeddings scripts |
| [Pipenv](https://pipenv.pypa.io) | any | Python dependency management |
| [Node.js](https://nodejs.org) | 20 LTS | Guru UI dev server and build |
| [Claude Code](https://claude.ai/code) | latest | Running the pipeline prompts |
| [Obsidian](https://obsidian.md) | any | Browsing the Vedam vault |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/GURU-AI.git
cd GURU-AI
```

### 2. Set up Python environment

**Using Pipenv (recommended — ensures identical environments):**

```bash
pipenv install
pipenv shell
```

After the first `pipenv install`, commit the generated `Pipfile.lock` so your collaborator gets the exact same versions:

```bash
git add Pipfile.lock
git commit -m "Lock Python dependency versions"
```

**Using pip (alternative):**

```bash
python3.11 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

> **Note on PyTorch:** `sentence-transformers` installs PyTorch as a dependency. The default PyPI build includes CUDA support and is ~2 GB. For CPU-only (no GPU needed for this project), install the lighter CPU build first:
> ```bash
> pip install torch --index-url https://download.pytorch.org/whl/cpu
> pip install -r requirements.txt
> ```

### 3. Set up Node.js

Using [nvm](https://github.com/nvm-sh/nvm) (recommended):

```bash
cd guru-ui
nvm install    # reads .nvmrc, installs Node 20
nvm use
npm install
cd ..
```

Without nvm — ensure `node --version` shows v20.x, then:

```bash
cd guru-ui && npm install && cd ..
```

### 4. Create `config.json`

`config.json` is gitignored because vault paths are machine-specific. Create it at the project root:

```json
{
  "vault_path": "/absolute/path/to/your/Obsidian/vault",
  "staging_path": "/absolute/path/to/GURU-AI/staging",
  "pdfs_path": "/absolute/path/to/GURU-AI/pdfs"
}
```

Example for the default setup:

```json
{
  "vault_path": "/Users/yourname/Documents/Obsidian/Vedam",
  "staging_path": "/Users/yourname/Documents/Github/GURU-AI/staging",
  "pdfs_path": "/Users/yourname/Documents/Github/GURU-AI/pdfs"
}
```

### 5. Create the vault directory

```bash
mkdir -p /path/to/your/Obsidian/vault
```

### 6. Configure Claude Code MCP

Claude Code needs filesystem access to read and write the vault. Add the vault path to your MCP filesystem configuration in Claude Code settings. Without this, the pipeline prompts cannot read or write vault files.

### 7. Verify setup

Test the Python scripts against the sample vault:

```bash
# From project root, with pipenv shell active (or .venv activated)
python scripts/extract.py --help
python scripts/embed.py --help
```

Test the UI against the sample vault:

```bash
# Temporarily point config.json at sample-vault/ to test without a real vault
# Edit vault_path to: "/absolute/path/to/GURU-AI/sample-vault"
cd guru-ui
npm run dev
# Open http://localhost:5173 — you should see 14 notes in the graph
```

---

## Running the UI

```bash
cd guru-ui
npm run dev
```

Opens two processes:
- Express server on `http://localhost:3001` — reads vault live, serves graph API
- Vite dev server on `http://localhost:5173` — the React app

Open `http://localhost:5173` in your browser. The graph updates automatically whenever notes are approved into the vault.

**Keyboard shortcuts in the graph:**
- Click node → open note panel
- Click wikilink in note panel → navigate to that note
- Double-click background → deselect / close panel
- Browser back button → works as expected

---

## Day-to-Day Pipeline Usage

### Step 1 — Extract PDF (local, one-time per book)

```bash
# With pipenv:
pipenv run python scripts/extract.py "textbook name.pdf"

# With venv:
python scripts/extract.py "textbook name.pdf"
```

Outputs to `pdfs/cache/{book_slug}/`: clean chapter text files, structured table of contents, and per-chapter token estimates. This runs locally with no API cost and only needs to be done once per book.

### Step 2 — Run Overview (Claude Code)

Drop the PDF into `pdfs/`, then in Claude Code:

```
Run prompts/overview.md for [textbook name]
```

Produces a book map in the vault with chapter dependency graph, domain assignments, bridge predictions, and recommended ingestion order.

### Step 3 — Ingest a chapter (Claude Code)

```
Run prompts/ingest.md for Chapter 3 of [textbook name]
```

Generates notes into `staging/ch03/`. Uses the extracted chapter text and embedding-based bridge prediction — no vault scanning required.

### Step 4 — Review staged notes (Claude Code)

```
Run prompts/review.md for staging/ch03/
```

Automatically checks every note against the quality checklist. Only surfaces notes that fail (vague Bridge section, abstract Worked Example, etc.) for your attention. Auto-approves the rest.

### Step 5 — Approve into vault (Claude Code)

```
Run prompts/approve.md
```

For new notes: moves them directly into `vault/{domain}/`.
For conflicts (concept already exists from another book): presents a structured merge showing what's new, and proposes an enriched note combining both sources. You choose: `merge`, `overwrite`, or `skip`.

Updates `cache/domains.json` and `cache/concepts.json` after each successful write.

### Verify cache after manual edits

If you edit notes directly in Obsidian between sessions, re-sync the cache:

```
Run prompts/verify.md
```

This re-scans the vault, rebuilds the cache, and reports any broken wikilinks.

---

## Deploying the UI (optional)

To share Vedam as a static site:

```bash
# Build vault snapshot
cd guru-ui
npm run build:vault    # writes public/graph.json + public/notes/

# Build static site
npm run build          # outputs to dist/

# Deploy dist/ to Vercel, GitHub Pages, Netlify, or any static host
```

After approving new notes, re-run both build steps and redeploy to update the site.

---

## Naming Convention

- Note filenames: lowercase, singular, full phrases, no abbreviations
- Multi-word names use spaces — Obsidian handles these correctly
- Ambiguous terms get a full domain name prefix: `probability bayes theorem.md`, not `bayes.md`
- Domains: lowercase, full words, no abbreviations (`linear algebra`, not `lin alg`)

---

## Design Principles

- **Bridges over definitions.** A definition you can look up. A bridge between subjects you might never find on your own.
- **Local tools for mechanical work.** PDF extraction and embedding search run locally for free. Claude is used only for reasoning tasks: generating notes, identifying bridges, writing intuitions.
- **Staging before committing.** Nothing enters Vedam without your review. Guru proposes; you decide.
- **No silent overwrites.** The approve step always asks before touching an existing note. Conflicts default to merge, not replace.
- **Cache over scanning.** Domain registry and concept index are persisted in `cache/` and updated incrementally. No full vault scan on every session.
