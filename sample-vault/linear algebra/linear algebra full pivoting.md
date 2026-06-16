---
title: linear algebra full pivoting
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra partial pivoting]]"]
builds-into: ["[[linear algebra ill-conditioned matrix]]"]
related: []
---

# Full Pivoting

## Plain English
At each step of Gaussian Elimination, swap both rows and columns to move the absolutely largest entry in the remaining submatrix into the pivot position.

## Intuition
Partial pivoting only looks down the current column; full pivoting surveys the entire remaining submatrix — it is the most aggressive search for a numerically safe pivot, at the cost of also reordering the variables.

## Formal Definition
> **Definition:**
> At step $j$, find indices $(i^*, k^*)$ with $i^*, k^* \geq j$ that maximize:
> $$|m_{i^*,k^*}| = \max_{i \geq j,\, k \geq j} |m_{ik}|$$
>
> Interchange row pointers $r(i^*) \leftrightarrow r(j)$ and column pointers $c(k^*) \leftrightarrow c(j)$; proceed with pivot $m_{r(j),c(j)}$. The column reordering corresponds to reordering the unknowns $x_{c(1)}, \ldots, x_{c(n)}$.

## Worked Example
System $10x + 1600y = 32100$ and $x + 0.6y = 22$. Partial pivoting picks the large pivot $10$, but the row entry $1600$ is far larger. Full pivoting swaps columns so $y$ is solved first (column 2 moves to position 1), giving pivot $1600$ with multiplier $10/1600 = 0.00625 \ll 1$, and a numerically clean elimination.

## Key Properties
- Guarantees all multipliers $|l_{ij}| \leq 1$ in both row and column directions.
- Requires $O(n^2)$ comparisons per step ($O(n^3)$ total) versus $O(n)$ for partial pivoting — more expensive to search.
- Produces a factorization $PAQ = LU$ where both $P$ (row permutation) and $Q$ (column permutation) must be tracked.

## Why It Works
Scaling a row by a large constant (e.g., multiplying an equation by 1000) makes partial pivoting choose a misleadingly large pivot; full pivoting normalizes across both rows and columns, so the pivot reflects the true magnitude of the submatrix rather than an artifact of scaling.

## Bridge to Other Domains
> **→ Numerical Methods:** Full pivoting is used in rank-revealing $LU$ factorizations, where the order in which pivots drop to near-zero reveals the numerical rank of a matrix — a key subroutine in compressed sensing and low-rank approximation algorithms.
> *Why it matters:* Identifying the numerical rank of a large matrix is the first step in building efficient reduced-order models in structural mechanics and fluid simulation.

## Guru's Note
Full pivoting is overkill for most well-scaled systems — reserve it for rank detection or the rare case where partial pivoting visibly fails.