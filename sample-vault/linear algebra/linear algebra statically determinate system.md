---
title: linear algebra statically determinate system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra reduced incidence matrix]]"]
builds-into: []
related: ["[[linear algebra statically indeterminate system]]", "[[linear algebra mass-spring chain]]"]
---

# Linear Algebra Statically Determinate System

## Plain English
A mechanical system where the internal forces can be found directly from the force-balance equations, without needing to know material stiffnesses or solve for displacements first.

## Intuition
A single rope holding a weight: the tension must equal the weight, full stop — stiffness is irrelevant because there is only one load path.

## Formal Definition
> **Definition:**
> A system is statically determinate if $A^T$ is square and nonsingular, so the internal forces satisfy:
> $$y = A^{-T} f$$
> where $A^{-T} = (A^T)^{-1}$, computed directly without solving for displacements.

## Worked Example
One-free-end chain, $n = 3$ masses, three springs. $A$ is $3 \times 3$ and square:
$$A = \begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix}$$

With $f = (mg, mg, mg)^T$:
$$y = A^{-T}f = \begin{bmatrix} 3mg \\ 2mg \\ mg \end{bmatrix}$$

Top spring carries all three masses; each lower spring carries one fewer.

## Key Properties
- Occurs when exactly one end is free, making $A$ square $n \times n$
- Internal forces are independent of spring stiffnesses $c_j$
- Displacements still require solving $Ku = f$, but forces do not

## Why It Works
With $n$ springs and $n$ unknowns in $f = A^T y$, the system is exactly determined. One fixed support provides just enough constraint so each spring's tension is dictated by the weight it must carry below it — stiffness distributes displacement, not force.

## Guru's Note
The physical punchline is intuitive: a hanging chain can always be cut and the tension at any point equals the weight hanging below it — that's why one fixed end makes the system determinate.