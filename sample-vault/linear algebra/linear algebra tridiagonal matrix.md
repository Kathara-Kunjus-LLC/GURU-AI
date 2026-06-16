---
title: linear algebra tridiagonal matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: []
builds-into: ["[[linear algebra tridiagonal matrix lu factorization]]", "[[linear algebra banded matrix]]"]
related: ["[[linear algebra ldv factorization]]"]
---

# Tridiagonal Matrix

## Plain English
A square matrix where every entry is zero except possibly those on the main diagonal and the two adjacent diagonals directly above and below it.

## Intuition
Picture a long chain: each node connects only to its immediate left and right neighbors, so the matrix has a narrow "band" of three diagonals running down the center, with empty space everywhere else.

## Formal Definition
> **Definition:**
> An $n \times n$ tridiagonal matrix has the form:
> $$A = \begin{bmatrix} q_1 & r_1 & & \\ p_1 & q_2 & r_2 & \\ & p_2 & q_3 & \ddots \\ & & \ddots & \ddots \end{bmatrix}$$
>
> Where $a_{ii} = q_i$ (main diagonal), $a_{i+1,i} = p_i$ (subdiagonal), $a_{i,i+1} = r_i$ (superdiagonal), and all other $a_{ij} = 0$.

## Worked Example
The $3 \times 3$ tridiagonal matrix with $q_i = 4$, $p_i = r_i = 1$:
$$A = \begin{bmatrix} 4 & 1 & 0 \\ 1 & 4 & 1 \\ 0 & 1 & 4 \end{bmatrix}$$
Only 7 of the 9 entries are potentially nonzero; the two corner entries are zero.

## Key Properties
- An $n \times n$ tridiagonal matrix has at most $3n - 2$ nonzero entries out of $n^2$ total.
- It has bandwidth 1: all entries with $|i - j| > 1$ are zero.
- Its $LU$ factors are bidiagonal (lower and upper, each with only two diagonals), not tridiagonal.

## Why It Works
Neighboring-only coupling in a chain model (springs, finite differences, splines) means each equation involves at most three consecutive unknowns. Writing this as a matrix produces exactly the tridiagonal pattern — the sparsity is a direct image of the physical locality.

## Bridge to Other Domains
> **→ Numerical Methods:** Finite difference discretization of second-order ODEs and 1D PDEs produces tridiagonal systems, so the Thomas algorithm (tridiagonal $LU$) is the standard inner loop in ODE solvers and spline routines.
> *Why it matters:* Solving an $n \times n$ tridiagonal system in $O(n)$ rather than $O(n^3)$ makes fine-grained time-stepping computationally feasible.

> **→ Signal Processing:** The FIR filter design and cubic spline interpolation problems both reduce to tridiagonal systems, connecting the abstract sparsity structure to the practical computation of smooth curves and filter coefficients.
> *Why it matters:* This $O(n)$ solve is what makes real-time spline fitting tractable on embedded hardware.

## Guru's Note
Tridiagonal matrices are the gateway to sparse matrix thinking — once you see that structure implies efficiency, you start looking for it everywhere.