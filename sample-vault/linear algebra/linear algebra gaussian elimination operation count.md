---
title: linear algebra gaussian elimination operation count
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra ldv factorization]]"]
builds-into: ["[[linear algebra matrix inverse inefficiency]]", "[[linear algebra tridiagonal matrix lu factorization]]"]
related: ["[[linear algebra inverse solution formula]]"]
---

# Gaussian Elimination Operation Count

## Plain English
Counting the exact number of multiplications and additions that Gaussian Elimination needs to reduce an $n \times n$ matrix to upper triangular form.

## Intuition
Think of the pivot steps as a shrinking triangle of work: at pivot $j$, you update an $(n-j) \times (n-j)$ block, so the total work is the sum of squares of a decreasing sequence — which accumulates to about $\frac{1}{3}n^3$.

## Formal Definition
> **Definition:**
> To reduce a regular $n \times n$ matrix to upper triangular form requires:
> $$\sum_{j=1}^{n}(n-j)(n-j+1) = \frac{n^3 - n}{3} \approx \frac{1}{3}n^3 \text{ multiplications}$$
> $$\sum_{j=1}^{n}(n-j)^2 = \frac{2n^3 - 3n^2 + n}{6} \approx \frac{1}{3}n^3 \text{ additions}$$
>
> Where each term accounts for the $(n-j)$ row operations and $(n-j+1)$ updates per pivot step $j$.

## Worked Example
For $n = 3$: at pivot $j=1$, we update a $2 \times 2$ block: $(3-1)(3-1+1) = 2 \cdot 3 = 6$ multiplications. At pivot $j=2$, we update a $1 \times 1$ block: $(3-2)(3-2+1) = 1 \cdot 2 = 2$ multiplications. Total: $6 + 2 = 8$ multiplications, versus $\frac{27 - 3}{3} = 8$. ✓

## Key Properties
- Reducing the coefficient matrix costs $\approx \frac{1}{3}n^3$ multiplications and $\approx \frac{1}{3}n^3$ additions — this dominates all other work.
- Forward and Back Substitution together cost only $\approx n^2$ operations — negligible for large $n$.
- Once the $LU$ decomposition is known, solving $Ax = b$ for any new $b$ costs only $\approx n^2$ operations.

## Why It Works
The reduction to upper triangular form requires updating every entry in the remaining submatrix at each pivot step, and the submatrix shrinks by one row and column each time. Summing $(n-j)^2$ over $j$ yields a cubic, because the area of a triangle scales as the square of its side, and we sum $n$ such steps.

## Bridge to Other Domains
> **→ Numerical Methods:** The $\frac{1}{3}n^3$ dominant term is the baseline against which all sparse solvers, iterative methods, and preconditioners are measured — every algorithmic improvement in scientific computing is expressed as a fraction or exponent of this count.
> *Why it matters:* Knowing the exact cubic cost motivates switching to iterative solvers like conjugate gradient for the million-variable systems in PDE discretization.

## Guru's Note
Memorize the $\frac{1}{3}n^3$ figure — every comparison in numerical linear algebra (sparse solvers, Strassen, iterative methods) is measured against it.