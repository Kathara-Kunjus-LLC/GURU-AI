---
title: linear algebra permuted lu decomposition
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra lu decomposition]]", "[[linear algebra permutation matrix]]", "[[linear algebra pivoting]]", "[[linear algebra nonsingular matrix]]", "[[linear algebra lower unitriangular matrix]]"]
builds-into: ["[[linear algebra forward substitution]]", "[[linear algebra back substitution]]"]
related: ["[[linear algebra regular matrix]]", "[[linear algebra elementary matrix]]"]
---

# Linear Algebra Permuted LU Decomposition

## Plain English
The permuted LU decomposition rewrites any nonsingular matrix as a permutation of its rows times a lower triangular matrix times an upper triangular matrix, extending LU factorization to matrices that require row swaps during elimination.

## Intuition
Standard LU fails whenever a zero blocks the diagonal during elimination; the fix is to record all the row swaps in a permutation matrix $P$, so the reordered version $PA$ is regular and factors cleanly into $LU$.

## Formal Definition
> **Definition:**
> For any nonsingular $n \times n$ matrix $A$, there exists a permutation matrix $P$, a lower unitriangular matrix $L$, and an upper triangular matrix $U$ with nonzero diagonal (the pivots) such that:
> $$PA = LU$$
>
> To solve $Ax = b$, permute the right-hand side $\tilde{b} = Pb$, then solve:
> $$Lc = \tilde{b} \quad \text{(Forward Substitution)}, \qquad Ux = c \quad \text{(Back Substitution)}$$

## Worked Example
Let $A = \begin{bmatrix} 0 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix}$.

After elimination with one row swap (rows 1 and 2):
$$P = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad L = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ \frac{1}{2} & -1 & 1 \end{bmatrix}, \quad U = \begin{bmatrix} 2 & 6 & 1 \\ 0 & 2 & 1 \\ 0 & 0 & \frac{9}{2} \end{bmatrix}$$

Verify: $PA = \begin{bmatrix} 2 & 6 & 1 \\ 0 & 2 & 1 \\ 1 & 1 & 4 \end{bmatrix}$ and $LU$ matches this product.

To solve $Ax = b$ with $b = \begin{bmatrix} 2 \\ 7 \\ 3 \end{bmatrix}$: form $\tilde{b} = Pb = \begin{bmatrix} 7 \\ 2 \\ 3 \end{bmatrix}$, apply forward then back substitution.

## Key Properties
- $PA = LU$ exists for every nonsingular $A$; this is the most general form of Gaussian Elimination.
- The permutation matrix $P$ is not unique — different row swap orderings yield different valid factorizations.
- When updating $L$ during a row swap, only entries already computed and lying strictly below the diagonal in the swapped rows are interchanged.

## Why It Works
Performing all row swaps in advance produces a regular matrix $PA$, which admits an ordinary LU factorization by Theorem 1.3. Recording each swap in $P$ and each multiplier in $L$ simultaneously is equivalent to applying those operations in the prescribed order — the triangular structure of $L$ is preserved because swaps only affect already-computed sub-diagonal entries.

## Bridge to Other Domains
> **→ Numerical Methods:** The permuted LU factorization with partial pivoting (choosing the largest entry below the diagonal at each step) is the standard algorithm in LAPACK and nearly all numerical linear algebra libraries, because it minimizes element growth and controls floating-point error.
> *Why it matters:* Virtually every scientific computing workflow that solves $Ax = b$ — from finite-element simulations to neural-network training with exact solvers — relies on this factorization under the hood.

## Guru's Note
Once you have $PA = LU$, solving for multiple right-hand sides $b_1, b_2, \ldots$ costs almost nothing extra — just apply forward and back substitution to each permuted $Pb_i$ separately.