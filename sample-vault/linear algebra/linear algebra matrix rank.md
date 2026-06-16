---
title: linear algebra matrix rank
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra row echelon form]]", "[[linear algebra gaussian elimination operation count]]"]
builds-into: ["[[linear algebra basic and free variables]]", "[[linear algebra homogeneous system]]", "[[linear algebra solution existence and uniqueness theorem]]"]
related: ["[[linear algebra partial pivoting]]", "[[linear algebra ill-conditioned matrix]]"]
---

# Linear Algebra Matrix Rank

## Plain English
The rank of a matrix is the number of pivots that appear when you row-reduce it to echelon form — it counts how many independent constraints the matrix actually enforces.

## Intuition
Rank measures how many dimensions of information the matrix truly carries: a rank-$r$ matrix collapses all input vectors into an output living in at most an $r$-dimensional space, regardless of how large the matrix looks.

## Formal Definition
> **Definition:**
> The **rank** of a matrix $A$, written $\operatorname{rank} A$, is the number of pivot positions $r$ in any row echelon form of $A$.
>
> For an $m \times n$ matrix:
> $$0 \leq r = \operatorname{rank} A \leq \min\{m, n\}$$
>
> A square $n \times n$ matrix is **nonsingular** if and only if $\operatorname{rank} A = n$.

## Worked Example
Find the rank of $A = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 0 & 1 & 1 \end{bmatrix}$.

Row-reduce: $R_2 \leftarrow R_2 - 2R_1$:

$$\begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \\ 0 & 1 & 1 \end{bmatrix}$$

Swap $R_2 \leftrightarrow R_3$:

$$\begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{bmatrix}$$

Two pivots at positions $(1,1)$ and $(2,2)$, so $\operatorname{rank} A = 2$.

## Key Properties
1. Rank is invariant: every row echelon form of $A$ has the same number of pivots, regardless of which row operations were used.
2. A square $n \times n$ matrix is nonsingular $\Leftrightarrow$ $\operatorname{rank} A = n$.
3. An $m \times n$ system $Ax = b$ has $m - r$ compatibility constraints and $n - r$ free variables.

## Why It Works
Elementary row operations are invertible linear transformations, so they do not change which sets of columns are linearly independent; the count of independent columns — the rank — is therefore preserved no matter which path to echelon form is taken. A formal proof uses the fact that column independence is preserved under invertible row operations.

## Bridge to Other Domains
> **→ Machine Learning:** In regression and matrix factorization, rank determines the intrinsic dimensionality of a dataset; a low-rank approximation (SVD truncation) discards the $n - r$ redundant directions to compress models or reduce noise.
> *Why it matters:* Principal component analysis retains exactly the top-$k$ rank-$k$ approximation of the data matrix, so rank bounds the number of meaningful features.

> **→ Statistics:** The rank of a design matrix in linear regression equals the number of estimable parameters; if rank is deficient, some coefficients cannot be identified from the data no matter how many observations are collected.
> *Why it matters:* Rank deficiency is the algebraic signature of multicollinearity, which inflates variance and destabilizes coefficient estimates.

## Guru's Note
Always check rank before trusting a solution — if rank drops below the number of unknowns, you have free variables, and the "solution" you computed is just one of infinitely many.