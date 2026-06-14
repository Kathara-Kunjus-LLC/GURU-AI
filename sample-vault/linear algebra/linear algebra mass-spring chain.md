---
title: linear algebra mass-spring chain
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: []
builds-into: ["[[linear algebra stiffness matrix]]", "[[linear algebra reduced incidence matrix]]", "[[linear algebra equilibrium potential energy]]"]
related: ["[[linear algebra hooke law]]", "[[linear algebra statically indeterminate system]]"]
---

# Linear Algebra Mass-Spring Chain

## Plain English
A chain of masses connected by springs, analyzed as a linear system to find how far each mass moves when external forces are applied.

## Intuition
Think of hanging weights on a bungee cord tied between two hooks — the cord stretches by amounts that depend on where each weight sits, and you want to know each attachment point's final position without measuring physically.

## Formal Definition
> **Definition:**
> $$Ku = f, \quad K = A^T C A$$
>
> Where $u \in \mathbb{R}^n$ is the displacement vector of $n$ masses, $f \in \mathbb{R}^n$ is the external force vector, $A$ is the $(n+1) \times n$ reduced incidence matrix, and $C$ is the diagonal matrix of spring stiffnesses.

## Worked Example
Three masses, four identical unit springs, both ends fixed. Stiffness matrix:
$$K = A^T A = \begin{bmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 2 \end{bmatrix}$$

Apply force $f = (0, 1, 0)^T$ on the middle mass:
$$Ku = f \implies u = \left(\frac{1}{2}, 1, \frac{1}{2}\right)^T$$

The middle mass moves twice as far as the outer two.

## Key Properties
- $K = A^T C A$ is always symmetric positive definite when $A$ has linearly independent columns and $C > 0$
- The unique solution $u = K^{-1}f$ exists for every external force $f$
- $K$ has a symmetric tridiagonal structure, enabling fast solution via the tridiagonal algorithm

## Why It Works
The three-step factoring $e = Au$, $y = Ce$, $f = A^T y$ chains geometry, constitutive law, and force balance into one system. The transpose $A^T$ appearing in the force balance is not coincidence — it is the mathematical signature of duality between displacements and forces, which forces $K$ to be a Gram matrix and hence positive definite.

## Bridge to Other Domains
> **→ Differential Equations:** The mass-spring chain is the discrete analogue of the second-order boundary value problem $-(c\,u')' = f$ on an interval; taking the mesh spacing to zero converts $K$ into a differential operator.
> *Why it matters:* Finite element methods exploit this exact correspondence to solve PDEs by building $K$ from element stiffness matrices.

## Common Confusions
> ⚠ You might think you can recover internal forces $y$ directly from $f = A^T y$ — but $A^T$ is not square in the fixed-end case, so the system is underdetermined; you must solve for $u$ first.

## Guru's Note
Keep the three-step pipeline $e = Au \to y = Ce \to f = A^T y$ in front of you — every equilibrium problem in the chapter is just a substitution into it.