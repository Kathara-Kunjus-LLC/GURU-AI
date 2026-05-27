"""
chunk.py — Split extracted chapter text into processable chunks for batch_ingest.py.

Usage:
    python scripts/chunk.py <book_slug> <chapter_number>
    python scripts/chunk.py <book_slug> <chapter_number> --force

Reads:
    pdfs/cache/{book_slug}/chapter_NN.txt
    pdfs/cache/{book_slug}/toc.json
    pdfs/cache/{book_slug}/meta.json

Writes:
    pdfs/cache/{book_slug}/chunks/chapter_NN/chunk_NNN.json
    pdfs/cache/{book_slug}/chunks/chapter_NN/manifest.json
"""

import argparse
import json
import os
import re
import sys

# ~500 tokens of previous section appended as sliding-window context
WINDOW_CONTEXT_CHARS = 2000


def load_config():
    path = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "config.json"))
    with open(path) as f:
        return json.load(f)


def estimate_tokens(text):
    return len(text) // 4


def find_boundaries(text, section_titles):
    """
    Return sorted (offset, title) pairs for section boundaries in the chapter text.
    Uses TOC section titles first; falls back to regex heading detection.
    """
    bounds = []
    text_lower = text.lower()

    for title in section_titles:
        norm = re.sub(r"\s+", " ", title.lower().strip())
        idx = text_lower.find(norm)
        if idx == -1:
            # Strip leading number prefix (e.g. "1.2 ") and retry
            stripped = re.sub(r"^\d+[\.\d]*\s+", "", norm)
            if len(stripped) > 5:
                idx = text_lower.find(stripped)
        if idx != -1:
            line_start = text.rfind("\n", 0, idx) + 1
            bounds.append((line_start, title))

    if bounds:
        seen, unique = set(), []
        for offset, title in sorted(bounds):
            if offset not in seen:
                seen.add(offset)
                unique.append((offset, title))
        return unique

    return _regex_boundaries(text)


def _regex_boundaries(text):
    """Fallback: detect headings via common textbook patterns."""
    pattern = re.compile(
        r"^(\d+\.\d+[\.\d]*\s+\S.{2,60}|#{1,3}\s+\S.{2,60})",
        re.MULTILINE,
    )
    bounds = []
    for m in pattern.finditer(text):
        title = re.sub(r"^#+\s+", "", m.group(0).strip())
        bounds.append((m.start(), title))
    return bounds


def _make_single_chunk(text, chapter_title):
    return [
        {
            "chunk_index": 0,
            "total_chunks": 1,
            "strategy": "single",
            "section_title": chapter_title,
            "text": text,
            "estimated_tokens": estimate_tokens(text),
            "window_context": None,
        }
    ]


def _split_into_chunks(text, bounds, chapter_title, sliding_window):
    """Split text at boundary offsets and optionally attach sliding-window context."""
    if not bounds:
        return _make_single_chunk(text, chapter_title)

    # If there is substantial intro text before the first detected heading, prepend it
    if bounds[0][0] > 200:
        bounds = [(0, chapter_title)] + list(bounds)

    bounds_ext = list(bounds) + [(len(text), "_end")]
    chunks = []

    for i in range(len(bounds_ext) - 1):
        start, title = bounds_ext[i]
        end = bounds_ext[i + 1][0]
        section_text = text[start:end].strip()
        if not section_text:
            continue

        window_context = None
        if sliding_window and chunks:
            prev_text = chunks[-1]["text"]
            window_context = prev_text[-WINDOW_CONTEXT_CHARS:].strip()

        chunks.append(
            {
                "chunk_index": len(chunks),
                "total_chunks": 0,  # filled below
                "strategy": "sliding-window" if sliding_window else "split-by-section",
                "section_title": title,
                "text": section_text,
                "estimated_tokens": estimate_tokens(section_text),
                "window_context": window_context,
            }
        )

    if not chunks:
        return _make_single_chunk(text, chapter_title)

    total = len(chunks)
    for i, c in enumerate(chunks):
        c["chunk_index"] = i
        c["total_chunks"] = total
    return chunks


