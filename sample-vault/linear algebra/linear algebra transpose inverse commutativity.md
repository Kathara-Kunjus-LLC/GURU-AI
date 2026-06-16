---
title: linear algebra transpose inverse commutativity
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix transpose]]", "[[linear algebra matrix inverse]]"]
builds-into: ["[[linear algebra ldlt factorization]]"]
related: ["[[linear algebra matrix inverse product rule]]", "[[linear algebra triangular matrix inverse]]"]
---

# Transpose Inverse Commutativity

## Plain English
For an invertible matrix, the operations of transposing and inverting can be applied in either order and give the same result.

## Intuition
Transposing and inverting are both "structure-reversing" operations — each reverses something (rows/columns vs. the linear map itself) — and they commute because they act on orthogonal aspects of the matrix structure.

## Formal Definition
> **Definition:**
> If $A$ is nonsingular, then $A^T$ is also nonsingular and
> $$A^{-T} \;=\; (A^T)^{-1} \;=\; (A^{-1})^T$$
>
> Where $A^{-T}$ is the standard shorthand for either expression.

## Worked Example
Let $A = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}$.

$A^{-1} = \frac{1}{6}\begin{bmatrix} 3 & -1 \\ 0 & 2 \end{bmatrix}$, so $(A^{-1})^T = \frac{1}{6}\begin{bmatrix} 3 & 0 \\ -1 & 2 \end{bmatrix}$.

$A^T = \begin{bmatrix} 2 & 0 \\ 1 & 3 \end{bmatrix}$, so $(A^T)^{-1} = \frac{1}{6}\begin{bmatrix} 3 & 0 \\ -1 & 2 \end{bmatrix}$.

Both give the same matrix ✓.

## Key Properties
- $A^{-T}$ is well-defined whenever $A$ is nonsingular.
- $(AB)^{-T} = A^{-T} B^{-T}$ — both operations together respect multiplication in the same order (unlike each alone).
- Permutation matrices satisfy $P^{-1} = P^T$, a special case of this identity.

## Why It Works
Let $X = (A^{-1})^T$. Then $X \cdot A^T = (A^{-1})^T A^T = (A A^{-1})^T = I^T = I$, so $X$ is the left inverse of $A^T$. A symmetric argument shows it is also the right inverse, confirming $X = (A^T)^{-1}$.

## Bridge to Other Domains
> **→ Numerical Methods:** The identity $(A^T)^{-1} = (A^{-1})^T$ means solving $A^T x = b$ is equivalent to transposing the already-computed $LU$ factors, avoiding a second full factorization — this is exploited in adjoint-based sensitivity analysis and iterative refinement.
> *Why it matters:* Adjoint solvers in PDE-constrained optimization solve $A^T \lambda = c$ thousands of times; reusing the $LU$ factorization of $A$ cuts the cost to nearly nothing.

## Guru's Note
Whenever you need $(A^T)^{-1}$, compute $A^{-1}$ first and then transpose — never factorize $A^T$ from scratch.