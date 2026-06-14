---
title: linear algebra network equilibrium system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra kirchhoff voltage law]]", "[[linear algebra kirchhoff current law]]", "[[linear algebra ohm law matrix form]]", "[[linear algebra conductance matrix]]"]
builds-into: ["[[linear algebra network resistivity matrix]]"]
related: ["[[linear algebra mass-spring chain]]", "[[linear algebra stiffness matrix]]"]
---

# Linear Algebra Network Equilibrium System

## Plain English
The three laws governing an electrical network (voltage law, Ohm's law, current law) combine into a single linear system relating node voltages to external current sources.

## Intuition
Each law is one step in an assembly line: potentials produce voltages ($v = Au$), voltages drive currents ($y = Cv$), and currents must balance at nodes ($A^T y = f$) — chaining them gives one master equation.

## Formal Definition
> **Definition:**
> The three equilibrium equations are:
> $$v = Au, \quad y = Cv, \quad A^T y = f$$
>
> Substituting the first two into the third gives the master system:
> $$Ku = f, \quad K = A^T C A$$
>
> where $u \in \mathbb{R}^n$ are node potentials, $f \in \mathbb{R}^n$ are external current sources, and $K$ is the network resistivity matrix.

## Worked Example
With incidence matrix $A$ (5×4), conductance $C = I$ (5×5 identity), and current source $f = (1,0,0,-1)^T$:
$$K = A^T A, \quad Ku = f$$
Solving by Gaussian elimination yields node potentials; wire currents then follow from $y = CAu$.

## Key Properties
- The system has the same three-equation structure $v = Au$, $y = Cv$, $A^T y = f$ as a mass–spring chain
- $K = A^T C A$ is always positive semi-definite; it is positive definite iff the network is grounded
- Currents and voltages along wires are uniquely determined even when node potentials are not

## Why It Works
Each substitution step eliminates one intermediate variable; the final equation $Ku = f$ is solvable (up to grounding) because $K$ captures the network's full topology and conductance information. The three-step assembly ($A$, $C$, $A^T$) is the discrete analogue of the divergence-of-gradient ($\nabla \cdot C \nabla$) operator.

## Bridge to Other Domains
> **→ Numerical Methods:** Discretizing the Laplace PDE $\nabla \cdot (c \nabla u) = f$ on a mesh produces exactly $Ku = f$ with $K = A^T C A$, so circuit equilibrium is the prototype for all elliptic finite-element problems.
> *Why it matters:* Sparse solvers, multigrid methods, and preconditioning strategies designed for circuit matrices apply directly to FEM stiffness matrices.

## Guru's Note
Memorize the chain $v = Au \to y = Cv \to A^T y = f \to Ku = f$ — it is the same skeleton for every equilibrium problem in this chapter, mechanical or electrical.