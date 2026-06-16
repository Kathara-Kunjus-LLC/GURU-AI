---
title: linear algebra elementary matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix multiplication]]", "[[linear algebra identity matrix]]", "[[linear algebra row operation]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra matrix inverse]]"]
related: ["[[linear algebra gaussian elimination]]", "[[linear algebra lu decomposition]]"]
---

# Elementary Matrix

## Plain English
An elementary matrix is the identity matrix with one off-diagonal entry changed; multiplying by it on the left performs the corresponding row operation on any matrix.

## Intuition
Think of an elementary matrix as a pre-programmed instruction card: press it against any matrix $A$ on the left, and the single changed entry fires the corresponding row operation automatically.

## Formal Definition
> **Definition:**
> The **elementary matrix** $E$ corresponding to the row operation "add $c$ times row $j$ to row $i$" (with $i \neq j$) is the $m \times m$ identity matrix $I_m$ with the $(i,j)$ entry replaced by $c$:
> $$E_{kl} = \begin{cases} 1 & k = l \\ c & k = i, \; l = j \\ 0 & \text{otherwise} \end{cases}$$
> Then $EA$ equals $A$ with $c$ times row $j$ added to row $i$.

## Worked Example
The elementary matrix that adds $-2$ times row 1 to row 2 of a $3 \times 3$ matrix is:
$$E_1 = \begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
$$E_1 \begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix} = \begin{bmatrix} 1 & 2 & 1 \\ 0 & 2 & -1 \\ 1 & 1 & 4 \end{bmatrix}$$

## Key Properties
- Every elementary matrix is invertible; its inverse is the elementary matrix for the reverse operation (replace $c$ by $-c$).
- $E_k \cdots E_2 E_1 A = U$ encodes all of Gaussian elimination as a matrix product.
- Elementary matrices are the building blocks of the $L$ factor in $LU$ decomposition.

## Why It Works
Applying a row operation is a linear map on the rows of $A$, and every linear map on vectors is represented by matrix multiplication — the elementary matrix is simply the matrix of that specific one-row-operation map.

## Bridge to Other Domains
> **→ Coding:** Compiler optimizations that reorder or combine array operations mirror the algebraic reordering of elementary matrices — both exploit commutativity (or lack thereof) of sequence-of-operations.
> *Why it matters:* Understanding which row operations commute translates directly to which code reorderings are safe.

## Guru's Note
Notice that the nonzero off-diagonal entry of $E$ sits at position $(i,j)$ — not $(j,i)$ — and it's the *row being modified* (row $i$) that gets the entry, a reversal that trips up almost everyone once.