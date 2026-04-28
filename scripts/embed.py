"""
embed.py — manage the embedding index for Guru bridge prediction.

Usage:
    python scripts/embed.py --update "probability bayes theorem"
        Embed one concept's summary and append to the index.

    python scripts/embed.py --rebuild
        Recompute all embeddings from cache/concepts.json from scratch.

    python scripts/embed.py --query "eigenvalue decomposition matrix" --top 15
        Return top-N similar concepts as JSON: [{title, score}]

Reads cache/concepts.json.
Writes cache/embeddings.npy and cache/embedding-index.json.
"""

import argparse
import json
import os
import sys

try:
    import numpy as np
except ImportError:
    print("[embed] numpy not found. Run: pip install numpy", file=sys.stderr)
    sys.exit(1)

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("[embed] sentence-transformers not found. Run: pip install sentence-transformers", file=sys.stderr)
    sys.exit(1)

PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
CACHE_DIR = os.path.join(PROJECT_ROOT, "cache")
CONCEPTS_PATH = os.path.join(CACHE_DIR, "concepts.json")
EMBEDDINGS_PATH = os.path.join(CACHE_DIR, "embeddings.npy")
INDEX_PATH = os.path.join(CACHE_DIR, "embedding-index.json")

MODEL_NAME = "all-MiniLM-L6-v2"

_model = None

def get_model():
    global _model
    if _model is None:
        print(f"[embed] Loading model: {MODEL_NAME}")
        _model = SentenceTransformer(MODEL_NAME)
    return _model


# ---------------------------------------------------------------------------
# Index I/O
# ---------------------------------------------------------------------------

def load_index():
    """Returns (matrix, index_map) where index_map is {row_int: title}."""
    if not os.path.exists(EMBEDDINGS_PATH) or not os.path.exists(INDEX_PATH):
        return np.empty((0, 384), dtype=np.float32), {}
    matrix = np.load(EMBEDDINGS_PATH)
    with open(INDEX_PATH) as f:
        raw = json.load(f)
    index_map = {int(k): v for k, v in raw.items()}
    return matrix, index_map


def save_index(matrix, index_map):
    np.save(EMBEDDINGS_PATH, matrix)
    with open(INDEX_PATH, "w") as f:
        json.dump({str(k): v for k, v in index_map.items()}, f, indent=2)


def load_concepts():
    if not os.path.exists(CONCEPTS_PATH):
        print(f"[embed] cache/concepts.json not found at {CONCEPTS_PATH}", file=sys.stderr)
        sys.exit(1)
    with open(CONCEPTS_PATH) as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Cosine similarity
# ---------------------------------------------------------------------------

def cosine_similarity(query_vec, matrix):
    """Return 1-D array of cosine similarities between query_vec and each row."""
    if matrix.shape[0] == 0:
        return np.array([])
    query_norm = query_vec / (np.linalg.norm(query_vec) + 1e-10)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True) + 1e-10
    normed = matrix / norms
    return normed @ query_norm


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_update(title):
    concepts = load_concepts()
    if title not in concepts:
        print(f"[embed] '{title}' not found in cache/concepts.json", file=sys.stderr)
        sys.exit(1)

    summary = concepts[title].get("summary", "")
    if not summary:
        print(f"[embed] '{title}' has no summary field — skipping", file=sys.stderr)
        sys.exit(1)

    matrix, index_map = load_index()

    # If title already in index, update its row instead of appending
    existing_row = next((k for k, v in index_map.items() if v == title), None)

    model = get_model()
    vec = model.encode([summary], convert_to_numpy=True, normalize_embeddings=False)[0].astype(np.float32)

    if existing_row is not None:
        matrix[existing_row] = vec
        print(f"[embed] Updated row {existing_row}: {title}")
    else:
        new_row = matrix.shape[0]
        matrix = np.vstack([matrix, vec[np.newaxis, :]]) if matrix.shape[0] > 0 else vec[np.newaxis, :]
        index_map[new_row] = title
        print(f"[embed] Added row {new_row}: {title}")

    save_index(matrix, index_map)
    print(f"[embed] Index now has {matrix.shape[0]} entries")


def cmd_rebuild():
    concepts = load_concepts()
    if not concepts:
        print("[embed] cache/concepts.json is empty — nothing to embed")
        return

    titles = list(concepts.keys())
    summaries = [concepts[t].get("summary", "") for t in titles]

    missing = [t for t, s in zip(titles, summaries) if not s]
    if missing:
        print(f"[embed] [WARN] {len(missing)} concept(s) have no summary field and will be skipped:")
        for t in missing:
            print(f"         - {t}")

    valid_pairs = [(t, s) for t, s in zip(titles, summaries) if s]
    if not valid_pairs:
        print("[embed] No concepts with summaries found — index not written")
        return

    valid_titles, valid_summaries = zip(*valid_pairs)

    print(f"[embed] Embedding {len(valid_titles)} concepts with model: {MODEL_NAME}")
    model = get_model()
    matrix = model.encode(list(valid_summaries), convert_to_numpy=True, normalize_embeddings=False).astype(np.float32)
    index_map = {i: t for i, t in enumerate(valid_titles)}

    save_index(matrix, index_map)
    print(f"[embed] Rebuild complete — {matrix.shape[0]} entries written to cache/")


def cmd_query(text, top_n):
    matrix, index_map = load_index()
    if matrix.shape[0] == 0:
        print("[]")
        return

    model = get_model()
    query_vec = model.encode([text], convert_to_numpy=True, normalize_embeddings=False)[0].astype(np.float32)

    scores = cosine_similarity(query_vec, matrix)
    top_indices = np.argsort(scores)[::-1][:top_n]

    results = [
        {"title": index_map[int(i)], "score": round(float(scores[i]), 4)}
        for i in top_indices
        if int(i) in index_map
    ]
    print(json.dumps(results, indent=2))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Manage Guru embedding index.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--update", metavar="TITLE", help="Embed one concept by title and update the index")
    group.add_argument("--rebuild", action="store_true", help="Rebuild entire index from cache/concepts.json")
    group.add_argument("--query", metavar="TEXT", help="Find top-N similar concepts for a query string")
    parser.add_argument("--top", type=int, default=15, help="Number of results to return for --query (default: 15)")
    args = parser.parse_args()

    os.makedirs(CACHE_DIR, exist_ok=True)

    if args.update:
        cmd_update(args.update)
    elif args.rebuild:
        cmd_rebuild()
    elif args.query:
        cmd_query(args.query, args.top)


if __name__ == "__main__":
    main()
