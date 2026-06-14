"""
review.py — deterministic quality lint for staged Guru notes.

Runs the mechanical half of prompts/review.md locally so it never costs Claude
rate-limit budget. Notes that pass every hard check are auto-approved silently;
only notes with a hard failure are flagged for a human (or a Claude pass) to look
at. Soft warnings (e.g. possible plain-text math) are reported but do not flag.

Usage:
    python scripts/review.py            # review every chNN folder in staging
    python scripts/review.py ch03       # review one chapter folder
    python scripts/review.py ch03 --strict   # exit 1 if anything is flagged

Reads staging_path from config.json. Writes .review-log.json into each reviewed
chapter folder.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone

PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))

REQUIRED_SECTIONS = [
    "plain english",
    "intuition",
    "formal definition",
    "worked example",
    "key properties",
    "why it works",
    "bridge to other domains",
    "guru's note",
]
OPTIONAL_SECTIONS = ["common confusions"]


# ---------------------------------------------------------------------------
# Config / IO
# ---------------------------------------------------------------------------

def load_config():
    path = os.path.join(PROJECT_ROOT, "config.json")
    with open(path) as f:
        return json.load(f)


def parse_note(content):
    """Return (frontmatter_text, {section_name_lower: body_text})."""
    fm = ""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    body = content
    if m:
        fm = m.group(1)
        body = content[m.end():]

    sections = {}
    current = None
    buf = []
    for line in body.splitlines():
        h = re.match(r"^##\s+(.*?)\s*$", line)
        if h:
            if current is not None:
                sections[current] = "\n".join(buf).strip()
            current = h.group(1).strip().lower()
            buf = []
        elif current is not None:
            buf.append(line)
    if current is not None:
        sections[current] = "\n".join(buf).strip()
    return fm, sections


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def count_sentences(text):
    """Count sentence terminators, ignoring decimals like 3.14."""
    text = re.sub(r"\d\.\d", "  ", text)        # neutralise decimals
    return len(re.findall(r"[.!?](?:\s|$)", text.strip()))


def strip_math(text):
    """Remove $$...$$ and $...$ spans so we can scan the remaining prose."""
    text = re.sub(r"\$\$.*?\$\$", " ", text, flags=re.DOTALL)
    text = re.sub(r"\$[^$\n]*?\$", " ", text)
    return text


# ---------------------------------------------------------------------------
# Checks — each returns a list of (level, message); level is "fail" or "warn"
# ---------------------------------------------------------------------------

def check_frontmatter(fm):
    issues = []
    for field in ("title", "domain", "parent-domain", "source"):
        if not re.search(rf"^{re.escape(field)}:\s*\S", fm, re.MULTILINE):
            issues.append(("fail", f"frontmatter missing `{field}`"))
    tm = re.search(r"^title:\s*(.+)$", fm, re.MULTILINE)
    if tm and tm.group(1).strip().strip('"') != tm.group(1).strip().strip('"').lower():
        issues.append(("fail", "title is not lowercase"))
    sm = re.search(r"^source:\s*(.+)$", fm, re.MULTILINE)
    if sm and not sm.group(1).strip().startswith('"'):
        issues.append(("warn", "source is not double-quoted"))
    return issues


def check_structure(sections):
    issues = []
    for name in REQUIRED_SECTIONS:
        if name not in sections:
            issues.append(("fail", f"missing required section `## {name.title()}`"))
        elif not sections[name].strip():
            issues.append(("fail", f"empty section `## {name.title()}`"))
    return issues


def check_plain_english(sections):
    text = sections.get("plain english", "")
    if not text:
        return []
    issues = []
    if "$" in text or "\\" in text:
        issues.append(("fail", "Plain English contains math notation ($ or \\)"))
    if count_sentences(text) > 1:
        issues.append(("fail", "Plain English is more than one sentence"))
    return issues


def check_intuition(sections):
    # Length here is a style guideline, not a quality defect — warn, don't flag.
    text = sections.get("intuition", "")
    if text and count_sentences(text) > 2:
        return [("warn", "Intuition exceeds two sentences")]
    return []


def check_worked_example(sections):
    text = sections.get("worked example", "")
    if text and not re.search(r"\d", text):
        return [("fail", "Worked Example has no numbers (abstract / variables only)")]
    return []


def check_bridge(sections):
    text = sections.get("bridge to other domains", "")
    if not text:
        return []
    issues = []
    # Domain may be bracketed (template placeholder) or bare: **→ [Stats]:** or **→ Stats:**
    arrows = re.findall(r"\*\*→\s*\[?([^\]\n:]+?)\]?:", text)
    if not arrows:
        issues.append(("fail", "Bridge has no `**→ [Domain]:**` entries"))
    if len(arrows) > 2:
        issues.append(("warn", f"Bridge has {len(arrows)} entries (max 2)"))
    why = len(re.findall(r"\*why it matters:\*", text, re.IGNORECASE))
    if arrows and why < len(arrows):
        issues.append(("warn", "a Bridge entry is missing its *Why it matters:* line"))
    if re.search(r"\b(is|are)\s+used\s+in\b", text, re.IGNORECASE):
        issues.append(("warn", "Bridge may state 'used in X' without a mechanism"))
    return issues


def check_guru_note(sections):
    text = sections.get("guru's note", "")
    if text and count_sentences(text) > 1:
        return [("fail", "Guru's Note is more than one sentence")]
    return []


def check_latex(sections):
    """Advisory: scan prose (math stripped) for likely un-delimited math."""
    issues = []
    joined = "\n".join(
        v for k, v in sections.items() if k not in ("plain english", "guru's note")
    )
    prose = strip_math(joined)
    if re.search(r"\b[a-zA-Z]_[a-zA-Z0-9]{1,3}\b", prose):
        issues.append(("warn", "possible plain-text subscript (e.g. a_ij) outside $...$"))
    if re.search(r"[a-zA-Z0-9]\^[0-9]", prose):
        issues.append(("warn", "possible plain-text exponent (e.g. x^2) outside $...$"))
    return issues


CHECKS = [
    check_structure,
    check_plain_english,
    check_intuition,
    check_worked_example,
    check_bridge,
    check_guru_note,
    check_latex,
]


def review_note(content):
    fm, sections = parse_note(content)
    issues = check_frontmatter(fm)
    for fn in CHECKS:
        issues.extend(fn(sections))
    fails = [m for lvl, m in issues if lvl == "fail"]
    warns = [m for lvl, m in issues if lvl == "warn"]
    return fails, warns


# ---------------------------------------------------------------------------
# Folder review
# ---------------------------------------------------------------------------

def list_md(folder):
    return sorted(
        os.path.join(folder, f)
        for f in os.listdir(folder)
        if f.endswith(".md")
    )


def review_folder(folder, chapter_label):
    files = list_md(folder)
    if not files:
        print(f"[review] {chapter_label}: no staged notes.")
        return {"flagged": 0, "passed": 0, "total": 0}

    print(f"\n[review] {chapter_label}: {len(files)} note(s)")
    passed = 0
    flagged = []
    decisions = {}

    for path in files:
        with open(path, encoding="utf-8") as f:
            content = f.read()
        fails, warns = review_note(content)
        name = os.path.basename(path)
        if fails:
            flagged.append((name, fails, warns))
            decisions[name] = "flagged"
        else:
            passed += 1
            decisions[name] = "auto-approved"
            if warns:
                decisions[name] = "auto-approved (with warnings)"

    print(f"[review]   auto-approved: {passed}   flagged: {len(flagged)}")
    for name, fails, warns in flagged:
        print(f"\n  ✗ {name}")
        for msg in fails:
            print(f"      FAIL  {msg}")
        for msg in warns:
            print(f"      warn  {msg}")

    log = {
        "chapter": chapter_label,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "total": len(files),
        "auto_approved": passed,
        "flagged": len(flagged),
        "decisions": decisions,
    }
    with open(os.path.join(folder, ".review-log.json"), "w") as f:
        json.dump(log, f, indent=2)

    return {"flagged": len(flagged), "passed": passed, "total": len(files)}


def main():
    p = argparse.ArgumentParser(description="Deterministic quality lint for staged Guru notes.")
    p.add_argument("chapter", nargs="?", default=None, help="Chapter folder (e.g. ch03). Default: all.")
    p.add_argument("--strict", action="store_true", help="Exit 1 if any note is flagged.")
    args = p.parse_args()

    cfg = load_config()
    staging = os.path.join(PROJECT_ROOT, cfg["staging_path"]) if not os.path.isabs(cfg["staging_path"]) else cfg["staging_path"]
    if not os.path.isdir(staging):
        print(f"[review] staging path not found: {staging}", file=sys.stderr)
        sys.exit(1)

    if args.chapter:
        folders = [(os.path.join(staging, args.chapter), args.chapter)]
    else:
        folders = [
            (os.path.join(staging, d), d)
            for d in sorted(os.listdir(staging))
            if os.path.isdir(os.path.join(staging, d)) and not d.startswith(".")
        ]

    total = {"flagged": 0, "passed": 0, "total": 0}
    for folder, label in folders:
        if not os.path.isdir(folder):
            print(f"[review] {label}: folder not found.", file=sys.stderr)
            continue
        r = review_folder(folder, label)
        for k in total:
            total[k] += r[k]

    print("\n=== review.py summary ===")
    print(f"Notes reviewed:  {total['total']}")
    print(f"Auto-approved:   {total['passed']}")
    print(f"Flagged:         {total['flagged']}")
    if total["flagged"]:
        print("Flagged notes need a look before approve — only these cost Claude time.")

    if args.strict and total["flagged"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
