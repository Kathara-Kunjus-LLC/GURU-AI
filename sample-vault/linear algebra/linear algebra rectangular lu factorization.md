---
title: linear algebra rectangular lu factorization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra row echelon form]]", "[[linear algebra partial pivoting]]", "[[linear algebra matrix rank]]"]
builds-into: []
related: ["[[linear algebra gaussian elimination operation count]]", "[[linear algebra tridiagonal matrix lu factorization]]"]
---

# Linear Algebra Rectangular LU Factorization

## Plain English
The $PA = LU$ factorization generalizes from square nonsingular matrices to any rectangular matrix, where $U$ is now a row echelon matrix rather than a square upper triangular one.

## Intuition
Gaussian elimination does not care about the shape of the matrix — it just keeps sweeping left to right looking for pivots and zeroing below them; the result is always the same staircase, whether the matrix is tall, wide, or square.

## Formal Definition
> **Proposition 1.39 / Factorization (1.73):**
> For any $m \times n$ matrix $A$ of rank $r$, there exists an $m \times m$ permutation matrix $P$ and an $m \times m$ lower unitriangular matrix $L$ such that
> $$PA = LU$$
> where $U$ is an $m \times n$ **row echelon matrix** with exactly $r$ nonzero pivots.
>
> $P$ and $L$ are square of size $m \times m$; $A$ and $U$ are both $m \times n$.

## Worked Example
Factor $A = \begin{bmatrix} 1 & 3 & 2 & -1 & 0 \\ 2 & 6 & 1 & 4 & 3 \\ -1 & -3 & -3 & 3 & 1 \\ 3 & 9 & 8 & -7 & 2 \end{bmatrix}$ ($4 \times 5$, rank 3).

Pivot column 1: eliminate rows 2,3,4 with multipliers $\ell_{21}=2, \ell_{31}=-1, \ell_{41}=3$.

Column 2 has no pivot candidate (all zero below row 1 in column 2 after elimination); move to column 3: pivot $= -3$ in row 2, multipliers $\ell_{32} = \frac{1}{3}, \ell_{42} = -\frac{2}{3}$.

Column 4 has no pivot; swap rows 3 and 4 (captured in $P$); pivot $= 4$ in column 5.

Result:
$$P \cdot A = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 2 & 1 & 0 & 0 \\ 3 & -\frac{2}{3} & 1 & 0 \\ -1 & \frac{1}{3} & 0 & 1 \end{bmatrix}^{-1} \cdot U, \quad U = \begin{bmatrix} 1 & 3 & 2 & -1 & 0 \\ 0 & 0 & -3 & 6 & 3 \\ 0 & 0 & 0 & 0 & 4 \\ 0 & 0 & 0 & 0 & 0 \end{bmatrix}$$

## Key Properties
1. $P$ and $L$ are always square ($m \times m$); $U$ is rectangular ($m \times n$) — same shape as $A$.
2. The factorization is not unique: different pivot strategies yield different $L$ and $U$ with the same rank $r$.
3. Zero rows at the bottom of $U$ correspond to the $m - r$ compatibility constraints on $b$.

## Why It Works
The same row-replacement and row-swap operations that produce square $LU$ are applied here unchanged; the only difference is that some columns are skipped (no pivot found) rather than being guaranteed a pivot, producing the staircase rather than a strict upper triangle.

## Guru's Note
The rectangular $PA = LU$ is the one factorization to understand deeply — it unifies square nonsingular solves, least-squares overdetermined systems, and underdetermined systems under a single algorithm.