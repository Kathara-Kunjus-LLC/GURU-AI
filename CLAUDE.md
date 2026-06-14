# CLAUDE.md — Guru Project Memory

## Project Overview

**Guru** is an AI-powered knowledge pipeline that processes textbook PDFs into Obsidian notes.
**Vedam** is the Obsidian vault Guru writes into — the permanent personal knowledge base.

Guru generates notes into a staging area first. The user reviews them. The approve step moves them into Vedam.

---

## Paths

Always read `config.json` at the start of every session for canonical paths. Do not hardcode paths in prompts or outputs.

| Key            | Path                                                         |
|----------------|--------------------------------------------------------------|
| `vault_path`   | `/Users/sriharisrinivasan/Documents/Obsidian/Vedam`          |
| `staging_path` | `/Users/sriharisrinivasan/Documents/Github/GURU-AI/staging`  |
| `pdfs_path`    | `/Users/sriharisrinivasan/Documents/Github/GURU-AI/pdfs`     |

---

## Prompts

Five prompts live in `prompts/`:

- `prompts/overview.md` — book map generation before chapter processing begins
- `prompts/ingest.md` — note generation from a PDF chapter
- `prompts/review.md` — quality validation of staged notes before approval
- `prompts/approve.md` — moving staged notes into the Vedam vault
- `prompts/verify.md` — cache re-sync and wikilink integrity check (run after manual Obsidian edits)

---

## Naming Convention

- Filenames: **lowercase, singular, full phrases, no abbreviations**
- Multi-word names use spaces (Obsidian handles these fine)
- Ambiguous terms get a **full domain name prefix**, not an abbreviation
  - Correct: `probability bayes theorem.md`
  - Wrong: `bayes.md`, `prob bayes thm.md`, `p-bayes.md`
- The domain prefix should be the full domain name as it appears in vault frontmatter

---

## Domain Hierarchy — Seed Registry

Every note has two domain fields: `domain` (the specific subject area) and `parent-domain` (the top-level category). The hierarchy below is the **seed** — a starting point, not a fixed list. New domains and parent-domains can be added at any time as the vault grows.

```
mathematics
  - linear algebra
  - statistics
  - probability
  - numerical methods

computer science
  - machine learning
  - artificial intelligence
  - data science
  - databases
  - systems design
  - coding

cloud & infrastructure
  - aws
  - azure
  - distributed systems

finance
  - portfolio theory
  - derivatives
  - quantitative finance

applied science
  - signal processing
  - differential equations
  - control systems
```

Domain naming rules: **lowercase, full words, no abbreviations**.

---

## Domain Registry — Cache-Backed

Domains are **never hardcoded**. At the start of every session, read `cache/domains.json` from the project root — do not scan the vault.

`cache/domains.json` maps every known `domain` string to its `parent-domain` string. It is seeded from the hierarchy above and updated by the approve step whenever a new domain is confirmed by the user.

When assigning domains to a new note:
- Check if an exact `domain` match exists in `cache/domains.json`
- If yes — use it, and assign the matching `parent-domain` from the file
- If no match — propose a new `domain` name **and** its `parent-domain`
- If the `parent-domain` is also new — propose that too
- Flag **all** new proposals in the session summary for user confirmation
- Never invent domain or parent-domain values silently
- If a domain proposal is made and the user does not confirm it in the same session, do not use it

If `cache/domains.json` is missing or unreadable, fall back to the seed hierarchy above and notify the user.

---

## Cache Layer

Two files in `cache/` replace all vault scanning. Read them at the start of every session; the approve step writes updates after each successful vault write.

| File | Contents | Tracked in git? |
|---|---|---|
| `cache/domains.json` | `domain → parent-domain` map | Yes — canonical taxonomy |
| `cache/concepts.json` | `note title → {path, domain, parent-domain, summary}` | Yes |
| `cache/embeddings.npy` | Embedding matrix for bridge candidate search | No — regeneratable |
| `cache/embedding-index.json` | Row index → note title mapping | No — regeneratable |

**`cache/concepts.json` entry shape:**
```json
"probability bayes theorem": {
  "path": "probability/probability bayes theorem.md",
  "domain": "probability",
  "parent-domain": "mathematics",
  "summary": "A rule for updating belief given new evidence using prior probability and likelihood."
}
```

