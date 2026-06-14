---
title: linear algebra ohm law matrix form
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra electrical network graph model]]"]
builds-into: ["[[linear algebra network equilibrium system]]", "[[linear algebra conductance matrix]]"]
related: ["[[linear algebra hooke law]]"]
---

# Linear Algebra Ohm Law Matrix Form

## Plain English
The current through each wire is proportional to the voltage across it, with proportionality constant equal to the wire's conductance (reciprocal of resistance).

## Intuition
Resistance is like friction in a pipe: double the pressure (voltage) and you double the flow (current); double the friction (resistance) and you halve the flow.

## Formal Definition
> **Definition:**
> Let $y \in \mathbb{R}^m$ be wire currents, $v \in \mathbb{R}^m$ wire voltages, and $C = R^{-1} = \text{diag}(c_1, \ldots, c_m)$ the diagonal conductance matrix with $c_k = 1/R_k > 0$. Ohm's Law in matrix form is:
> $$y = C v$$
>
> Equivalently, $v = R y$ where $R = \text{diag}(R_1, \ldots, R_m)$ is the diagonal resistance matrix.

## Worked Example
Five wires with resistances $R_1 = 2, R_2 = 4, R_3 = 1, R_4 = 2, R_5 = 4$ give conductances $c_k = 1/R_k$:
$$C = \begin{bmatrix} 1/2 & & & & \\ & 1/4 & & & \\ & & 1 & & \\ & & & 1/2 & \\ & & & & 1/4 \end{bmatrix}$$
If $v = (2, 4, 3, 2, 4)^T$, then $y = Cv = (1, 1, 3, 1, 1)^T$ amps.

## Key Properties
- $C$ is diagonal and positive definite: $C > 0$
- $C$ is invertible, so $v = R y = C^{-1} y$ and $y = C v$ are equivalent
- Each wire's equation is independent of all others — Ohm's Law has no cross-coupling

## Why It Works
Resistance measures how much a material opposes electron flow per unit of driving force (voltage). The linear relationship holds for ordinary conductors (Ohmic materials) because electron drift velocity is proportional to the applied electric field at normal temperatures.

## Bridge to Other Domains
> **→ Linear Algebra:** The conductance matrix $C$ plays exactly the same structural role as the spring stiffness matrix in a mass–spring chain — both are diagonal, positive definite, and sit between a gradient operator $A$ and its transpose $A^T$ in the product $K = A^T C A$.
> *Why it matters:* Any solver or theory developed for spring networks applies verbatim to resistive networks after substituting $C$ for stiffness.

## Guru's Note
Always work with conductances $c_k = 1/R_k$ rather than resistances — the matrices stay positive definite and the algebra stays clean.