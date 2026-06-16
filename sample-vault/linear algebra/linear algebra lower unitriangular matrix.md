---
title: linear algebra lower unitriangular matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra identity matrix]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra forward substitution]]", "[[linear algebra elementary matrix]]"]
related: ["[[linear algebra triangular form]]", "[[linear algebra diagonal matrix]]"]
---

# Lower Unitriangular Matrix

## Plain English
A lower unitriangular matrix is a square matrix that has $1$s on the main diagonal, nonzero entries only below the diagonal, and zeros everywhere above.

## Intuition
Picture a staircase descending from top-left to bottom-right: the $1$s mark the steps, the entries below fill the risers freely, and nothing exists above the staircase at all.

## Formal Definition
> **Definition:**
> An $n \times n$ matrix $L$ is **lower unitriangular** if:
> $$l_{ij} = \begin{cases} 1 & i = j \\ 0 & i < j \end{cases}$$
> with $l_{ij}$ free (possibly nonzero) for $i > j$.

## Worked Example
$$L = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 1 & -1 & 1 \end{bmatrix}$$
Diagonal entries: $1, 1, 1$ ✓. All entries above diagonal: $0$ ✓. Entries below diagonal $2, 1, -1$ are free.

## Key Properties
- The product of two lower unitriangular matrices is lower unitriangular.
- Every lower unitriangular matrix is invertible; its inverse is also lower unitriangular.
- The off-diagonal entries of the $L$ factor in $A = LU$ are exactly the Gaussian elimination multipliers $l_{ij}$.

## Why It Works
The $1$s on the diagonal make lower unitriangular matrices automatically invertible without any division — their forward substitution never requires dividing by a diagonal entry because all diagonal entries equal $1$.

## Bridge to Other Domains
> **→ Numerical Methods:** In Cholesky factorization ($A = LL^\top$ for positive definite $A$), the factor $L$ is lower triangular (not necessarily unit) — recognizing the structural similarity to the $LU$ case tells you Cholesky is just $LU$ with the extra constraint $U = L^\top$.
> *Why it matters:* Cholesky is twice as fast as $LU$ for positive definite systems because it exploits this symmetry.

## Guru's Note
The "uni-" prefix is easy to forget — a lower triangular matrix has free diagonal entries, while a lower *uni*triangular one is locked to $1$s, and that difference is exactly what makes the $L$ factor in $LU$ unique.