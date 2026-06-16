---
title: linear algebra determinant via gaussian elimination
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant]]", "[[linear algebra partial pivoting]]", "[[linear algebra row echelon form]]"]
builds-into: ["[[linear algebra permutation expansion determinant]]"]
related: ["[[linear algebra tridiagonal matrix lu factorization]]", "[[linear algebra rectangular lu factorization]]"]
---

# Linear Algebra Determinant via Gaussian Elimination

## Plain English
You compute a matrix's determinant by running Gaussian Elimination and multiplying the pivots together, adjusting the sign for any row swaps made along the way.

## Intuition
Each row swap flips the orientation of the parallelepiped whose volume the determinant measures, so each swap contributes a factor of $-1$; the pivots themselves are the stretch factors along each independent direction.

## Formal Definition
> **Definition:**
> If $A$ is nonsingular and $k$ row interchanges are needed to reach $PA = LU$, then:
> $$\det A = (-1)^k \, u_{11} u_{22} \cdots u_{nn}$$
>
> Where $u_{ii}$ are the pivots of $U$ and $k$ is the number of row swaps performed.
> If $A$ is singular, $\det A = 0$.

## Worked Example
Let $A = \begin{bmatrix} 0 & 2 \\ 3 & 1 \end{bmatrix}$.

Swap rows 1 and 2 ($k = 1$):

$$\begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$$

Pivots are $3$ and $2$, with one swap:

$$\det A = (-1)^1 \cdot (3)(2) = -6$$

Verify: $ad - bc = (0)(1) - (2)(3) = -6 \checkmark$

## Key Properties
- $\det A = \det U$ when $A$ is regular (no swaps needed), since type-1 row ops leave $\det$ unchanged.
- Each row interchange multiplies $\det$ by $-1$, matching $\det P = (-1)^k$.
- Singular matrices reduce to a form with a zero row, forcing $\det A = 0$.

## Why It Works
Type-1 row operations (add a multiple of one row to another) are the workhorse of elimination and axiom (i) says they leave the determinant unchanged. The only determinant-altering events are row swaps (axiom ii) and the final diagonal product read-off (axiom iv). Tracking these two effects completely accounts for the determinant.

## Bridge to Other Domains
> **→ Numerical Methods:** The same LU factorization used to solve $Ax = b$ simultaneously yields $\det A$ at no extra cost, making determinant computation an $O(n^3)$ byproduct of the solver.
> *Why it matters:* This is why dedicated determinant routines are never needed in practice — any production linear solver already computes the determinant implicitly.

## Guru's Note
Never expand by cofactors for matrices larger than $3 \times 3$ — one pass of elimination gives you the answer in $O(n^3)$ versus the $O(n!)$ catastrophe of the permutation formula.