**Cache lifecycle:**
- `cache/domains.json` — seeded on first use from the seed hierarchy; approve appends confirmed new domains
- `cache/concepts.json` — starts as `{}`; approve appends one entry per note moved to vault
- If either file becomes stale (e.g., notes edited or renamed directly in Obsidian), run `prompts/verify.md` to re-sync from the vault

**Do not scan the vault for domains or concepts during overview, ingest, or approve sessions. Read the cache files instead.**

---

## Chunking Strategy

Before processing any chapter, estimate its token count.

| Token range          | Strategy                                                                                 |
|----------------------|------------------------------------------------------------------------------------------|
| Under 15,000         | Process the entire chapter in a single call                                              |
| 15,000 – 40,000      | Split by section headings; process each section separately                               |
| Section > 15,000     | Use sliding window: current section + 500-token summary of the previous section          |

Token estimation: ~1 token per 4 characters of plain text is a safe approximation for English prose with equations.

---

## Note Schema

Every generated note must have this exact frontmatter followed by these exact sections in order:

```markdown
---
title: <full concept name — lowercase, singular, no abbreviations>
domain: <exact domain string from cache/domains.json, or proposed new domain>
parent-domain: <exact parent-domain string from cache/domains.json, or proposed new parent-domain>
source: "<textbook title, Chapter N: Chapter Name>"
prereqs: ["[[note title]]", "[[note title]]"]
builds-into: ["[[note title]]"]
related: ["[[note title]]"]
---

# Concept Name in Title Case

## Plain English

## Intuition

## Formal Definition

## Worked Example

## Key Properties

## Why It Works

## Bridge to Other Domains

## Common Confusions

## Guru's Note
```

Section caps: Key Properties max 3, Bridge to Other Domains max 2 (this section also absorbs cross-domain appearances — there is no separate "Where It Appears" section), Common Confusions optional and max 1. Plain English and Guru's Note are exactly one sentence; Intuition max 2 sentences; Why It Works 2–3 sentences.

**Frontmatter rules:**
- `source:` always wrapped in double quotes
- `prereqs:`, `builds-into:`, `related:` always use `"[[wikilink]]"` syntax so Obsidian draws graph edges
- Empty lists: `prereqs: []`
- Multi-source notes (after a merge): use `sources:` as a YAML list instead of `source:`

**The Bridge to Other Domains section is the most important.** Each entry must:
- Use the format `> **→ [Domain Name]:** one sentence naming the exact mechanism`
- Name a specific mechanism — never say "this concept is used in X" without explaining how
- Be followed by `> *Why it matters:* one sentence on the practical payoff`

---

## Bridge Concepts

Pay special attention to **bridge concepts**: ideas that sit at the boundary between two subjects and are rarely named explicitly in either course. These are the highest-value notes to generate. Examples of the pattern (not a fixed list):

- A mathematical structure that appears in both physics and information theory under different names
- An algorithm that is taught as an optimization technique in one course and a statistical inference method in another
- A geometric object that appears in linear algebra, quantum mechanics, and computer graphics independently

When you find a bridge concept, generate it as its own standalone note in addition to the notes for the component concepts.

---

## Session Summary

At the end of every ingest session, print a summary that includes:
- Number of notes generated
- Staging path used (`staging/chXX/`)
- List of any new domain or parent-domain proposals awaiting user confirmation (show as `domain (parent: parent-domain)`)
- Any bridge concepts identified (title and the two domains they bridge)
- Any chapters or sections skipped and why

---

## General Rules

- Always read `config.json` first — do not assume paths
- Never write notes directly to the vault; always write to staging first
- The overview prompt is the only exception: it writes the book map directly to the vault root (not staging). Book maps are reference documents, not concept notes, and bypass the staging step intentionally.
- Never overwrite existing vault notes without explicit user confirmation
- Use MCP for all filesystem reads/writes to the vault
- Do not scan the vault for domains or concepts — read `cache/domains.json` and `cache/concepts.json` instead
- If a domain or parent-domain proposal is made and the user does not confirm it in the same session, do not use it
