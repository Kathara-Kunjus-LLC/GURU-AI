"""
extract.py — extract text and structure from a PDF using PyMuPDF.

Usage:
    python scripts/extract.py "filename.pdf"
    python scripts/extract.py "filename.pdf" --chapter 3   # extract one chapter only

Reads pdfs_path from config.json. Outputs to pdfs/cache/{book_slug}/:
    toc.json        — structured table of contents
    chapter_NN.txt  — plain text per chapter
    meta.json       — title, author, token estimates per chapter
"""

import argparse
import collections
import json
import os
import re
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    print("[extract] PyMuPDF not found. Run: pip install pymupdf", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

def load_config():
    config_path = os.path.join(os.path.dirname(__file__), "..", "config.json")
    config_path = os.path.normpath(config_path)
    if not os.path.exists(config_path):
        print(f"[extract] config.json not found at {config_path}", file=sys.stderr)
        sys.exit(1)
    with open(config_path) as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Slug
# ---------------------------------------------------------------------------

def make_slug(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


# ---------------------------------------------------------------------------
# TOC helpers
# ---------------------------------------------------------------------------

def extract_toc(doc):
    """
    Return a list of TOC entries from the PDF metadata.
    Each entry: [level, title, page_number]
    Falls back to an empty list if the PDF has no TOC.
    """
    toc = doc.get_toc(simple=False)
    return toc  # list of [level, title, page, dest_dict]


def build_chapter_list(toc, total_pages):
    """
    From the raw TOC, extract top-level chapters (level == 1).
    Compute page ranges from consecutive chapter start pages.
    Returns a list of dicts: {number, title, sections, start_page, end_page}
    """
    chapters = []
    top_level = [(t[1], t[2]) for t in toc if t[0] == 1]  # (title, page)

    for i, (title, start_page) in enumerate(top_level):
        end_page = top_level[i + 1][1] - 1 if i + 1 < len(top_level) else total_pages

        # Collect section headings (level 2) within this chapter's page range
        sections = [
            t[1] for t in toc
            if t[0] == 2 and start_page <= t[2] <= end_page
        ]

        chapters.append({
            "number": i + 1,
            "title": title.strip(),
            "sections": sections,
            "start_page": start_page,
            "end_page": end_page,
        })

    return chapters


def fallback_chapter_list(total_pages):
    """Used when the PDF has no TOC — treat entire document as one chapter."""
    return [{
        "number": 1,
        "title": "Full Document",
        "sections": [],
        "start_page": 1,
        "end_page": total_pages,
    }]


# ---------------------------------------------------------------------------
# Text extraction
# ---------------------------------------------------------------------------

def extract_chapter_text(doc, start_page, end_page):
    """
    Extract plain text from pages [start_page, end_page] (1-indexed, inclusive).
    Returns (raw_text, cleaned_text, scanned_page_count).

    Cleaning removes content that never yields concept notes but costs tokens on
    every ingest call: repeated running headers/footers, bare page numbers,
    line-wrap hyphenation, and a trailing References/Bibliography block.
    """
    pages = []
    scanned = 0
    for page_num in range(start_page - 1, min(end_page, len(doc))):
        page = doc[page_num]
        text = page.get_text("text")
        if len(text.strip()) < 100:
            scanned += 1
        pages.append(text)

    raw_text = "\n".join(pages)
    repeated = detect_repeated_lines(pages)
    cleaned_text = clean_pages(pages, repeated)
    cleaned_text = strip_trailing_apparatus(cleaned_text)
    return raw_text, cleaned_text, scanned


def detect_repeated_lines(pages, min_fraction=0.4, max_len=80):
    """Find short lines recurring as the first/last non-empty line across many
    pages — i.e. running heads/feet that repeat on nearly every page."""
    counter = collections.Counter()
    counted_pages = 0
    for text in pages:
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if not lines:
            continue
        counted_pages += 1
        # Header/footer candidates: top two and bottom two non-empty lines
        for line in lines[:2] + lines[-2:]:
            if len(line) <= max_len:
                counter[line] += 1
    if counted_pages == 0:
        return set()
    threshold = max(3, int(counted_pages * min_fraction))
    return {line for line, c in counter.items() if c >= threshold}


def clean_pages(pages, repeated):
    """Join pages, dropping repeated headers/footers and bare page numbers,
    then de-hyphenate line-wrapped words and collapse blank runs."""
    kept = []
    for text in pages:
        for line in text.splitlines():
            stripped = line.strip()
            if stripped in repeated:
                continue
            if re.fullmatch(r"\d{1,4}", stripped):  # bare page number
                continue
            kept.append(line)
    text = "\n".join(kept)
    text = re.sub(r"(\w+)-\n(\w+)", r"\1\2", text)   # de-hyphenate wraps
    text = re.sub(r"\n{3,}", "\n\n", text)            # collapse blank runs
    return text.strip()


def strip_trailing_apparatus(text):
    """Cut a trailing References/Bibliography/Works Cited block. Only removes it
    when it sits in the last third of the chapter, to avoid false positives on
    an early mention of the word."""
    pattern = re.compile(r"\n[ \t]*(references|bibliography|works cited)[ \t]*\n",
                         re.IGNORECASE)
    matches = list(pattern.finditer(text))
    if matches:
        last = matches[-1]
        if last.start() > len(text) * 0.66:
            return text[:last.start()].rstrip()
    return text


def estimate_tokens(text):
    return len(text) // 4


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Extract PDF content for Guru ingestion.")
    parser.add_argument("filename", help="PDF filename (looked up in pdfs_path from config.json)")
    parser.add_argument("--chapter", type=int, default=None, help="Extract a single chapter by number")
    args = parser.parse_args()

    config = load_config()
    pdfs_path = config.get("pdfs_path")
    if not pdfs_path:
        print("[extract] config.json is missing 'pdfs_path'", file=sys.stderr)
        sys.exit(1)

    pdf_path = os.path.join(pdfs_path, args.filename)
    if not os.path.exists(pdf_path):
        print(f"[extract] PDF not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    print(f"[extract] Opening: {pdf_path}")
    doc = fitz.open(pdf_path)
    total_pages = len(doc)

    # Metadata
    meta = doc.metadata or {}
    title = meta.get("title") or os.path.splitext(args.filename)[0]
    author = meta.get("author") or "Unknown"

    print(f"[extract] Title:  {title}")
    print(f"[extract] Author: {author}")
    print(f"[extract] Pages:  {total_pages}")

    # TOC
    raw_toc = extract_toc(doc)
    if raw_toc:
        chapters = build_chapter_list(raw_toc, total_pages)
        print(f"[extract] TOC found — {len(chapters)} top-level chapters")
    else:
        chapters = fallback_chapter_list(total_pages)
        print("[extract] No TOC found — treating full document as one chapter")

    # Filter to single chapter if requested
    if args.chapter is not None:
        chapters = [c for c in chapters if c["number"] == args.chapter]
        if not chapters:
            print(f"[extract] Chapter {args.chapter} not found in TOC", file=sys.stderr)
            sys.exit(1)

    # Output directory
    slug = make_slug(title)
    out_dir = os.path.join(pdfs_path, "cache", slug)
    os.makedirs(out_dir, exist_ok=True)
    print(f"[extract] Output: {out_dir}")

    # Extract text per chapter
    total_scanned = 0
    total_raw_tokens = 0
    total_clean_tokens = 0
    chapter_meta = {}

    for ch in chapters:
        n = ch["number"]
        raw_text, text, scanned = extract_chapter_text(doc, ch["start_page"], ch["end_page"])
        total_scanned += scanned

        if scanned > 0:
            page_range = f"pages {ch['start_page']}–{ch['end_page']}"
            print(f"[WARN] Chapter {n} ({page_range}): {scanned} page(s) had fewer than 100 characters — may be scanned/image-only")

        out_path = os.path.join(out_dir, f"chapter_{n:02d}.txt")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)

        raw_tokens = estimate_tokens(raw_text)
        tokens = estimate_tokens(text)
        total_raw_tokens += raw_tokens
        total_clean_tokens += tokens
        saved = raw_tokens - tokens
        pct = (saved / raw_tokens * 100) if raw_tokens else 0
        savings = f"  (−{saved:,} tok, {pct:.0f}% cleaned)" if saved > 0 else ""
        chapter_meta[str(n)] = {
            "title": ch["title"],
            "estimated_tokens": tokens,
            "start_page": ch["start_page"],
            "end_page": ch["end_page"],
        }
        print(f"[extract] Chapter {n:02d}: {ch['title'][:50]:<50}  ~{tokens:,} tokens{savings}")

    doc.close()

    # Write toc.json
    toc_data = {
        "title": title,
        "author": author,
        "chapters": chapters,
    }
    with open(os.path.join(out_dir, "toc.json"), "w", encoding="utf-8") as f:
        json.dump(toc_data, f, indent=2)

    # Write meta.json
    meta_data = {
        "title": title,
        "author": author,
        "total_pages": total_pages,
        "total_chapters": len(chapters),
        "chapters": chapter_meta,
    }
    with open(os.path.join(out_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta_data, f, indent=2)

    # Summary
    print()
    print("=== extract.py summary ===")
    print(f"Book:     {title}")
    print(f"Slug:     {slug}")
    print(f"Chapters: {len(chapters)}")
    print(f"Output:   {out_dir}")
    total_saved = total_raw_tokens - total_clean_tokens
    if total_saved > 0:
        pct = total_saved / total_raw_tokens * 100
        print(f"Cleaned:  −{total_saved:,} tokens ({pct:.0f}%) removed as headers/footers/page numbers/refs")
    if total_scanned > 0:
        print(f"[WARN] {total_scanned} page(s) total appeared scanned/image-only — check extraction quality")
        print("       For scanned PDFs, consider running an OCR step before ingestion.")


if __name__ == "__main__":
    main()
