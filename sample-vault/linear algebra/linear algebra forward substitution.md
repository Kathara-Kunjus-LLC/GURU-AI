---
title: linear algebra forward substitution
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra lu decomposition]]", "[[linear algebra triangular form]]"]
builds-into: ["[[linear algebra back substitution]]"]
related: ["[[linear algebra back substitution]]", "[[linear algebra gaussian elimination]]"]
---

# Forward Substitution

## Plain English
Forward substitution solves a lower triangular system by computing unknowns in order from the first to the last, substituting each found value into subsequent equations.

## Intuition
Forward substitution is the mirror image of back substitution: instead of peeling an onion from the outside in (last equation first), you peel it from the inside out — the first equation gives you one variable, and each subsequent equation adds one more.

## Formal Definition
> **Definition:**
> Given the lower unitriangular system $L\mathbf{c} = \mathbf{b}$ with $l_{ii} = 1$ and $l_{ij} = 0$ for $j > i$, the solution is computed as:
> $$c_1 = b_1, \qquad c_i = b_i - \sum_{j=1}^{i-1} l_{ij} c_j \quad \text{for } i = 2, 3, \ldots, n$$

## Worked Example
Solve $L\mathbf{c} = \mathbf{b}$ where $L = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 1 & -1 & 1 \end{bmatrix}$, $\mathbf{b} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$:

$$c_1 = 1$$
$$c_2 = 2 - 2(1) = 0$$
$$c_3 = 2 - 1(1) - (-1)(0) = 1$$

So $\mathbf{c} = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}$.

## Key Properties
- Requires $O(n^2)$ operations — one subtraction and one previously computed value per entry.
- Since $l_{ii} = 1$ for a lower unitriangular $L$, no division is needed — the formula is purely subtractive.
- Forward substitution precedes back substitution in the two-phase $LU$ solve.

## Why It Works
Lower triangularity guarantees that when computing $c_i$, all of $c_1, \ldots, c_{i-1}$ are already known — the sparsity pattern enforces a natural left-to-right dependency chain.

## Bridge to Other Domains
> **→ Numerical Methods:** Forward substitution is the first of two $O(n^2)$ passes in $LU$-based solvers; caching the $LU$ factorization and running forward/back substitution for each new $\mathbf{b}$ is the standard approach for solving systems with the same coefficient matrix repeatedly.
> *Why it matters:* In real-time control systems that re-solve a linearized model at every time step, these $O(n^2)$ passes (after the one-time $O(n^3)$ factorization) are what make the solve fast enough to run in the control loop.

## Guru's Note
Forward substitution is trivially derived by reading the lower triangular system top to bottom — the only mistake to avoid is forgetting to subtract all previously computed $c_j$, not just the immediately prior one.