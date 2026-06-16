---
title: linear algebra gauss-jordan elimination
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra elementary matrix]]", "[[linear algebra nonsingular matrix]]", "[[linear algebra pivoting]]"]
builds-into: ["[[linear algebra ldv factorization]]"]
related: ["[[linear algebra lu decomposition]]", "[[linear algebra permuted lu decomposition]]"]
---

# Linear Algebra Gauss-Jordan Elimination

## Plain English
Gauss-Jordan elimination is an algorithm that computes the inverse of a matrix by augmenting it with an identity matrix and row-reducing until the left side becomes the identity, at which point the right side is the inverse.

## Intuition
You start with $[A \mid I]$ and ask: what sequence of operations transforms $A$ into $I$? Whatever you do to the left side, you also do to the right, so the right side accumulates the net effect of all those operations — which is exactly $A^{-1}$.

## Formal Definition
> **Algorithm:**
> Form the $n \times 2n$ augmented matrix $[A \mid I]$. Apply all three types of elementary row operations until the left block is the identity:
> $$[A \mid I] \xrightarrow{\text{row ops}} [I \mid A^{-1}]$$
>
> The three operation types are:
> 1. Add a multiple of one row to another
> 2. Swap two rows
> 3. Multiply a row by a nonzero scalar

## Worked Example
Find $A^{-1}$ for $A = \begin{bmatrix} 1 & 2 \\ 3 & 5 \end{bmatrix}$:

$$\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 3 & 5 & 0 & 1 \end{array}\right]$$

Subtract $3 \times$ row 1 from row 2:

$$\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & -1 & -3 & 1 \end{array}\right]$$

Multiply row 2 by $-1$:

$$\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & 3 & -1 \end{array}\right]$$

Subtract $2 \times$ row 2 from row 1:

$$\left[\begin{array}{cc|cc} 1 & 0 & -5 & 2 \\ 0 & 1 & 3 & -1 \end{array}\right]$$

So $A^{-1} = \begin{bmatrix} -5 & 2 \\ 3 & -1 \end{bmatrix}$.

## Key Properties
- Requires all three types of elementary row operations (Gaussian elimination uses only types 1 and 2).
- For square $A$, solving $AX = I$ automatically gives both left and right inverses.
- More efficient than inverting $n$ systems separately, since identical row operations apply to all columns simultaneously.

## Why It Works
The row operations applied to achieve $[A \mid I] \to [I \mid X]$ correspond to left-multiplying by elementary matrices $E_N \cdots E_1$. Since $E_N \cdots E_1 A = I$, the product $X = E_N \cdots E_1$ satisfies $XA = I$. Because $X$ is itself a product of invertible matrices, $X$ is invertible, and $XA = I$ then forces $AX = I$ as well.

## Bridge to Other Domains
> **→ Numerical Methods:** Gauss-Jordan is the conceptual foundation for iterative matrix inversion algorithms, but its $O(n^3)$ flop count makes it impractical for large systems — motivating sparse solvers and preconditioned iterative methods instead.
> *Why it matters:* Knowing the exact operation count lets you choose between direct and iterative methods for large-scale scientific computing.

## Common Confusions
> ⚠ You might think Gauss-Jordan is the best way to solve $Ax = b$ — but computing $A^{-1}$ and then multiplying $A^{-1}b$ takes three times as many operations as plain Gaussian elimination with back substitution.

## Guru's Note
Gauss-Jordan is the right algorithm for computing $A^{-1}$ explicitly — but for solving a single linear system, always use LU decomposition with back substitution instead.