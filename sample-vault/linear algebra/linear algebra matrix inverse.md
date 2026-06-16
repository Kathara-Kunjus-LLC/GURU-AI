---
title: linear algebra matrix inverse
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra nonsingular matrix]]", "[[linear algebra matrix form of linear system]]", "[[linear algebra elementary matrix]]"]
builds-into: ["[[linear algebra gauss-jordan elimination]]", "[[linear algebra ldv factorization]]", "[[linear algebra matrix inverse product rule]]"]
related: ["[[linear algebra singular matrix]]", "[[linear algebra permutation matrix]]"]
---

# Linear Algebra Matrix Inverse

## Plain English
The inverse of a square matrix is another matrix that, when multiplied with the original on either side, produces the identity matrix.

## Intuition
Think of the inverse like dividing by a number: just as multiplying by $\frac{1}{3}$ undoes multiplying by $3$, multiplying by $A^{-1}$ undoes whatever transformation $A$ performs.

## Formal Definition
> **Definition:**
> Let $A$ be an $n \times n$ matrix. A matrix $X$ is the **inverse** of $A$ if
> $$XA = I = AX$$
> where $I$ is the $n \times n$ identity matrix. The inverse is denoted $A^{-1}$.
>
> Where $I$ is the identity matrix and both a left and right inverse condition must hold.

## Worked Example
For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ with $\det A = ad - bc \neq 0$:

$$A^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$$

For $A = \begin{bmatrix} 3 & 1 \\ 2 & 1 \end{bmatrix}$, $\det A = 3 \cdot 1 - 1 \cdot 2 = 1$, so:

$$A^{-1} = \frac{1}{1}\begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix}$$

Check: $A A^{-1} = \begin{bmatrix} 3(1)+1(-2) & 3(-1)+1(3) \\ 2(1)+1(-2) & 2(-1)+1(3) \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I$. ✓

## Key Properties
- The inverse is **unique** when it exists.
- $(A^{-1})^{-1} = A$.
- A square matrix has an inverse if and only if it is nonsingular.

## Why It Works
For square matrices, solving $AX = I$ (the right inverse equation) is enough — the left inverse condition $XA = I$ follows automatically. This works because every nonsingular matrix factors into elementary matrices, each of which is individually invertible, so their product inherits invertibility.

## Bridge to Other Domains
> **→ Machine Learning:** The matrix inverse appears in the normal equations $(A^T A)^{-1} A^T b$ for ordinary least squares regression, directly giving the optimal weight vector.
> *Why it matters:* Understanding when $A^T A$ is invertible (i.e., when the data matrix has full column rank) tells you exactly when a unique least-squares solution exists.

## Common Confusions
> ⚠ You might think $(A + B)^{-1} = A^{-1} + B^{-1}$ — but this fails even for scalars: $(1 + 1)^{-1} = \frac{1}{2} \neq 1 + 1 = 2$.

## Guru's Note
The inverse is theoretically clean but computationally wasteful — in practice, always use LU decomposition to solve $Ax = b$ rather than forming $A^{-1}$ explicitly.