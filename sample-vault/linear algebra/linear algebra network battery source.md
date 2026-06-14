---
title: linear algebra network battery source
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network equilibrium system]]", "[[linear algebra kirchhoff voltage law]]"]
builds-into: ["[[linear algebra network power minimization]]"]
related: []
---

# Linear Algebra Network Battery Source

## Plain English
A battery in a network is a voltage source along a wire that shifts the voltage equation by a fixed amount, and its effect is equivalent to injecting specific current sources at the wire's two endpoints.

## Intuition
A battery is like a pump in a water network that adds pressure across one pipe regardless of the flow: the extra pressure shifts the voltage balance on that wire, and the pump's effect propagates through the network exactly as if extra water were being injected at the pipe's ends.

## Formal Definition
> **Definition:**
> Let $b \in \mathbb{R}^m$ be the battery vector (entry $b_k$ is the voltage of a battery on wire $k$; $b_k = 0$ if no battery). The modified voltage equation is:
> $$v = Au + b$$
>
> Combined with $y = Cv$ and $A^T y = 0$ (no external current sources), the equilibrium system becomes:
> $$Ku = -A^T C b, \quad K = A^T C A$$
>
> The battery is equivalent to the current source vector:
> $$f = -A^T C b$$

## Worked Example
A 9V battery on wire 1 of a network with all $c_k = 1/2$ gives $b = (9, 0, \ldots, 0)^T$. The equivalent current source vector is:
$$f = -A^T C b = -\frac{1}{2} A^T b$$
The first column of $A^T$ (the row corresponding to wire 1) determines which nodes receive $\pm 9/2$ amps of equivalent current injection.

## Key Properties
- Battery on wire $k$ injects $-c_k b_k$ at the starting node and $+c_k b_k$ at the ending node
- The induced $f = -A^T C b$ automatically satisfies $\sum_i f_i = 0$, so equilibrium always exists
- Node potentials satisfy the weighted normal equations for $Au = -b$ under the $C$-norm

## Why It Works
Substituting $v = Au + b$ into $A^T y = A^T C v = 0$ gives $A^T C(Au + b) = 0$, or $Ku = -A^T C b$. The battery shifts the right-hand side but not the structure of the matrix $K$ — the same solver handles both current and voltage sources.

## Bridge to Other Domains
> **→ Linear Algebra:** The voltage potentials $u$ solving $Ku = -A^T C b$ are exactly the least squares solution to $Au = -b$ under the $C$-weighted norm $\|v\|_C^2 = v^T C v$, revealing that Nature minimizes a weighted residual.
> *Why it matters:* The same normal-equation structure appears in weighted least squares regression, so circuit intuition illuminates the geometry of overdetermined linear systems.

## Guru's Note
A battery is just a shifted right-hand side — convert it to equivalent current sources $f = -A^T C b$ and you can use the same solver you built for current-source networks.