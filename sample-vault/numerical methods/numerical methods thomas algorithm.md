---
title: numerical methods thomas algorithm
domain: numerical methods
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra tridiagonal matrix lu factorization]]"]
builds-into: []
related: ["[[linear algebra banded matrix]]", "[[linear algebra gaussian elimination operation count]]"]
---

# Thomas Algorithm

## Plain English
The Thomas algorithm is a specialized form of Gaussian Elimination that solves a tridiagonal linear system in $O(n)$ operations by exploiting the fact that only the three central diagonals are nonzero.

## Intuition
Because each equation in a tridiagonal system involves at most three consecutive unknowns, elimination never needs to propagate beyond the adjacent entry — so each pivot step touches only one row below it, making the whole sweep linear in $n$.

## Formal Definition
> **Definition:**
> Given tridiagonal $Ax = b$ with diagonals $p_i$ (sub), $q_i$ (main), $r_i$ (super):
>
> **Forward sweep** (factorization + forward substitution combined):
> $$d_1 = q_1, \quad c_1 = b_1; \qquad l_j = \frac{p_j}{d_j}, \quad d_{j+1} = q_{j+1} - l_j r_j, \quad c_{j+1} = b_{j+1} - l_j c_j$$
>
> **Back substitution:**
> $$x_n = \frac{c_n}{d_n}; \qquad x_j = \frac{c_j - r_j x_{j+1}}{d_j}, \quad j = n-1, \ldots, 1$$

## Worked Example
For $n = 3$, $q_i = 4$, $p_i = r_i = 1$, $b = (5, 6, 5)^T$:
$$d_1 = 4, \; c_1 = 5; \quad l_1 = \tfrac{1}{4}, \; d_2 = 4 - \tfrac{1}{4} = 3.75, \; c_2 = 6 - \tfrac{5}{4} = 4.75$$
$$l_2 = \tfrac{1}{3.75} \approx 0.267, \; d_3 \approx 3.733, \; c_3 = 5 - 0.267 \cdot 4.75 \approx 3.733$$
$$x_3 = \tfrac{3.733}{3.733} = 1, \; x_2 = \tfrac{4.75 - 1}{3.75} = 1, \; x_1 = \tfrac{5 - 1}{4} = 1$$

## Key Properties
- Total cost: $5n - 4$ multiplications/divisions and $3n - 3$ additions — exactly $O(n)$.
- No fill-in: the bidiagonal $L$ and $U$ factors stay within the original band.
- Requires all pivot entries $d_j \neq 0$; diagonally dominant tridiagonal matrices are always regular.

## Why It Works
The tridiagonal structure means each pivot eliminates exactly one subdiagonal entry and modifies exactly one diagonal entry — no cascading updates to a full row. The sequential sweep is thus a chain of scalar operations with no branching or submatrix updates.

## Bridge to Other Domains
> **→ Numerical Methods:** The Thomas algorithm is the standard inner loop for solving 1D finite-difference and finite-element systems — every implicit ODE/PDE time-stepper calls it millions of times, so its $O(n)$ cost directly determines simulation throughput.
> *Why it matters:* An implicit time-stepping method that needs to invert a full $n \times n$ matrix per step would be $O(n^3)$ per step — the Thomas algorithm makes implicit methods competitive with explicit ones.

> **→ Signal Processing:** Cubic spline interpolation requires solving a tridiagonal system for the second derivatives at the knots; the Thomas algorithm makes this fast enough for real-time curve fitting and trajectory generation.
> *Why it matters:* Smooth real-time interpolation of sensor data or animation keyframes depends on this $O(n)$ solve being fast enough to run in a single video frame.

## Guru's Note
When you see a tridiagonal system, the Thomas algorithm should be your first and only thought — it is the textbook example of an algorithm that is optimal by construction.