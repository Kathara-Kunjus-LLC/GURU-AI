---
title: linear algebra kirchhoff voltage law
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra electrical network graph model]]"]
builds-into: ["[[linear algebra kirchhoff current law]]", "[[linear algebra network equilibrium system]]"]
related: ["[[linear algebra discrete gradient divergence duality]]"]
---

# Linear Algebra Kirchhoff Voltage Law

## Plain English
The sum of voltages around any closed loop in a network is zero, which is the statement that voltage is a potential difference and not path-dependent.

## Intuition
Walking around a closed hiking trail always returns you to the same altitude, so the total elevation change must be zero — voltages around a loop work exactly the same way.

## Formal Definition
> **Definition:**
> Given the voltage vector $v = Au$ where $A$ is the incidence matrix and $u$ are node potentials, Kirchhoff's Voltage Law states that for every circuit vector $\ell \in \ker A^T$:
> $$\ell \cdot v = \ell^T v = \ell^T A u = 0$$
>
> This holds because $\ell \in \ker A^T$ means $A^T \ell = 0$, so $\ell^T A = 0$.

## Worked Example
For a triangular loop using wires 1, 4, 3 (wire 3 traversed backwards), the circuit vector is $\ell = (1, 0, -1, 1, 0)^T$. Check:
$$\ell^T v = v_1 - v_3 + v_4 = (u_1 - u_2) - (u_1 - u_4) + (u_2 - u_4) = 0$$
Every term cancels because potentials cancel along a closed path.

## Key Properties
- KVL is equivalent to $v \in \text{img}\, A$, i.e., voltages are realizable iff they satisfy KVL
- Circuit vectors span $\ker A^T = \text{coker}\, A$
- KVL is a topological law — it depends only on how wires connect, not on resistance values

## Why It Works
Voltage is a potential function on nodes, so $v_k = u_i - u_j$ is a gradient operation. Summing a gradient around a closed loop always gives zero by the fundamental theorem of calculus — the discrete analogue is orthogonality of $v$ to every circuit vector.

## Bridge to Other Domains
> **→ Differential Equations:** KVL is the discrete analogue of $\nabla \times E = 0$ (curl-free condition) for electrostatic fields, linking circuit theory to vector calculus.
> *Why it matters:* Both state that the field is conservative, and both are resolved by introducing a scalar potential — node voltages $u$ in circuits, electric potential $\phi$ in fields.

## Common Confusions
> ⚠ You might think **KVL constrains the resistances** — but actually **it constrains only the voltages**, independently of what the wires are made of, because it is purely topological.

## Guru's Note
KVL is just the statement that $v = Au$ has a solution — if voltages around every loop don't sum to zero, the voltages aren't physically realizable.