---
title: linear algebra pivot
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra gaussian elimination]]", "[[linear algebra augmented matrix]]", "[[linear algebra row operation]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra triangular form]]"]
related: ["[[linear algebra regular matrix]]"]
---

# Pivot

## Plain English
A pivot is the leading nonzero entry in the current working row during Gaussian elimination — it is the number you divide by to zero out all entries below it in the same column.

## Intuition
Think of a pivot as the fulcrum of a lever: every other entry in its column gets zeroed out by using the pivot row as the tool, and the pivot itself must be nonzero or the lever has no purchase.

## Formal Definition
> **Definition:**
> At step $j$ of Gaussian elimination on an $n \times n$ matrix, the **pivot** is the diagonal entry $u_{jj}$ of the partially reduced matrix. The elimination multipliers are:
> $$l_{ij} = \frac{m_{ij}}{m_{jj}}, \quad i = j+1, \ldots, n$$
> and the row operation applied is: row $i$ $\leftarrow$ row $i$ $- l_{ij} \cdot$ row $j$.

## Worked Example
Starting from:
$$\begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix}$$
The first pivot is $m_{11} = 1$. Multiplier for row 2: $l_{21} = 2/1 = 2$. Subtract $2 \times$ row 1 from row 2 to zero out $m_{21}$.
Second pivot is $m_{22} = 2$ after the first step. Third pivot is $m_{33} = 5/2$ after the second step.

## Key Properties
- A pivot must be **nonzero**; a zero pivot stops the regular elimination algorithm.
- The pivots become the diagonal entries of $U$ in the $LU$ factorization.
- For a regular $n \times n$ matrix, there are exactly $n$ pivots, one per column.

## Why It Works
Dividing by the pivot converts the current row into a tool that can subtract any multiple of itself — the chosen multiple zeroes out exactly the entry below the pivot, one at a time down the column.

## Common Confusions
> ⚠ You might think a zero on the diagonal means the system has no solution — but actually a zero pivot only means the matrix is **not regular** in the current ordering; row swapping (partial pivoting) may rescue it.

## Guru's Note
The pivot is both the bottleneck and the engine of Gaussian elimination — keep it nonzero and everything else follows mechanically.