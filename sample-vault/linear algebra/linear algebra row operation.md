---
title: linear algebra row operation
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra linear system]]"]
builds-into: ["[[linear algebra gaussian elimination]]", "[[linear algebra equivalent system]]", "[[linear algebra lu decomposition]]"]
related: ["[[linear algebra matrix factorization]]"]
---

# Linear Algebra Row Operation

## Plain English
A row operation is an allowed manipulation of a linear system's equations — adding a multiple of one equation to another, swapping two equations, or scaling an equation — that never changes which solutions the system has.

## Intuition
Think of each equation as a rubber band stretched between its solution points: you can twist or combine rubber bands however you like, but the intersection point where all bands meet stays fixed.

## Formal Definition
> **Definition:**
> There are three elementary row operations on a system (or matrix):
> 1. **Replacement:** $R_j \leftarrow R_j + c\, R_i$ (add $c$ times row $i$ to row $j$, $i \neq j$)
> 2. **Interchange:** $R_i \leftrightarrow R_j$ (swap rows $i$ and $j$)
> 3. **Scaling:** $R_i \leftarrow c\, R_i$ (multiply row $i$ by a nonzero scalar $c \neq 0$)
>
> Each operation is invertible and preserves the solution set.

## Worked Example
Applying replacement $R_2 \leftarrow R_2 - 2R_1$ to
$$\begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix}$$
gives
$$\begin{bmatrix} 1 & 2 & 1 \\ 0 & 2 & -1 \\ 1 & 1 & 4 \end{bmatrix}$$
The multiplier used is $\ell_{21} = 2/1 = 2$; the zero in position $(2,1)$ confirms $x$ is eliminated from equation 2.

## Key Properties
- Replacement is the only operation Gaussian Elimination needs; interchange (pivoting) is added for numerical stability.
- Each operation corresponds to left-multiplying by an elementary matrix — the algebraic interpretation behind $LU$ decomposition.
- Scaling is rarely used in elimination; it appears mainly when normalizing rows or in theoretical arguments.

## Why It Works
All three operations are invertible: replacement by $-c$, interchange by itself, scaling by $1/c$. An invertible transformation on the equations cannot change which vectors satisfy all of them simultaneously.

## Bridge to Other Domains
> **→ Numerical Methods:** In floating-point arithmetic, the choice of pivot row (via partial pivoting, selecting the largest available entry) controls how much round-off error accumulates during replacement operations, making the interchange operation essential in practice.
> *Why it matters:* A poor pivot choice can cause multipliers $\ell_{ji}$ to be enormous, amplifying floating-point errors and producing a wildly wrong solution even when the system is well-conditioned.

## Guru's Note
The multiplier $\ell_{ji} = a_{ji}/a_{ii}$ is the one number worth writing down during elimination — it tells you exactly what to subtract and, saved as a column of $L$, is the only extra information you need to reconstruct the full $LU$ factorization.