---
title: linear algebra network grounding
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network resistivity matrix]]", "[[linear algebra reduced incidence matrix]]"]
builds-into: []
related: ["[[linear algebra statically determinate system]]", "[[linear algebra statically indeterminate system]]"]
---

# Linear Algebra Network Grounding

## Plain English
Grounding a node means fixing its voltage potential to zero, which eliminates the free parameter in the voltage solution and makes the reduced system uniquely solvable.

## Intuition
Voltage potential is like altitude above sea level — the actual altitude of a mountain is meaningless until you agree where "sea level" is; grounding picks that reference point.

## Formal Definition
> **Definition:**
> Ground node $i$ by setting $u_i = 0$. Delete column $i$ from $A$ to obtain the reduced incidence matrix $A^\star \in \mathbb{R}^{m \times (n-1)}$. The reduced resistivity matrix and system are:
> $$K^\star = (A^\star)^T C A^\star, \quad K^\star u^\star = f^\star$$
>
> where $u^\star$ and $f^\star$ are obtained by deleting the $i$-th entry from $u$ and $f$ respectively.

## Worked Example
Ground node 4 ($u_4 = 0$) in a 4-node network by deleting column 4 from $A$. If unit conductances give $K$ with all-unit conductances, then $K^\star$ is the $3 \times 3$ upper-left block of $K$:
$$K^\star = \begin{bmatrix} 3 & -1 & -1 \\ -1 & 2 & 0 \\ -1 & 0 & 2 \end{bmatrix}$$
This $3 \times 3$ system has a unique solution $u^\star$; voltages and currents follow from $v = A^\star u^\star$.

## Key Properties
- $\ker A^\star = \{0\}$: grounding eliminates the translational nullspace spanned by $\mathbf{1}$
- $K^\star > 0$: positive definite, so the reduced system has a unique solution
- $K^\star$ is obtained from $K$ by deleting the row and column of the grounded node

## Why It Works
The singularity of $K$ arises because adding a constant to all potentials leaves every voltage $v_k = u_i - u_j$ unchanged. Fixing one potential destroys this degree of freedom: $A^\star$ then has trivial kernel, making $K^\star = (A^\star)^T C A^\star$ positive definite.

## Bridge to Other Domains
> **→ Numerical Methods:** Grounding is the boundary condition that makes the discrete Laplace equation $Ku = f$ well-posed — it is the network analogue of a Dirichlet boundary condition, which pins the solution value at the domain boundary.
> *Why it matters:* Every finite-element solver for Laplace/Poisson PDEs uses exactly this trick to regularize the otherwise singular stiffness matrix.

## Guru's Note
Currents and wire voltages are always unique regardless of grounding — you only need to ground to pin down the absolute potential levels, not the physically observable quantities.