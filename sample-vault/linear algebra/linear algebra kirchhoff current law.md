---
title: linear algebra kirchhoff current law
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra electrical network graph model]]", "[[linear algebra kirchhoff voltage law]]"]
builds-into: ["[[linear algebra network equilibrium system]]"]
related: ["[[linear algebra discrete gradient divergence duality]]"]
---

# Linear Algebra Kirchhoff Current Law

## Plain English
At every node in a network, the total current flowing out along wires equals the external current being injected at that node — no charge accumulates.

## Intuition
Picture a pipe junction: every drop of water that enters through one pipe must exit through another — the junction itself never fills up or drains.

## Formal Definition
> **Definition:**
> Let $y \in \mathbb{R}^m$ be the wire currents, $A$ the incidence matrix, and $f \in \mathbb{R}^n$ the vector of external current sources at each node. Kirchhoff's Current Law is:
> $$A^T y = f$$
>
> The $(i,k)$ entry of $A^T$ is $+1$ if wire $k$ starts at node $i$ and $-1$ if it ends there, so $A^T y$ computes the net current leaving each node.

## Worked Example
With 4 nodes and 5 wires, injecting 1 amp at node 1 gives $f = (1, 0, 0, 0)^T$. The KCL equations expand to:
$$y_1 + y_2 + y_3 = 1, \quad -y_1 + y_4 = 0, \quad -y_2 + y_5 = 0, \quad -y_3 - y_4 - y_5 = 0$$
which is exactly $A^T y = f$ with the $4 \times 5$ matrix $A^T$.

## Key Properties
- The coefficient matrix in KCL is $A^T$, the transpose of the incidence matrix used in KVL
- A solution exists iff $f \perp \ker A^{TT} = \ker A$, which requires $\sum_i f_i = 0$
- KCL is a constitutive-free law: it holds regardless of wire resistance

## Why It Works
$A^T$ is the discrete divergence operator: it measures the net outflow at each node. Conservation of charge says this outflow must equal the external injection $f$, so KCL is exactly "divergence of current equals source," the discrete analogue of $\nabla \cdot J = \rho$.

## Bridge to Other Domains
> **→ Differential Equations:** $A^T y = f$ is the discrete form of $\nabla \cdot J = \rho$, linking circuit KCL directly to the continuity equation for charge density in electromagnetism.
> *Why it matters:* The finite-element discretization of fluid or electromagnetic PDEs produces exactly this matrix structure, so circuit intuition transfers to PDE solvers.

## Guru's Note
The transpose $A^T$ appearing here instead of $A$ is not a coincidence — KVL is a gradient law (uses $A$) and KCL is a divergence law (uses $A^T$), and gradient and divergence are always transposes of each other.