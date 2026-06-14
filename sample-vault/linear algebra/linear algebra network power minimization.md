---
title: linear algebra network power minimization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network equilibrium system]]", "[[linear algebra conductance matrix]]", "[[linear algebra network grounding]]"]
builds-into: []
related: ["[[linear algebra equilibrium potential energy]]", "[[linear algebra mass-spring chain]]"]
---

# Linear Algebra Network Power Minimization

## Plain English
An electrical network at equilibrium distributes voltage potentials so as to minimize the total power dissipated as heat across all wires.

## Intuition
Nature is "lazy" about wasting energy: electrons rearrange until the total rate of heat generation in all resistors is as small as possible given the constraints — equilibrium is the laziest steady state.

## Formal Definition
> **Definition:**
> The internal power of the network is the $C$-weighted squared norm of the voltages:
> $$P_\text{int} = \sum_j c_j v_j^2 = v^T C v = \|v\|_C^2$$
>
> The reduced power function (after grounding node $i$) is:
> $$p^\star(u^\star) = \frac{1}{2}(u^\star)^T K^\star u^\star - (u^\star)^T f^\star$$
>
> Its unique minimizer satisfies $K^\star u^\star = f^\star$, the equilibrium system.

## Worked Example
For a 3-wire network with $c_1 = c_2 = c_3 = 1$ and voltages $v = (1, 1, 2)^T$:
$$P_\text{int} = 1^2 + 1^2 + 2^2 = 6 \text{ watts}$$
Any other voltage vector satisfying the constraints (KVL and KCL) would yield higher power — the equilibrium solution minimizes this quantity.

## Key Properties
- Power in wire $j$: $P_j = c_j v_j^2 = R_j y_j^2$ — both resistance and conductance forms are equal
- The minimizer of $p^\star$ exists and is unique because $K^\star > 0$ (positive definite after grounding)
- With batteries, the full power $P = (Au+b)^T C (Au+b)$ is still minimized at equilibrium

## Why It Works
The equilibrium conditions $Ku = f$ are exactly the first-order optimality conditions (gradient = 0) for the quadratic $p^\star(u^\star)$. Since $K^\star > 0$, the quadratic is strictly convex, so the critical point is the global minimum — Nature literally solves a convex optimization problem.

## Bridge to Other Domains
> **→ Numerical Methods:** The finite-element method solves PDEs by minimizing a quadratic energy functional over trial functions — the Galerkin equations are the discrete Euler–Lagrange conditions, identical in structure to $K^\star u^\star = f^\star$.
> *Why it matters:* Convergence, stability, and error bounds for FEM all follow from the same convex minimization framework that justifies network equilibrium.

## Guru's Note
The fact that equilibrium minimizes power is not a physical law imposed from outside — it follows automatically from the linear algebra of positive definite systems.