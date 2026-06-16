---
title: linear algebra matrix inverse inefficiency
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra gaussian elimination operation count]]", "[[linear algebra inverse solution formula]]"]
builds-into: []
related: ["[[linear algebra ldv factorization]]"]
---

# Matrix Inverse Inefficiency

## Plain English
Computing the matrix inverse $A^{-1}$ to solve $Ax = b$ requires roughly three times as many arithmetic operations as simply using Gaussian Elimination with Back Substitution.

## Intuition
Inversion solves $n$ separate linear systems (one for each column of $A^{-1}$), then multiplies — three rounds of $n^2$ work — while direct substitution does the same job in one pass costing only $n^2$.

## Formal Definition
> **Definition:**
> Solving $Ax = b$ via $A^{-1}b$ costs approximately:
> $$\underbrace{\frac{4}{3}n^3}_{\text{compute } A^{-1}} + \underbrace{n^2}_{\text{multiply } A^{-1}b} \approx \frac{4}{3}n^3 \text{ operations}$$
>
> Solving via $LU$ decomposition and substitution costs approximately:
> $$\underbrace{\frac{1}{3}n^3}_{LU} + \underbrace{n^2}_{\text{forward/back sub}} \approx \frac{1}{3}n^3 \text{ operations}$$

## Worked Example
For $n = 100$: inversion costs $\approx \frac{4}{3}(10^6) \approx 1{,}333{,}000$ multiplications. Direct $LU$ + substitution costs $\approx \frac{1}{3}(10^6) + 10^4 \approx 343{,}000$ multiplications — nearly four times fewer.

## Key Properties
- Multiplying $A^{-1}b$ costs the same as Forward + Back Substitution: $\approx n^2$ — so inversion gains nothing at solve time.
- Computing $A^{-1}$ by solving $n$ systems costs $\frac{1}{3}n^3 + n \cdot n^2 = \frac{4}{3}n^3$ total.
- Even the optimized inversion algorithm (exploiting zeros in $e_i$) costs $n^3$ — still three times more than $\frac{1}{3}n^3$.

## Why It Works
Solving $Ax = b$ via substitution reuses the $LU$ factors directly and touches each unknown exactly once in each pass. Inversion forces you to solve $n$ systems to build the full inverse before you can use it — paying the $LU$ setup cost once but the substitution cost $n$ times, which dwarfs what you actually needed.

## Bridge to Other Domains
> **→ Numerical Methods:** Scientific software (LAPACK, SciPy) always exposes a `solve(A, b)` function rather than `inv(A) @ b` for this reason — the cubic cost difference becomes decisive for large PDE systems.
> *Why it matters:* Using `inv` instead of `solve` in production code is a well-known performance anti-pattern that can slow simulations by a factor of three or more.

## Common Confusions
> ⚠ You might think **knowing $A^{-1}$ makes repeated solves faster** — but actually **each solve still costs $n^2$ whether you use $A^{-1}b$ or Forward/Back Substitution**, so the only savings come from not recomputing the $LU$ factorization, which you could store either way.

## Guru's Note
Never invert a matrix to solve a linear system — store the $LU$ factorization instead, and call the substitution routine for each new right-hand side.