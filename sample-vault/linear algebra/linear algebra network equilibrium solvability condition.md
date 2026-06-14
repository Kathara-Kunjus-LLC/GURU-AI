---
title: linear algebra network equilibrium solvability condition
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network resistivity matrix]]", "[[linear algebra kirchhoff current law]]"]
builds-into: ["[[linear algebra network grounding]]"]
related: ["[[linear algebra statically indeterminate system]]"]
---

# Linear Algebra Network Equilibrium Solvability Condition

## Plain English
A connected electrical network can reach a steady state only if the total current being injected equals the total current being extracted — the net current into the network must be zero.

## Intuition
You cannot pump water into a sealed tank forever without it overflowing — the network "overflows" (sparks fly) if current sources don't balance, so equilibrium requires what goes in to equal what comes out.

## Formal Definition
> **Definition:**
> For a connected network, $K = A^T CA$ has $\ker K = \text{span}\{\mathbf{1}\}$ where $\mathbf{1} = (1,\ldots,1)^T$. By the Fredholm Alternative, $Ku = f$ has a solution if and only if:
> $$\mathbf{1} \cdot f = f_1 + f_2 + \cdots + f_n = 0$$
>
> Equivalently, $f \in \text{img}\, K = (\ker K)^\perp$.

## Worked Example
Injecting 1 amp at node 1 with $f = (1, 0, 0, 0)^T$: sum is $1 \neq 0$, so no equilibrium exists — electrons accumulate and the system is unstable. Modifying to $f = (1, 0, 0, -1)^T$ (extract 1 amp at node 4): sum is $0$, equilibrium exists, and the system $Ku = f$ has a solution.

## Key Properties
- The condition $\sum_i f_i = 0$ is necessary and sufficient for equilibrium in a connected network
- For a disconnected graph, the condition must hold separately for each connected component
- The condition is automatically satisfied for batteries: $f = -A^T C b$ always has $\mathbf{1}^T f = -\mathbf{1}^T A^T C b = 0$ since $A\mathbf{1} = 0$

## Why It Works
The kernel of $K$ is spanned by $\mathbf{1}$ for a connected graph (Proposition 2.51 + Proposition 3.36 in the text). The Fredholm Alternative then says $f$ must be orthogonal to $\ker K^\perp$ wait — orthogonal to $\ker K^T = \ker K$ (since $K$ is symmetric), which means $\mathbf{1} \cdot f = 0$. Physically: charge is conserved, so the network cannot be a source or sink of electrons.

## Bridge to Other Domains
> **→ Differential Equations:** The condition $\sum f_i = 0$ is the discrete analogue of $\int_\Omega f \, dV = 0$ required for the Poisson equation $-\nabla^2 u = f$ on a domain with Neumann boundary conditions — the Fredholm Alternative operates identically in both settings.
> *Why it matters:* Any numerical method that discretizes Neumann BCs will encounter this solvability check, and the circuit intuition makes the condition physically obvious.

## Guru's Note
Before setting up any network equilibrium system, check that your current sources sum to zero — if they don't, no amount of linear algebra will produce a steady state.