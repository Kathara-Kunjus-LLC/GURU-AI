---
title: linear algebra regular matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra gaussian elimination]]", "[[linear algebra pivot]]", "[[linear algebra triangular form]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra matrix inverse]]"]
related: ["[[linear algebra lu decomposition]]"]
---

# Regular Matrix

## Plain English
A square matrix is regular if Gaussian elimination can reduce it to upper triangular form without ever encountering a zero on the diagonal.

## Intuition
Regularity is the "no obstacles" certificate for Gaussian elimination — every step has a nonzero pivot to work with, so the algorithm runs to completion without needing any special workaround.

## Formal Definition
> **Definition:**
> An $n \times n$ matrix $A$ is **regular** if the Gaussian elimination algorithm produces an upper triangular matrix $U$ with all nonzero diagonal entries (pivots):
> $$u_{11} \neq 0, \quad u_{22} \neq 0, \quad \ldots, \quad u_{nn} \neq 0$$
> Equivalently, $A$ is regular if and only if it admits the $LU$ factorization $A = LU$ with $U$ having nonzero diagonal entries.

## Worked Example
The matrix $A = \begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix}$ is regular: its three pivots are $1$, $2$, and $\frac{5}{2}$, all nonzero. The matrix $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ is **not** regular because the first pivot is $0$.

## Key Properties
- $A$ is regular $\iff$ $A = LU$ with $L$ lower unitriangular and $U$ upper triangular with nonzero diagonal.
- A regular matrix has a unique $LU$ factorization.
- Regular matrices have unique solutions to $Ax = b$ for every right-hand side $\mathbf{b}$.

## Why It Works
Having a nonzero pivot at every step guarantees that the elimination multipliers $l_{ij} = m_{ij}/m_{jj}$ are well-defined, so the algorithm never stalls — the triangularization is always completable.

## Bridge to Other Domains
> **→ Numerical Methods:** In practice, regularity is enforced by **partial pivoting** — reordering rows so the largest available entry is always the current pivot — turning nearly all real-world matrices into numerically regular ones.
> *Why it matters:* Without pivoting, floating-point errors explode when pivots are very small, even if the matrix is theoretically regular.

## Guru's Note
"Regular" is not standard terminology across textbooks — in other courses this property is more often called "having an LU factorization" or just "being non-singular."