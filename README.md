# Guru

Guru is an AI-powered knowledge pipeline that transforms textbook PDFs into deeply connected Obsidian notes, building a personal knowledge base called **Vedam**.

---

## The Problem

University courses teach concepts in isolation. Calculus doesn't mention signal processing. Linear algebra doesn't mention machine learning. Thermodynamics doesn't mention information theory. By the time a concept appears in a second course under a different name, the connection is never made explicit.

The result: knowledge that feels fragmented even when it isn't. Concepts you "know" that you can't transfer.

Guru solves this by treating every concept as a node in a graph. When it processes a textbook chapter, it doesn't just extract definitions — it hunts for **bridge concepts**: ideas that sit at the boundary between two subjects, rarely named explicitly in either course. These bridges become first-class notes in Vedam.

---

## What Guru Builds

**Vedam** — a Sanskrit word meaning knowledge — is the Obsidian vault Guru writes into. Every note in Vedam follows a fixed schema:

```yaml
---
title: <concept name>
domain: <subject area>
source: <textbook, chapter>
prereqs: [<note titles>]
builds-into: [<note titles>]
related: [<note titles>]
---
```

Followed by these sections in order:

1. **Definition** — precise, unambiguous
2. **Intuition** — one concrete analogy or mental model
3. **Formal notation** — equations, symbols, standard form
4. **Bridge to other domains** — the most important section; names the exact mechanism connecting this concept to another subject
5. **Where it appears** — courses, textbooks, real systems
6. **Common confusions** — misconceptions and how to resolve them

---

## The Pipeline

```
PDF
 │
 ▼
pdfs/                        ← drop textbook PDFs here
 │
 ▼
Guru (Claude Code + ingest prompt)
 │  reads config.json for paths
 │  scans Vedam vault for existing domains
 │  estimates token count, applies chunking
 │  generates one note per major concept
 │
 ▼
staging/chXX/                ← generated notes land here for review
 │
 ▼
You (review in Obsidian or editor)
 │  edit, discard, or approve notes
 │
 ▼
Guru (Claude Code + approve prompt)
 │  checks for conflicts with existing vault notes
 │  moves approved notes to Vedam
 │  clears staging/
 │
 ▼
Vedam vault                  ← permanent knowledge base
```

---

## Repository Layout

```
GURU-AI/
├── pdfs/               # drop source PDFs here
├── staging/            # staging area for generated notes
│   └── chXX/           # one subfolder per chapter processed
├── prompts/
│   ├── ingest.md       # prompt for note generation
│   └── approve.md      # prompt for moving notes to vault
├── config.json         # paths config (vault, staging, pdfs)
├── CLAUDE.md           # project memory for Claude Code sessions
└── README.md
```

---

## Setup

### Prerequisites

- [Claude Code](https://claude.ai/code) with MCP filesystem access configured for the Vedam vault path
- [Obsidian](https://obsidian.md) with the Vedam vault open at `/Users/sriharisrinivasan/Documents/Obsidian/Vedam`

### First-time setup

1. Clone this repo into `~/Documents/Github/GURU-AI`
2. Verify `config.json` paths match your local machine
3. Confirm Claude Code MCP has read/write access to the vault path in `config.json`
4. Create the vault folder if it doesn't exist:
   ```
   mkdir -p /Users/sriharisrinivasan/Documents/Obsidian/Vedam
   ```

---

## Day-to-Day Usage

### Processing a new chapter

1. Drop the textbook PDF into `pdfs/`
2. Open Claude Code in the `GURU-AI` directory
3. Run:
   ```
   Process chapter 3 of [textbook name] using prompts/ingest.md
   ```
4. Guru will generate notes into `staging/ch03/`
5. Open the staging folder in your editor or Obsidian and review each note
6. Delete any notes you don't want, edit any that need adjustment

### Approving notes into Vedam

Once you're satisfied with the staging notes:

```
Run prompts/approve.md
```

Guru will:
- Check each staging note against existing vault notes
- Ask before overwriting any conflict
- Move approved notes into the Vedam vault
- Clear the staging folder
- Print a summary of what moved

### Browsing Vedam

Open the Obsidian vault at `/Users/sriharisrinivasan/Documents/Obsidian/Vedam`. Use the graph view to navigate bridge concepts — the most valuable notes are the ones with edges into multiple domains.

---

## Naming Convention

- Note filenames: lowercase, singular, full phrases, no abbreviations
- Ambiguous terms get a domain prefix using the full domain name (not abbreviation)
- Example: `probability bayes theorem.md` not `bayes.md` or `prob bayes thm.md`
- Domains are discovered dynamically by scanning vault frontmatter — never hardcoded

---

## Design Principles

- **Bridges over definitions.** A definition you can look up. A bridge between subjects you might never find on your own.
- **Staging before committing.** Nothing enters Vedam without your review. Guru proposes; you decide.
- **No silent overwrites.** The approve step always asks before touching an existing note.
- **Live domain registry.** Domains are read from the vault at the start of every session, not from a static list. The taxonomy grows with your knowledge.
