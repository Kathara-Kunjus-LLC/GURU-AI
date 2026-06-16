---
title: linear algebra partial pivoting
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra gaussian elimination operation count]]"]
builds-into: ["[[linear algebra full pivoting]]", "[[linear algebra ill-conditioned matrix]]"]
related: ["[[linear algebra matrix inverse inefficiency]]"]
---

# Partial Pivoting

## Plain English
At each step of Gaussian Elimination, swap the current row with whichever row below it has the largest absolute value in the pivot column, before performing the elimination.

## Intuition
A tiny pivot forces you to multiply by a huge factor $l_{ij} = m_{ij}/m_{jj}$, which amplifies any rounding error in the rows below; choosing the largest available entry as pivot keeps all multipliers $|l_{ij}| \leq 1$, bounding error growth.

## Formal Definition
> **Definition:**
> At elimination step $j$, before applying row operations, find the row index $i^* \geq j$ that maximizes:
> $$i^* = \arg\max_{i \geq j} |m_{r(i),j}|$$
>
> Then interchange pointers $r(i^*) \leftrightarrow r(j)$ (no physical row swap needed), and proceed with the pivot $m_{r(j),j}$.

## Worked Example
System: $0.01x + 1.6y = 32.1$ and $x + 0.6y = 22$. Without pivoting, pivot $= 0.01$ and multiplier $l = 100$, giving catastrophic rounding. With partial pivoting, swap rows so pivot $= 1$, multiplier $l = 0.01$:
$$\begin{bmatrix} 1 & 0.6 \\ 0.01 & 1.6 \end{bmatrix} \to \begin{bmatrix} 1 & 0.6 \\ 0 & 1.594 \end{bmatrix}$$
Back substitution: $y \approx 20.0$, $x \approx 9.9$ — close to the exact solution $(10, 20)$.

## Key Properties
- All multipliers $l_{ij}$ satisfy $|l_{ij}| \leq 1$, which bounds forward error propagation.
- Implemented via a pointer array, not physical row swaps — no extra memory movement cost.
- Does not add to the $\frac{1}{3}n^3$ operation count; overhead is $O(n^2)$ comparisons to find maxima.

## Why It Works
Rounding errors scale with the magnitudes of intermediate quantities; a large pivot keeps all multipliers at most 1, so errors in each eliminated row are scaled down rather than amplified. The bound $|l_{ij}| \leq 1$ means rounding errors cannot cascade exponentially through the elimination.

## Bridge to Other Domains
> **→ Numerical Methods:** Partial pivoting is the default stability guarantee in LAPACK's `dgesv` routine — every production linear algebra library implements $PA = LU$ (with permutation matrix $P$) rather than plain $LU$ because of this.
> *Why it matters:* Skipping pivoting in floating-point code is a silent correctness bug that surfaces only on near-singular or poorly-scaled inputs.

## Common Confusions
> ⚠ You might think **partial pivoting fixes all numerical problems** — but actually **it fails for systems with small pivots but large row entries** (like scaling the first equation by 1000), which is exactly the case where full pivoting is needed.

## Guru's Note
Partial pivoting costs almost nothing and prevents catastrophic failure; treating it as optional is the numerical analyst's equivalent of not wearing a seatbelt.