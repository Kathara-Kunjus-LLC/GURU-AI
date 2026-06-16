---
title: linear algebra pivoting
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra gaussian elimination]]", "[[linear algebra augmented matrix]]", "[[linear algebra pivot]]"]
builds-into: ["[[linear algebra permuted lu decomposition]]", "[[linear algebra nonsingular matrix]]"]
related: ["[[linear algebra regular matrix]]", "[[linear algebra lu decomposition]]"]
---

# Linear Algebra Pivoting

## Plain English
Pivoting is the act of swapping two rows of a matrix during Gaussian Elimination so that a nonzero entry moves into the current diagonal position, allowing elimination to continue.

## Intuition
Think of it as rearranging the order of equations on paper: if the equation you need to use first has a zero where you need a number, just swap it with another equation that has a nonzero entry there.

## Formal Definition
> **Definition:**
> If during column $j$ of Gaussian Elimination the diagonal entry $m_{jj} = 0$ but some $m_{kj} \neq 0$ for $k > j$, then rows $j$ and $k$ are interchanged (pivoted) before continuing elimination.

## Worked Example
System with augmented matrix:
$$\begin{bmatrix} 0 & 2 & 1 & 2 \\ 2 & 6 & 1 & 7 \\ 1 & 1 & 4 & 3 \end{bmatrix}$$

The $(1,1)$ entry is $0$, so swap rows 1 and 2:
$$\begin{bmatrix} 2 & 6 & 1 & 7 \\ 0 & 2 & 1 & 2 \\ 1 & 1 & 4 & 3 \end{bmatrix}$$

Now pivot $= 2$ is nonzero; subtract $\frac{1}{2}$ row 1 from row 3:
$$\begin{bmatrix} 2 & 6 & 1 & 7 \\ 0 & 2 & 1 & 2 \\ 0 & -2 & \frac{7}{2} & -\frac{1}{2} \end{bmatrix}$$

Add row 2 to row 3:
$$\begin{bmatrix} 2 & 6 & 1 & 7 \\ 0 & 2 & 1 & 2 \\ 0 & 0 & \frac{9}{2} & \frac{3}{2} \end{bmatrix}$$

Pivots are $2, 2, \frac{9}{2}$; back substitution gives $x = \frac{5}{6},\; y = \frac{5}{6},\; z = \frac{1}{3}$.

## Key Properties
- Pivoting is required whenever the current diagonal entry is zero but a nonzero entry exists below it.
- Pivoting never changes the solution set — row interchange is an elementary operation.
- A matrix is nonsingular if and only if pivoting always finds a nonzero entry to place on the diagonal.

## Why It Works
The diagonal entry must be nonzero to form the multiplier $\ell_{ij} = m_{ij}/m_{jj}$ used in elimination. Reordering equations is mathematically harmless because a system's solution is independent of the order in which equations are written. Pivoting thus expands Gaussian Elimination from regular matrices to all nonsingular matrices.

## Bridge to Other Domains
> **→ Numerical Methods:** Partial pivoting (always choosing the largest available entry) controls growth in round-off error and is the standard stability technique in floating-point LU factorization.
> *Why it matters:* Without it, small pivots amplify rounding errors exponentially, making computed solutions unreliable even when the matrix is theoretically nonsingular.

## Common Confusions
> ⚠ You might think **pivoting changes the solution** — but actually **the solution is unchanged** because swapping equations is an equivalence operation on the linear system.

## Guru's Note
When a zero appears on the diagonal, don't panic — just look below it for a nonzero entry, swap those rows, and carry on exactly as before.