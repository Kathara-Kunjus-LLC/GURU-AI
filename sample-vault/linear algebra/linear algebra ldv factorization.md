---
title: linear algebra ldv factorization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra lu decomposition]]", "[[linear algebra lower unitriangular matrix]]", "[[linear algebra gauss-jordan elimination]]", "[[linear algebra elementary matrix type 3]]"]
builds-into: []
related: ["[[linear algebra permuted lu decomposition]]", "[[linear algebra nonsingular matrix]]"]
---

# Linear Algebra LDV Factorization

## Plain English
The LDV factorization splits a regular matrix into a lower unitriangular factor, a diagonal factor carrying the pivots, and an upper unitriangular factor.

## Intuition
LU already separates elimination steps from the upper triangular result; LDV goes one step further and peels the pivot scaling out of $U$ into its own diagonal matrix $D$, leaving $V$ with all ones on its diagonal — the cleanest possible form.

## Formal Definition
> **Theorem 1.29:**
> A matrix $A$ is regular if and only if it admits the factorization
> $$A = LDV$$
> where:
> - $L$ is lower unitriangular
> - $D = \text{diag}(d_1, \ldots, d_n)$ with all $d_i \neq 0$ (the pivots)
> - $V$ is upper unitriangular
>
> The factorization is **unique** for regular matrices.

## Worked Example
Starting from $A = \begin{bmatrix} 2 & 4 \\ 1 & 5 \end{bmatrix}$, Gaussian elimination gives:

$$U = \begin{bmatrix} 2 & 4 \\ 0 & 3 \end{bmatrix}, \quad L = \begin{bmatrix} 1 & 0 \\ \frac{1}{2} & 1 \end{bmatrix}$$

Extract diagonal of $U$: $D = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$

Then $V = D^{-1}U = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ (upper unitriangular).

Verify: $LDV = \begin{bmatrix} 1&0\\ \frac{1}{2}&1 \end{bmatrix}\begin{bmatrix} 2&0\\0&3 \end{bmatrix}\begin{bmatrix} 1&2\\0&1 \end{bmatrix} = \begin{bmatrix} 2&4\\1&5 \end{bmatrix} = A$. ✓

## Key Properties
- The $L$ and $V$ factors are uniquely determined for regular matrices (Proposition 1.30).
- $D$ contains exactly the pivot values from Gaussian elimination.
- For symmetric matrices $A = A^T$, LDV forces $V = L^T$, giving $A = LDL^T$ — the symmetric factorization.

## Why It Works
Gaussian elimination produces $LU$; writing $U = DV$ where $D$ holds the diagonal of $U$ and $V = D^{-1}U$ has ones on the diagonal is a purely algebraic decomposition with no new computation. Uniqueness of $LU$ (Proposition 1.30) then forces uniqueness of $LDV$.

## Bridge to Other Domains
> **→ Statistics:** The LDL^T variant of LDV is the core of the Cholesky decomposition for positive definite covariance matrices, enabling $O(n^3/3)$ computation of multivariate normal likelihoods and Kalman filter updates.
> *Why it matters:* The $D$ factor directly gives the conditional variances of each variable, making it interpretable as well as computationally efficient.

## Common Confusions
> ⚠ You might think LDV and LU are different factorizations — but LDV is just LU with $U$ split as $DV$; they encode the same elimination and differ only in how they separate the pivot scaling from the row reduction.

## Guru's Note
LDV is the version of LU that makes the pivot values explicit in their own diagonal matrix — worth knowing because it's the stepping stone to the symmetric LDL^T factorization used everywhere in statistics and optimization.