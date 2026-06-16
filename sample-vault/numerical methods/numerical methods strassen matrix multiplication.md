---
title: numerical methods strassen matrix multiplication
domain: numerical methods
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: []
builds-into: []
related: ["[[linear algebra gaussian elimination operation count]]", "[[linear algebra matrix inverse inefficiency]]"]
---

# Strassen Matrix Multiplication

## Plain English
An algorithm that multiplies two $n \times n$ matrices using $n^{\log_2 7} \approx n^{2.807}$ multiplications instead of the naive $n^3$, by recursively splitting matrices into four blocks and replacing 8 block-multiplications with 7 cleverly chosen ones.

## Intuition
Normally multiplying $2 \times 2$ blocks needs 8 products; Strassen finds 7 carefully constructed linear combinations whose results can be recombined to give all four output blocks — trading one multiplication for several additions, which is a bargain when $n$ is large.

## Formal Definition
> **Definition:**
> For block matrices $A = \begin{bmatrix} A_1 & A_2 \\ A_3 & A_4 \end{bmatrix}$, $B = \begin{bmatrix} B_1 & B_2 \\ B_3 & B_4 \end{bmatrix}$, define 7 products:
> $$D_1 = (A_1+A_4)(B_1+B_4), \quad D_2 = (A_1-A_3)(B_1+B_2), \quad \ldots$$
>
> Then $C = AB$ is recovered as $C_1 = D_1 + D_3 - D_4 - D_6$, etc. Applied recursively to $n = 2^r$ matrices, the total cost is $7^r = n^{\log_2 7}$ multiplications.

## Worked Example
For $n = 2$ (base case): standard multiplication needs $8$ multiplications; Strassen needs $7$ multiplications and $18$ additions. For $n = 2^{10} = 1024$: Strassen uses $\approx n^{2.807} \approx 1.07 \times 10^8$ multiplications versus $n^3 = 1.07 \times 10^9$ — a factor of $\approx 10\times$ faster.

## Key Properties
- Total multiplications: $n^{\log_2 7} \approx n^{2.807}$ versus $n^3$ for naive multiplication.
- Total additions: $6(7^{r-1} - 4^{r-1}) \leq n^{\log_2 7}$ — also sub-cubic.
- The speedup factor versus naive is $\approx n^{3 - \log_2 7} \to \infty$ as $n \to \infty$, but constant factors make Strassen practical only for $n \gtrsim 100$–$1000$.

## Why It Works
The 7 auxiliary products are chosen so that the 18 additions required to form them and reconstruct $C$ are algebraically consistent — each $C_i$ comes out exactly right. The identity is a non-obvious algebraic miracle: there is no intuitive reason it should work, which is why Strassen's 1969 discovery was surprising.

## Bridge to Other Domains
> **→ Coding:** Strassen's algorithm is the prototype of "algebraic tricks beat brute force" — the same idea of replacing multiplications with additions via clever identity appears in the Fast Fourier Transform and in hardware multiplier design.
> *Why it matters:* Understanding that arithmetic operation counts can be reduced by algebraic rearrangement is fundamental to the design of efficient numerical and signal-processing algorithms.

## Common Confusions
> ⚠ You might think **Strassen is always faster** — but actually **cache effects and constant factors make the naive $n^3$ algorithm faster for small $n$** (typically $n < 100$–$500$ depending on hardware), so production libraries switch between the two based on matrix size.

## Guru's Note
Strassen is more important as a proof of concept — that $n^3$ is not a fundamental barrier — than as a day-to-day tool; the real lesson is to always question whether the obvious algorithm is optimal.