---
title: linear algebra triangular matrix inverse
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra lower unitriangular matrix]]", "[[linear algebra elementary matrix]]"]
builds-into: ["[[linear algebra ldv factorization]]"]
related: ["[[linear algebra lu decomposition]]", "[[linear algebra nonsingular matrix]]"]
---

# Linear Algebra Triangular Matrix Inverse

## Plain English
The inverse of a triangular matrix with nonzero diagonal entries is itself triangular of the same type, and the inverse of a unitriangular matrix is again unitriangular.

## Intuition
Row-reducing a lower triangular matrix uses only type-1 operations (add a multiple of one row to a lower row) and type-3 operations (scale rows) — both of which preserve the triangular structure, so the inverse inherits it.

## Formal Definition
> **Proposition 1.27:**
> If $L$ is lower triangular with all nonzero diagonal entries, then $L$ is nonsingular and $L^{-1}$ is also lower triangular.
>
> If $L$ is lower **unitriangular** (diagonal entries all equal to $1$), then $L^{-1}$ is also lower unitriangular.
>
> The analogous statements hold for upper triangular matrices.

## Worked Example
For $L = \begin{bmatrix} 2 & 0 \\ 3 & 4 \end{bmatrix}$ (lower triangular, nonzero diagonal):

$$\det L = 8 \neq 0, \quad L^{-1} = \frac{1}{8}\begin{bmatrix} 4 & 0 \\ -3 & 2 \end{bmatrix} = \begin{bmatrix} \frac{1}{2} & 0 \\ -\frac{3}{8} & \frac{1}{4} \end{bmatrix}$$

$L^{-1}$ is lower triangular. ✓

For unitriangular $L = \begin{bmatrix} 1 & 0 \\ 3 & 1 \end{bmatrix}$:

$$L^{-1} = \begin{bmatrix} 1 & 0 \\ -3 & 1 \end{bmatrix}$$

$L^{-1}$ is unitriangular. ✓

## Key Properties
- Lower (upper) triangular matrices with nonzero diagonals are always nonsingular.
- The inverse of a unitriangular matrix has the same off-diagonal signs flipped for $2 \times 2$; in general, entries change but structure is preserved.
- This fact is essential for why LU factors are stable and reusable.

## Why It Works
Reducing $L$ to $I$ requires only type-1 elementary row operations (to clear the off-diagonal) and type-3 (to normalize the diagonal). Lemma 1.2 implies the product of lower triangular elementary matrices is itself lower triangular, so $L^{-1}$ is lower triangular.

## Bridge to Other Domains
> **→ Numerical Methods:** Back-substitution for triangular systems costs $O(n^2)$ operations, and the fact that triangular inverses are triangular guarantees that LU-based solvers never produce a denser intermediate result than necessary.
> *Why it matters:* Sparsity of the inverse is directly tied to computational cost in large-scale linear system solvers.

## Guru's Note
Unitriangular matrices are especially nice because their inverses are also unitriangular — no scaling needed, just sign flips on the off-diagonal entries.