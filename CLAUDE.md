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

Two prompts live in `prompts/`:

- `prompts/ingest.md` — note generation from a PDF chapter
- `prompts/approve.md` — moving staged notes into the Vedam vault

---

## Naming Convention

- Filenames: **lowercase, singular, full phrases, no abbreviations**
- Multi-word names use spaces (Obsidian handles these fine)
- Ambiguous terms get a **full domain name prefix**, not an abbreviation
  - Correct: `probability bayes theorem.md`
  - Wrong: `bayes.md`, `prob bayes thm.md`, `p-bayes.md`
- The domain prefix should be the full domain name as it appears in vault frontmatter

---

## Domain Registry — Dynamic, Not Static

Domains are **never hardcoded**. At the start of every ingest session:

1. Scan all `.md` files in the vault using MCP
2. Read each file's frontmatter `domain:` field
3. Build a live registry of existing domain values (exact strings, case-preserved)
4. When assigning a domain to a new note, **match exactly** to an existing domain value if one fits
5. If no existing domain fits, **propose a new domain name** and flag it in the session summary for user confirmation before writing it into notes
6. Never invent domain names silently

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

Every generated note must have this exact frontmatter followed by these exact sections:

```markdown
---
title: <full concept name>
domain: <exact domain string from live registry, or proposed new domain>
source: <textbook title, chapter number and name>
prereqs: [<list of note titles this concept depends on>]
builds-into: [<list of note titles that build on this concept>]
related: [<list of thematically related note titles>]
---

## Definition

## Intuition

## Formal notation

## Bridge to other domains

## Where it appears

## Common confusions
```

The **Bridge to other domains** section is the most important. It must:
- Name the specific mechanism connecting this concept to another subject
- Be explicit — name the other domain and the connecting idea
- Never be left vague or omitted

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
- List of any new domain proposals awaiting user confirmation
- Any bridge concepts identified (title and the two domains they bridge)
- Any chapters or sections skipped and why

---

## General Rules

- Always read `config.json` first — do not assume paths
- Never write notes directly to the vault; always write to staging first
- Never overwrite existing vault notes without explicit user confirmation
- Use MCP for all filesystem reads/writes to the vault
- If a domain proposal is made and the user does not confirm it in the same session, do not use it
