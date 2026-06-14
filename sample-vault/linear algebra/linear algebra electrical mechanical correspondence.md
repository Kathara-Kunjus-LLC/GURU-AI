---
title: linear algebra electrical mechanical correspondence
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra mass-spring chain]]", "[[linear algebra network equilibrium system]]", "[[linear algebra stiffness matrix]]", "[[linear algebra network resistivity matrix]]"]
builds-into: []
related: ["[[linear algebra equilibrium potential energy]]", "[[linear algebra hooke law]]", "[[linear algebra ohm law matrix form]]"]
---

# Linear Algebra Electrical Mechanical Correspondence

## Plain English
The equilibrium equations for an electrical resistive network and a mechanical mass–spring structure are mathematically identical, differing only in the physical meaning of each variable and matrix.

## Intuition
The same blueprint $Ku = f$ describes both a web of springs being stretched and a network of resistors carrying current — swap the labels on the variables and the physics changes but the math stays the same.

## Formal Definition
> **Definition:**
> Both systems share the three-equation structure:
> $$e = Au + b, \quad y = Ce, \quad A^T y = f, \quad \Rightarrow \quad Ku = f - A^T Cb$$
>
> | Mechanical | Electrical |
> |---|---|
> | Displacement $u$ | Voltage potential $u$ |
> | Prestress / imposed elongation $b$ | Battery voltage $b$ |
> | Elongation $e = Au + b$ | Wire voltage $v = Au + b$ |
> | Spring stiffness $C$ | Conductance $C$ |
> | Internal force $y = Ce$ | Wire current $y = Cv$ |
> | External force $f = A^T y$ | Current source $f = A^T y$ |
> | Stiffness matrix $K = A^T CA$ | Resistivity matrix $K = A^T CA$ |

## Worked Example
For a single spring (stiffness $c$) between nodes 1 and 2 vs. a single wire (conductance $c$) between nodes 1 and 2, both give the same $2 \times 2$ system:
$$K = c \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \quad Ku = f$$
Whether $u$ means displacement or potential, $f$ means force or current, and $c$ means stiffness or conductance is purely a labeling choice.

## Key Properties
- Both systems produce $K = A^T C A$, positive semi-definite, singular until one node is fixed (grounded or clamped)
- The same Fredholm solvability condition $\sum_i f_i = 0$ governs both: net force = 0 and net current = 0
- Both minimize a quadratic energy: potential energy in mechanics, power in circuits

## Why It Works
Both physics domains enforce a gradient law ($e = Au$), a linear constitutive law ($y = Ce$), and a divergence/balance law ($A^T y = f$). This three-step pattern — gradient, constitutive, divergence — is universal across continuum and discrete equilibrium problems.

## Bridge to Other Domains
> **→ Numerical Methods:** Finite-element discretization of any self-adjoint elliptic PDE (heat conduction, elasticity, Poisson) produces the identical $K = A^T C A$ structure, so every insight from spring/circuit equilibrium applies directly to FEM.
> *Why it matters:* A single numerical solver (e.g., Cholesky for $K$) handles mechanics, circuits, and PDE discretizations without modification.

> **→ Differential Equations:** The correspondence extends to continuous systems: $-\nabla \cdot (c \nabla u) = f$ is the PDE analogue of $Ku = f$, with $A$ → $\nabla$, $A^T$ → $-\nabla \cdot$, and $C$ → conductivity tensor.
> *Why it matters:* Knowing the discrete version makes the continuous PDE immediately interpretable — the Laplacian is just the continuum resistivity matrix.

## Guru's Note
Once you see $Ku = f$ with $K = A^T C A$, ask yourself "what is $A$, what is $C$, what is $u$?" — the answer tells you which physical domain you're in.