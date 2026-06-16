---
title: linear algebra matrix transpose
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]"]
builds-into: ["[[linear algebra symmetric matrix]]", "[[linear algebra ldlt factorization]]"]
related: ["[[linear algebra ldv factorization]]"]
---

# Matrix Transpose

## Plain English
The transpose of a matrix is a new matrix formed by swapping every row with its corresponding column.

## Intuition
Picture the matrix as a grid of numbers reflected across its main diagonal — what was in row 2, column 5 moves to row 5, column 2.

## Formal Definition
> **Definition:**
> If $A$ is an $m \times n$ matrix, its transpose $A^T$ is the $n \times m$ matrix with
> $$(A^T)_{ij} = A_{ji}$$
>
> Where $A_{ji}$ is the entry in row $j$, column $i$ of $A$.

## Worked Example
Let $A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}$.

Then $A^T = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}$.

Row 1 of $A$ became column 1 of $A^T$; row 2 of $A$ became column 2 of $A^T$.

## Key Properties
- $(A^T)^T = A$ — transposing twice recovers the original.
- $(AB)^T = B^T A^T$ — transpose reverses multiplication order.
- If $A$ is nonsingular, $(A^T)^{-1} = (A^{-1})^T$, written $A^{-T}$.

## Why It Works
The order reversal in $(AB)^T = B^T A^T$ is forced by dimension: if $A$ is $m \times n$ and $B$ is $n \times p$, then $A^T$ is $n \times m$ and $B^T$ is $p \times n$, so only $B^T A^T$ has compatible dimensions. The entry-level proof follows directly from the definition of matrix multiplication applied to both sides.

## Bridge to Other Domains
> **→ Machine Learning:** The transpose appears in the normal equations $A^T A x = A^T b$, where $A^T$ acts as a projection operator converting residuals into the column space of $A$.
> *Why it matters:* Every least-squares regression and PCA computation passes through this structure.

## Common Confusions
> ⚠ You might think $(AB)^T = A^T B^T$ — but actually $(AB)^T = B^T A^T$ because transposing is an anti-homomorphism, just like inversion, and order must reverse to keep dimensions consistent.

## Guru's Note
The reversal rule for transposes and inverses both follow the same "socks and shoes" logic — the last thing on is the first thing off.