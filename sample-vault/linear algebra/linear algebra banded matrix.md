---
title: linear algebra banded matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra tridiagonal matrix]]"]
builds-into: []
related: ["[[linear algebra tridiagonal matrix lu factorization]]", "[[linear algebra gaussian elimination operation count]]"]
---

# Banded Matrix

## Plain English
A square matrix where all nonzero entries are confined to a diagonal strip of fixed width $k$ around the main diagonal, with zeros everywhere outside that band.

## Intuition
Imagine the full $n \times n$ grid of entries, but only the entries within $k$ steps of the diagonal are allowed to be nonzero — like a highway with $k$ lanes on each side of the center line.

## Formal Definition
> **Definition:**
> An $n \times n$ matrix $A$ has **bandwidth $k$** if:
> $$a_{ij} = 0 \quad \text{whenever} \quad |i - j| > k$$
>
> A tridiagonal matrix has bandwidth $k = 1$; a full matrix has bandwidth $k = n - 1$.

## Worked Example
A $4 \times 4$ matrix of bandwidth $k = 2$:
$$A = \begin{bmatrix} a_{11} & a_{12} & a_{13} & 0 \\ a_{21} & a_{22} & a_{23} & a_{24} \\ a_{31} & a_{32} & a_{33} & a_{34} \\ 0 & a_{42} & a_{43} & a_{44} \end{bmatrix}$$
The entries $a_{14} = a_{41} = 0$ since $|1-4| = 3 > 2$.

## Key Properties
- The $L$ and $U$ factors of a regular banded matrix have the same bandwidth $k$ — no fill-in beyond the original band.
- Solving $Ax = b$ for a bandwidth-$k$ matrix costs $O(k^2 n)$ operations instead of $O(n^3)$.
- Tridiagonal ($k=1$) is the most important special case: $O(n)$ solve.

## Why It Works
At each pivot step, the elimination only affects rows and columns within $k$ positions of the pivot — the band structure is not destroyed because entries outside the band are zero and adding a multiple of a row cannot create nonzeros further out than the row's own band.

## Bridge to Other Domains
> **→ Numerical Methods:** PDE discretizations on structured grids (finite differences, FEM on 1D/2D meshes) produce banded systems whose bandwidth grows with the problem dimension — $k = O(1)$ in 1D, $k = O(\sqrt{n})$ in 2D — making banded solvers the backbone of scientific computing.
> *Why it matters:* Recognizing and exploiting band structure can reduce solve time from days to seconds for large-scale simulations.

## Guru's Note
Always ask "what is the bandwidth?" before choosing a solver — it is the single most important structural property of a sparse matrix.