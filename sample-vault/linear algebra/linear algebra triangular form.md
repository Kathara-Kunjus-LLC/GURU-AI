---
title: linear algebra triangular form
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra linear system]]", "[[linear algebra gaussian elimination]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra back substitution]]"]
related: ["[[linear algebra matrix factorization]]"]
---

# Linear Algebra Triangular Form

## Plain English
A linear system is in triangular form when each successive equation involves one fewer unknown than the one above it, so the last equation has only one unknown and the system can be solved from the bottom up.

## Intuition
Picture a staircase descending from left to right: the top step spans all variables, the next step starts one column to the right, and so on until the bottom step is a single column — reading solutions up the staircase is back-substitution.

## Formal Definition
> **Definition:**
> A system $U\mathbf{x} = \mathbf{c}$ is in upper-triangular form if $U$ is upper-triangular:
> $$u_{ij} = 0 \text{ for all } i > j$$
> so the system looks like
> $$\begin{bmatrix} u_{11} & u_{12} & \cdots & u_{1n} \\ 0 & u_{22} & \cdots & u_{2n} \\ \vdots & & \ddots & \vdots \\ 0 & 0 & \cdots & u_{nn} \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{bmatrix} = \begin{bmatrix} c_1 \\ c_2 \\ \vdots \\ c_n \end{bmatrix}$$
>
> Where $u_{ii} \neq 0$ are the pivot entries (nonzero diagonal).

## Worked Example
After Gaussian Elimination on the example system, the triangular form is:
$$x + 2y + z = 2$$
$$2y - z = 3$$
$$\frac{5}{2}z = \frac{5}{2}$$

Back-substitute: from the last equation, $z = \frac{5/2}{5/2} = 1$. Substitute into the second: $2y = 3 + 1 = 4$, so $y = 2$. Substitute both into the first: $x = 2 - 2(2) - 1 = -3$.

## Key Properties
- Back-substitution solves a triangular system in $O(n^2)$ operations — much cheaper than the $O(n^3)$ elimination that produced it.
- The diagonal entries $u_{ii}$ are the pivots; a zero pivot signals no unique solution.
- Upper-triangular $U$ is the output of Gaussian Elimination and the $U$ factor of $LU$ decomposition.

## Why It Works
When the last equation has exactly one unknown, its solution is immediate by division. Substituting that solution into the second-to-last equation reduces it to one unknown, and so on — the staircase structure guarantees this cascades all the way to the top without any simultaneous solving.

## Bridge to Other Domains
> **→ Numerical Methods:** Triangular solves are the innermost kernel of almost all direct linear solvers; modern hardware is tuned to run them at peak throughput, so the $O(n^2)$ back-substitution cost is negligible compared to the $O(n^3)$ factorization.
> *Why it matters:* Separating the $O(n^3)$ factorization (done once) from the $O(n^2)$ triangular solve (repeated for each right-hand side) is the key efficiency gain of $LU$ decomposition.

## Guru's Note
The moment you see a triangular system, stop thinking "linear system" and start thinking "evaluate from the bottom up" — it is mechanically closer to evaluating a formula than to solving a system.