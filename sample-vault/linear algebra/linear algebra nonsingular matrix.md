---
title: linear algebra nonsingular matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra pivoting]]", "[[linear algebra regular matrix]]", "[[linear algebra pivot]]"]
builds-into: ["[[linear algebra permuted lu decomposition]]", "[[linear algebra matrix inverse]]"]
related: ["[[linear algebra lu decomposition]]", "[[linear algebra augmented matrix]]"]
---

# Linear Algebra Nonsingular Matrix

## Plain English
A square matrix is nonsingular if Gaussian Elimination with row swaps can reduce it to upper triangular form with every diagonal entry nonzero.

## Intuition
Nonsingularity means the matrix encodes a system of equations where no equation is redundant or contradictory — there is exactly one solution no matter what the right-hand side is.

## Formal Definition
> **Definition:**
> A square matrix $A$ is **nonsingular** if it can be reduced to upper triangular form $U$ with all nonzero diagonal entries (pivots) by elementary row operations of types 1 (scaling/addition) and 2 (row interchange). Equivalently, $Ax = b$ has a unique solution for every $b$.

## Worked Example
Consider $A = \begin{bmatrix} 0 & 2 \\ 3 & 1 \end{bmatrix}$. The $(1,1)$ entry is $0$, so swap rows:
$$\begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$$

Pivots are $3$ and $2$, both nonzero, so $A$ is nonsingular. The system $Ax = b$ has a unique solution for any $b \in \mathbb{R}^2$.

Now consider $B = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$. Subtract $2 \times$ row 1 from row 2:
$$\begin{bmatrix} 1 & 2 \\ 0 & 0 \end{bmatrix}$$

The second pivot is $0$ and no row swap fixes it, so $B$ is **singular**.

## Key Properties
- Every regular matrix is nonsingular, but not every nonsingular matrix is regular.
- $A$ is nonsingular if and only if it has exactly $n$ nonzero pivots.
- $A$ is nonsingular if and only if $PA = LU$ for some permutation matrix $P$.

## Why It Works
Nonsingularity guarantees that elimination never gets stuck: whenever the current diagonal is zero, a nonzero entry exists below it to swap in. The resulting upper triangular system then has a unique back-substitution solution because none of the diagonal multipliers $u_{ii}$ are zero.

## Bridge to Other Domains
> **→ Machine Learning:** Nonsingularity of the Gram matrix $X^T X$ is the exact condition that guarantees a unique closed-form solution to the ordinary least-squares normal equations $X^T X \hat{\beta} = X^T y$.
> *Why it matters:* When $X^T X$ is singular (columns of $X$ are linearly dependent), the least-squares problem has infinitely many minimizers and regularization is required.

## Common Confusions
> ⚠ You might think **nonsingular and regular are the same** — but actually **regular matrices require no row swaps**, while nonsingular matrices may need them; regular is the strictly narrower class.

## Guru's Note
Think of nonsingular as "fixable by reordering" — regular means it was already fine, nonsingular means you may need to shuffle rows first.