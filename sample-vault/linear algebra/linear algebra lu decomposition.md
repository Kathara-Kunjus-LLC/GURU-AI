---
title: linear algebra lu decomposition
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra gaussian elimination]]", "[[linear algebra elementary matrix]]", "[[linear algebra triangular form]]", "[[linear algebra regular matrix]]"]
builds-into: ["[[linear algebra matrix inverse]]", "[[linear algebra forward substitution]]"]
related: ["[[linear algebra back substitution]]", "[[linear algebra matrix factorization]]"]
---

# LU Decomposition

## Plain English
LU decomposition factors a square matrix into the product of a lower triangular matrix $L$ and an upper triangular matrix $U$, packaging all the steps of Gaussian elimination into two reusable pieces.

## Intuition
Gaussian elimination tears $A$ apart as it runs; $LU$ decomposition catches those torn pieces and reassembles them — $U$ is the triangular result you reach, and $L$ is the record of how you got there.

## Formal Definition
> **Definition:**
> A matrix $A$ is regular if and only if it can be uniquely factored as:
> $$A = LU$$
> where $L$ is **lower unitriangular** (lower triangular with $1$'s on the diagonal) and $U$ is **upper triangular** with nonzero diagonal entries (the pivots of $A$).
>
> The $(i,j)$ entry of $L$ for $i > j$ is the elimination multiplier $l_{ij} = m_{ij}/m_{jj}$ used to zero out entry $(i,j)$ during elimination.

## Worked Example
For $A = \begin{bmatrix} 2 & 4 & 2 \\ 4 & 10 & 3 \\ 2 & 3 & 7 \end{bmatrix}$, Gaussian elimination produces pivots $2$, $2$, $6$ and multipliers $l_{21}=2$, $l_{31}=1$, $l_{32}=-1$, giving:
$$L = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 1 & -1 & 1 \end{bmatrix}, \qquad U = \begin{bmatrix} 2 & 4 & 2 \\ 0 & 2 & -1 \\ 0 & 0 & 6 \end{bmatrix}$$

## Key Properties
- $A = LU$ exists and is unique if and only if $A$ is regular.
- $L$ stores the multipliers; $U$ stores the pivots on its diagonal.
- Solving $Ax = b$ via $LU$ costs $O(n^3)$ for the factorization and $O(n^2)$ for each subsequent right-hand side.

## Why It Works
Each elementary matrix $E_k$ that performs a row operation satisfies $E_k A_k = A_{k+1}$; the product of their inverses $L = L_1 L_2 \cdots L_k$ is automatically lower unitriangular because the off-diagonal multipliers drop into their natural positions without mixing.

## Bridge to Other Domains
> **→ Numerical Methods:** $LU$ decomposition is the backbone of dense linear system solvers in LAPACK — once the factorization is computed once at $O(n^3)$ cost, each new right-hand side $\mathbf{b}$ is solved in $O(n^2)$ by forward/back substitution, making it dramatically cheaper than re-running full elimination each time.
> *Why it matters:* In finite-element simulations that solve the same stiffness matrix against hundreds of load vectors, this reuse is the difference between hours and seconds.

## Guru's Note
The whole point of $LU$ is to pay the $O(n^3)$ cost exactly once and then solve cheaply for as many right-hand sides as you need — if you only have one right-hand side, just use Gaussian elimination directly.