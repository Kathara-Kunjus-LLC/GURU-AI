---
title: linear algebra inverse solution formula
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra nonsingular matrix]]", "[[linear algebra matrix form of linear system]]"]
builds-into: []
related: ["[[linear algebra lu decomposition]]", "[[linear algebra gauss-jordan elimination]]"]
---

# Linear Algebra Inverse Solution Formula

## Plain English
When the coefficient matrix of a linear system is invertible, the unique solution can be written as the inverse matrix times the right-hand side vector.

## Intuition
Think of $Ax = b$ like $3x = 6$: you solve it by multiplying both sides by $3^{-1}$, getting $x = 2$. The matrix version does exactly the same thing, just with matrix multiplication replacing scalar multiplication.

## Formal Definition
> **Theorem 1.28:**
> If $A$ is nonsingular, then $Ax = b$ has the unique solution
> $$x = A^{-1} b$$
>
> **Proof:** Multiply both sides of $Ax = b$ on the left by $A^{-1}$:
> $$A^{-1}(Ax) = A^{-1}b \implies x = A^{-1}b$$

## Worked Example
Solve $\begin{bmatrix} 3 & 1 \\ 2 & 1 \end{bmatrix} x = \begin{bmatrix} 5 \\ 4 \end{bmatrix}$.

We have $A^{-1} = \begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix}$ (computed earlier).

$$x = A^{-1}b = \begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix}\begin{bmatrix} 5 \\ 4 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$$

Check: $3(1) + 1(2) = 5$ ✓, $2(1) + 1(2) = 4$ ✓.

## Key Properties
- The formula gives a unique solution whenever $A$ is nonsingular.
- Computing $A^{-1}$ once and then multiplying by different $b$ vectors is only efficient when solving many systems with the same $A$.
- For a single right-hand side, Gaussian elimination is roughly 3× more efficient than forming $A^{-1}$.

## Why It Works
Left-multiplying $Ax = b$ by $A^{-1}$ is valid because $A^{-1}$ exists and matrix multiplication is associative: $A^{-1}(Ax) = (A^{-1}A)x = Ix = x$.

## Bridge to Other Domains
> **→ Machine Learning:** Ordinary least squares regression has the closed-form solution $\hat{\beta} = (X^T X)^{-1} X^T y$, a direct application of this formula to the normal equations — the matrix inverse here is the key that converts the minimization problem into an explicit formula.
> *Why it matters:* The formula reveals when a unique regression solution exists (when $X^T X$ is invertible, i.e., the features are linearly independent), and when regularization is needed to restore invertibility.

## Common Confusions
> ⚠ You might think computing $A^{-1}$ and then forming $A^{-1}b$ is the standard way to solve $Ax = b$ — but this takes about three times as many arithmetic operations as LU decomposition with back substitution.

## Guru's Note
Use this formula to understand why solutions exist and are unique; use LU decomposition when you actually need to compute them.