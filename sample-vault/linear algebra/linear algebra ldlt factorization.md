---
title: linear algebra ldlt factorization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra ldv factorization]]", "[[linear algebra symmetric matrix]]", "[[linear algebra matrix transpose]]"]
builds-into: ["[[linear algebra gram matrix positive definiteness]]"]
related: ["[[linear algebra triangular matrix inverse]]", "[[linear algebra stiffness matrix]]"]
---

# LDLT Factorization

## Plain English
When a matrix is symmetric and regular, its $LDV$ factorization automatically satisfies $V = L^T$, so you only need to store $L$ and $D$ — the matrix factors into $L D L^T$.

## Intuition
Symmetry forces the upper factor to be the mirror image of the lower factor; Gaussian elimination on a symmetric matrix is self-referential — the row operations on the right half are determined by the row operations on the left half.

## Formal Definition
> **Definition:**
> A symmetric matrix $A$ is regular if and only if it has a unique factorization
> $$A = L D L^T$$
>
> Where $L$ is lower unitriangular (ones on the diagonal), $D$ is diagonal with nonzero entries, and $L^T$ is the upper unitriangular transpose of $L$.

## Worked Example
Let $A = \begin{bmatrix} 2 & 4 \\ 4 & 10 \end{bmatrix}$.

Row-reduce: subtract $2 \times$ row 1 from row 2 to get $U = \begin{bmatrix} 2 & 4 \\ 0 & 2 \end{bmatrix}$.

Factor out pivots: $D = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$, $L^T = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$.

The multiplier was $4/2 = 2$, so $L = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$.

Check: $L D L^T = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 4 \\ 4 & 10 \end{bmatrix}$ ✓

## Key Properties
- Requires $A$ to be both symmetric and regular (all leading principal minors nonzero).
- Stores roughly half the data of $LDV$: only $L$ and $D$ needed, since $V = L^T$.
- $A = LDL^T$ implies $A$ is symmetric; the converse requires regularity.

## Why It Works
Starting from $A = LDV$, taking the transpose of both sides gives $A^T = V^T D L^T$. If $A = A^T$, then $LDV = V^T D L^T$. The uniqueness of the $LDV$ factorization then forces $L = V^T$, i.e., $V = L^T$ — symmetry of $A$ propagates into a symmetry between the two triangular factors.

## Bridge to Other Domains
> **→ Numerical Methods:** The $LDL^T$ factorization is the foundation of the Cholesky decomposition ($A = LL^T$ when $D$ has all positive entries), which is the standard algorithm for solving symmetric positive definite systems in scientific computing — twice as fast as general $LU$.
> *Why it matters:* Finite element stiffness matrices and covariance matrices are always symmetric positive definite, so Cholesky is the default solver for most engineering and statistics software.

## Common Confusions
> ⚠ You might think every symmetric matrix has an $LDL^T$ factorization — but actually regularity is also required; the matrix $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ is symmetric and nonsingular but has no $LDL^T$ factorization because its first pivot is zero.

## Guru's Note
When you see a symmetric matrix, immediately check if it's regular — if yes, you get $LDL^T$ for free from Gaussian elimination, cutting both storage and solve time nearly in half.