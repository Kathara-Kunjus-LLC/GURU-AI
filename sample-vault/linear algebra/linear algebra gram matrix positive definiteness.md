---
title: linear algebra gram matrix positive definiteness
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: []
builds-into: ["[[linear algebra stiffness matrix]]", "[[linear algebra equilibrium potential energy]]"]
related: []
---

# Linear Algebra Gram Matrix Positive Definiteness

## Plain English
Any matrix of the form $A^T C A$ with $C$ positive definite and $A$ full column rank is automatically positive definite — this is the algebraic engine behind why equilibrium systems have unique solutions.

## Intuition
Think of $A$ as a "lens" that maps displacements into elongation space; $C$ measures energy in that space; and $A^T$ maps the energy gradient back — composing them always produces a bowl-shaped (positive definite) energy landscape.

## Formal Definition
> **Definition:**
> Let $A \in \mathbb{R}^{m \times n}$ have linearly independent columns and $C \in \mathbb{R}^{m \times m}$ be positive definite. Then:
> $$K = A^T C A \text{ is positive definite}$$
>
> **Proof sketch:** For any $u \neq 0$: $u^T K u = (Au)^T C (Au) = \|Au\|_C^2 > 0$ since $Au \neq 0$ (by column independence of $A$) and $C > 0$.

## Worked Example
Let $A = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$ (one mass, two springs) and $C = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$:
$$K = A^T C A = \begin{bmatrix} 1 & -1 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ -1 \end{bmatrix} = 5$$

$K = 5 > 0$: a scalar positive definite matrix. Any force $f$ gives unique displacement $u = f/5$.

## Key Properties
- Symmetry is automatic: $(A^T C A)^T = A^T C^T A = A^T C A$
- Column independence of $A$ is necessary: if $Au = 0$ for some $u \neq 0$, then $u^T K u = 0$ and $K$ is only positive semi-definite
- $K$ inherits nonsingularity from positive definiteness, guaranteeing a unique solution to $Ku = f$

## Why It Works
The $C$-weighted norm $\|Au\|_C^2$ cannot be zero unless $Au = 0$ (because $C > 0$), and $Au = 0$ cannot happen unless $u = 0$ (because $A$ has independent columns). Chaining these two inferences gives strict positivity of the quadratic form.

## Bridge to Other Domains
> **→ Statistics:** The normal equations matrix $X^T X$ in least squares is a Gram matrix $A^T I A$; adding regularization gives $X^T X + \lambda I$, both positive (semi-)definite by the same argument, guaranteeing unique regression coefficients.
> *Why it matters:* The condition number of $A^T C A$ controls both the stability of equilibrium solutions and the convergence rate of iterative regression solvers.

## Guru's Note
Whenever you see $A^T C A$ in any context — mechanics, statistics, control — immediately conclude symmetric positive (semi-)definite; the only question is whether $A$ has full column rank.