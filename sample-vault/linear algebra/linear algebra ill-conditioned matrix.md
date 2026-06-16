---
title: linear algebra ill-conditioned matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra partial pivoting]]", "[[linear algebra full pivoting]]"]
builds-into: []
related: ["[[linear algebra gaussian elimination operation count]]"]
---

# Ill-Conditioned Matrix

## Plain English
An ill-conditioned matrix is one that is "almost singular" in the sense that tiny changes to the right-hand side or to matrix entries produce enormous changes in the solution.

## Intuition
Imagine two nearly-parallel lines: their intersection point is extremely sensitive to any slight rotation of either line — move either line by a hair and the intersection jumps by a mile. An ill-conditioned system is geometrically just that.

## Formal Definition
> **Definition:**
> The canonical example is the $n \times n$ **Hilbert matrix**:
> $$H_n = \left(\frac{1}{i+j-1}\right)_{i,j=1}^{n}, \quad \text{i.e.,} \quad (H_n)_{ij} = \frac{1}{i+j-1}$$
>
> $H_n$ is nonsingular for all $n$, but its condition number grows exponentially in $n$, making numerical solution unreliable even with partial pivoting for moderate $n$.

## Worked Example
For $n = 3$:
$$H_3 = \begin{bmatrix} 1 & \frac{1}{2} & \frac{1}{3} \\ \frac{1}{2} & \frac{1}{3} & \frac{1}{4} \\ \frac{1}{3} & \frac{1}{4} & \frac{1}{5} \end{bmatrix}$$
Choosing a random $x$ and computing $b = H_{20} x$, then solving $H_{20} x = b$ by Gaussian Elimination, often returns a solution with no correct digits — despite the matrix being theoretically nonsingular.

## Key Properties
- Ill-conditioning is a property of the matrix, not the algorithm — no pivoting strategy fully rescues a highly ill-conditioned system.
- The condition number (formalized in Section 8.7) quantifies sensitivity; for $H_n$ it grows roughly as $e^{3.5n}$.
- Exact rational arithmetic can solve Hilbert systems exactly, at the cost of exponentially growing integers.

## Why It Works
The rows of $H_n$ are nearly linearly dependent: as $n$ grows, the columns of $H_n$ approach a span of functions $\{1, x, x^2, \ldots\}$ sampled at rational points, which become increasingly collinear in high dimension. Near-dependence means the inverse has enormous entries, so rounding errors in the solve are amplified by those entries into large errors in the solution.

## Bridge to Other Domains
> **→ Numerical Methods:** The condition number determines the number of significant digits lost during floating-point solve — a condition number of $10^k$ means you lose $k$ decimal digits of accuracy, which is why condition estimation is built into every production linear solver.
> *Why it matters:* A solver that returns a result without a condition estimate gives you no way to trust or distrust the answer.

## Common Confusions
> ⚠ You might think **a nonsingular matrix is always safely solvable** — but actually **ill-conditioned nonsingular matrices can produce solutions with zero correct digits** in floating-point arithmetic, because "nonsingular" and "numerically stable" are not the same property.

## Guru's Note
Always check the condition number before trusting a computed solution — a matrix can be theoretically invertible and numerically useless at the same time.