def main():
    p = argparse.ArgumentParser(description="Chunk extracted chapter text for Guru ingestion.")
    p.add_argument("book_slug", help="Book slug (e.g. applied-linear-algebra)")
    p.add_argument("chapter", type=int, help="Chapter number")
    p.add_argument("--force", action="store_true", help="Overwrite existing chunks")
    args = p.parse_args()

    cfg = load_config()
    book_dir = os.path.join(cfg["pdfs_path"], "cache", args.book_slug)

    chapter_file = os.path.join(book_dir, f"chapter_{args.chapter:02d}.txt")
    if not os.path.exists(chapter_file):
        print(f"[chunk] Chapter text not found: {chapter_file}", file=sys.stderr)
        print(f"[chunk] Run: python scripts/extract.py <pdf_filename>", file=sys.stderr)
        sys.exit(1)

    with open(chapter_file, encoding="utf-8") as f:
        text = f.read()

    meta_path = os.path.join(book_dir, "meta.json")
    toc_path = os.path.join(book_dir, "toc.json")
    if not os.path.exists(meta_path):
        print(f"[chunk] meta.json not found: {meta_path}", file=sys.stderr)
        sys.exit(1)

    with open(meta_path) as f:
        meta = json.load(f)

    ch_meta = meta["chapters"].get(str(args.chapter))
    if not ch_meta:
        print(f"[chunk] Chapter {args.chapter} not found in meta.json", file=sys.stderr)
        sys.exit(1)

    chapter_title = ch_meta["title"]
    total_tokens = ch_meta["estimated_tokens"]

    section_titles = []
    if os.path.exists(toc_path):
        with open(toc_path) as f:
            toc = json.load(f)
        for ch in toc.get("chapters", []):
            if ch["number"] == args.chapter:
                section_titles = ch.get("sections", [])
                break

    out_dir = os.path.join(book_dir, "chunks", f"chapter_{args.chapter:02d}")
    manifest_path = os.path.join(out_dir, "manifest.json")

    if os.path.exists(manifest_path) and not args.force:
        with open(manifest_path) as f:
            existing = json.load(f)
        print(f"[chunk] Already chunked ({existing['total_chunks']} chunks). Use --force to redo.")
        print(json.dumps(existing, indent=2))
        return

    os.makedirs(out_dir, exist_ok=True)
    print(f"[chunk] {chapter_title}  (~{total_tokens:,} tokens, {len(section_titles)} sections in TOC)")

    if total_tokens < 15_000:
        strategy = "single"
        print("[chunk] Strategy: single")
        chunks = _make_single_chunk(text, chapter_title)
    else:
        bounds = find_boundaries(text, section_titles) if section_titles else _regex_boundaries(text)
        # Probe without sliding window to detect oversized sections
        probe = _split_into_chunks(text, bounds, chapter_title, sliding_window=False)
        oversized = any(c["estimated_tokens"] > 15_000 for c in probe)
        sliding = oversized or total_tokens > 40_000
        strategy = "sliding-window" if sliding else "split-by-section"
        print(f"[chunk] Strategy: {strategy}")
        chunks = _split_into_chunks(text, bounds, chapter_title, sliding_window=sliding)

    for c in chunks:
        path = os.path.join(out_dir, f"chunk_{c['chunk_index']:03d}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(c, f, indent=2, ensure_ascii=False)

    manifest = {
        "book_slug": args.book_slug,
        "chapter_number": args.chapter,
        "chapter_title": chapter_title,
        "strategy": strategy,
        "total_chunks": len(chunks),
        "chunks": [
            {
                "index": c["chunk_index"],
                "section_title": c["section_title"],
                "estimated_tokens": c["estimated_tokens"],
                "has_window_context": c["window_context"] is not None,
            }
            for c in chunks
        ],
    }
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print()
    print("=== chunk.py summary ===")
    print(f"Chapter:  {chapter_title}")
    print(f"Strategy: {strategy}")
    print(f"Chunks:   {len(chunks)}")
    for c in chunks:
        suffix = "  [+window]" if c["window_context"] else ""
        print(f"  [{c['chunk_index']:03d}] {c['section_title'][:50]:<50}  ~{c['estimated_tokens']:,} tokens{suffix}")
    print(f"Output:   {out_dir}")


if __name__ == "__main__":
    main()
