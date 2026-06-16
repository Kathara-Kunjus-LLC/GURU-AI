---
title: linear algebra back substitution
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra triangular form]]"]
builds-into: ["[[linear algebra lu decomposition]]"]
related: ["[[linear algebra gaussian elimination]]"]
---

# Linear Algebra Back Substitution

## Plain English
The process of solving a triangular system by starting from the last equation (which has one unknown), finding its value, then working upward and substituting known values into each equation above.

## Intuition
It is like filling in a crossword from the bottom row up: the bottom clue has only one letter to find, and each row above has one more letter already known from below.

## Formal Definition
> **Definition:**
> Given an upper-triangular system $U\mathbf{x} = \mathbf{c}$ with nonzero pivots $u_{ii}$, the solution is computed by
> $$x_i = \frac{1}{u_{ii}}\left(c_i - \sum_{j=i+1}^{n} u_{ij}\, x_j\right), \quad i = n, n-1, \ldots, 1$$
>
> Where $x_{i+1}, \ldots, x_n$ are already known from previous (lower) steps.

## Worked Example
For the triangular system after elimination:
$$x + 2y + z = 2, \quad 2y - z = 3, \quad \frac{5}{2}z = \frac{5}{2}$$

Step 1 ($i=3$): $z = \frac{5/2}{5/2} = 1$

Step 2 ($i=2$): $y = \frac{3 + z}{2} = \frac{3 + 1}{2} = 2$

Step 3 ($i=1$): $x = 2 - 2y - z = 2 - 4 - 1 = -3$

## Key Properties
- Requires exactly $O(n^2)$ multiplications and additions for an $n \times n$ system.
- Fails if any pivot $u_{ii} = 0$ — a zero pivot means the system is singular or requires row swaps.
- Forward substitution is the analogous procedure for lower-triangular systems (used in $LU$ decomposition).

## Why It Works
Each step has exactly one unknown because all variables below it were solved in earlier steps and substituted out; dividing by the pivot entry isolates the remaining unknown immediately.

## Guru's Note
Always check for zero pivots before back-substituting — a zero on the diagonal is a signal, not a nuisance, telling you the system may need a row swap or has no unique solution.