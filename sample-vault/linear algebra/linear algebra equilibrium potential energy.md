---
title: linear algebra equilibrium potential energy
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra stiffness matrix]]", "[[linear algebra mass-spring chain]]"]
builds-into: []
related: []
---

# Linear Algebra Equilibrium Potential Energy

## Plain English
The total energy stored in a spring-mass system as a quadratic function of displacements, whose unique minimum point is exactly the equilibrium configuration.

## Intuition
Nature is lazy — the system settles into the displacement that costs the least energy overall, just as a ball rolling in a bowl always finds the bottom; the stiffness matrix shapes the bowl.

## Formal Definition
> **Definition:**
> $$p(u) = \frac{1}{2} u^T K u - u^T f$$
>
> Where $K = A^T C A > 0$ is the stiffness matrix, $f$ is the external force vector, and the unique minimizer satisfies $Ku = f$.

## Worked Example
Three masses, unit springs, both ends fixed, $f = (f_1, f_2, f_3)^T$:
$$p(u) = u_1^2 - u_1 u_2 + u_2^2 - u_2 u_3 + u_3^2 - f_1 u_1 - f_2 u_2 - f_3 u_3$$

Setting $\nabla p = 0$ gives:
$$\frac{\partial p}{\partial u_i} = 0 \implies Ku = f$$

The gradient condition is exactly the equilibrium equation.

## Key Properties
- $p(u)$ is strictly convex because $K > 0$, guaranteeing a unique global minimum
- At equilibrium $u^\star$: $p(u^\star) < 0$ whenever $f \neq 0$ (the system releases energy)
- Spring internal energy is $\frac{1}{2} e^T C e = \frac{1}{2} u^T K u$; external potential energy is $-u^T f$

## Why It Works
Differentiating $p(u)$ with respect to $u$ and setting to zero yields $Ku - f = 0$, which is precisely the equilibrium equation. Positive definiteness of $K$ ensures this critical point is a minimum, not a saddle — the physical principle that stable systems minimize energy has an exact algebraic counterpart.

## Bridge to Other Domains
> **→ Machine Learning:** The quadratic form $\frac{1}{2} u^T K u - u^T f$ is identical in structure to the ridge regression objective $\frac{1}{2}\|Au - b\|^2 + \frac{\lambda}{2}\|u\|^2$; both are minimized by solving a positive definite linear system.
> *Why it matters:* Recognizing this duality lets you borrow convex optimization guarantees — unique minimum, gradient descent convergence — from one domain for the other.

> **→ Differential Equations:** The energy functional $p(u) = \frac{1}{2}\int c(x)(u')^2 dx - \int f u\, dx$ is the continuous limit of $p(u) = \frac{1}{2}u^T K u - u^T f$; variational calculus minimizes it to recover the equilibrium ODE.
> *Why it matters:* The finite element method is nothing more than minimizing a discretized version of this energy, which is why $K = A^T C A$ appears universally.

## Guru's Note
Once you see $Ku = f$ as $\nabla p = 0$, you understand why positive definiteness of $K$ matters physically — it's what makes the equilibrium a stable energy minimum rather than an unstable saddle.