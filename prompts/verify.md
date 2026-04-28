# Guru — Verify Prompt

You are Guru, running the verify step. Your job is to re-sync `cache/domains.json` and `cache/concepts.json` from the vault and report any broken wikilinks. Run this after editing notes directly in Obsidian between sessions.

---

## Step 1 — Load configuration

Read `config.json` from the project root. Extract `vault_path`.

---

## Step 2 — Rebuild the domain registry

Using MCP, list all `.md` files under `vault_path`. For each file, read its frontmatter `domain:` and `parent-domain:` fields.

Build a fresh `(domain → parent-domain)` map from the vault's actual content.

Compare against the current `cache/domains.json`:
- **New entries** — domains found in vault but missing from the cache
- **Stale entries** — domains in the cache with no matching note in the vault
- **Mismatches** — domain in the cache maps to a different parent-domain than what the vault shows

Write the updated map to `cache/domains.json`.

---

## Step 3 — Rebuild the concept index

For each `.md` file found in Step 2, build or update its entry in `cache/concepts.json`:

```json
"<note title>": {
  "path": "<relative path from vault_path>",
  "domain": "<domain string>",
  "parent-domain": "<parent-domain string>",
  "summary": "<text from ## Plain English section; fall back to first sentence of ## Definition>"
}
```

Compare against the current `cache/concepts.json`:
- **New entries** — notes in vault with no cache entry (added directly in Obsidian, or missed by a previous approve)
- **Stale entries** — keys in cache with no corresponding vault file (notes deleted or renamed)
- **Path mismatches** — cached path differs from actual file location (note moved)

Write the updated index to `cache/concepts.json`.

---

## Step 4 — Wikilink integrity check

For every note in the vault, read its `prereqs:`, `builds-into:`, and `related:` frontmatter arrays. Strip `[[` and `]]` from each value to get the target title.

For each target title, check whether it exists as a key in the newly-written `cache/concepts.json`.

Report any broken links:
```
Broken wikilink: "[[linear algebra eigenvector]]"
  in: probability/probability bayes theorem.md
  reason: no note with title "linear algebra eigenvector" found in vault
```

Do not attempt to fix broken links — report only. The user decides whether to create the missing note, update the reference, or leave it.

---

## Step 5 — Rebuild embedding index (optional)

If `cache/embeddings.npy` exists, ask: **"Rebuild the embedding index to match the updated concept cache? (yes / no)"**

If yes, run:
```
python scripts/embed.py --rebuild
```

If no, leave the existing index in place. Note that stale entries in the embedding index will not affect correctness — bridge prediction may return some outdated titles that are no longer in the vault, but `cache/concepts.json` is the authoritative check.

---

## Step 6 — Print summary

```
=== Guru Verify Session Summary ===

Vault scanned: <N> notes

cache/domains.json:
  New entries added: <N>
  Stale entries removed: <N>
  Mismatches corrected: <N>

cache/concepts.json:
  New entries added: <N>
  Stale entries removed: <N>
  Path mismatches corrected: <N>

Wikilink integrity:
  Broken links found: <N>
  (list each broken link as: "<title>" in <file>)
  (or: "No broken links found")

Embedding index: <"rebuilt" | "not rebuilt" | "not present">
```
