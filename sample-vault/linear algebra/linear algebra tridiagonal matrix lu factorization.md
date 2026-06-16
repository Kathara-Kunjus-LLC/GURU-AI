---
title: linear algebra tridiagonal matrix lu factorization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra tridiagonal matrix]]", "[[linear algebra ldv factorization]]"]
builds-into: ["[[linear algebra banded matrix]]"]
related: ["[[linear algebra gaussian elimination operation count]]"]
---

# Tridiagonal Matrix LU Factorization

## Plain English
The $LU$ factorization of a tridiagonal matrix produces a lower bidiagonal $L$ and an upper bidiagonal $U$, and the entire factorization requires only $O(n)$ operations instead of $O(n^3)$.

## Intuition
Because the zero entries in a tridiagonal matrix never "fill in" during elimination — each pivot only affects one row below it — the factors stay just as sparse as you would hope, with one subdiagonal in $L$ and one superdiagonal in $U$.

## Formal Definition
> **Definition:**
> For a regular tridiagonal matrix $A$ with diagonals $q_i$, $p_i$ (sub), $r_i$ (super), the factors are:
> $$L = \begin{bmatrix} 1 & & \\ l_1 & 1 & \\ & \ddots & \ddots \end{bmatrix}, \quad U = \begin{bmatrix} d_1 & u_1 & \\ & d_2 & \ddots \\ & & \ddots \end{bmatrix}$$
>
> Computed recursively by: $d_1 = q_1$, $u_j = r_j$, $l_j = p_j / d_j$, $d_{j+1} = q_{j+1} - l_j u_j$.

## Worked Example
For the $3 \times 3$ matrix with $q_i = 4$, $p_i = r_i = 1$:
$$d_1 = 4, \quad u_1 = 1, \quad l_1 = \frac{1}{4} = 0.25$$
$$d_2 = 4 - l_1 u_1 = 4 - 0.25 = 3.75, \quad u_2 = 1, \quad l_2 = \frac{1}{3.75} \approx 0.2\overline{6}$$
$$d_3 = 4 - l_2 u_2 \approx 4 - 0.2\overline{6} \approx 3.7\overline{3}$$

## Key Properties
- The full factorization requires $O(n)$ multiplications — specifically $3(n-1)$ — versus $\frac{1}{3}n^3$ for a dense matrix.
- Forward and Back Substitution on the bidiagonal factors also cost $O(n)$: total solve is $5n - 4$ multiplications and $3n - 3$ additions.
- The factorization is valid as long as no pivot $d_j$ is zero; no sparsity is lost (no fill-in).

## Why It Works
Each elimination step for a tridiagonal matrix involves only the single entry directly below the pivot, not an entire column. The modified entry is already zero one step later, so the subdiagonal of $L$ captures everything and nothing else is disturbed — sparsity is structurally preserved.

## Bridge to Other Domains
> **→ Numerical Methods:** The Thomas algorithm — this exact recursive procedure — is the standard method for solving 1D finite-difference and finite-element systems, reducing what would be an $O(n^3)$ dense solve to $O(n)$.
> *Why it matters:* Time-stepping methods for diffusion and wave equations call this inner loop millions of times; the $O(n)$ cost is what keeps them tractable.

## Guru's Note
The convergence of $d_j \to 2 + \sqrt{3}$ for the uniform tridiagonal is a beautiful hint that iterative fixed-point theory is lurking behind direct factorization methods.