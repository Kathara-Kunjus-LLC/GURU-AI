---
title: linear algebra structural mechanics electrical network analogy
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss stiffness matrix]]", "[[linear algebra ohm law matrix form]]", "[[linear algebra conductance matrix]]", "[[linear algebra electrical mechanical correspondence]]"]
builds-into: []
related: ["[[linear algebra graph laplacian]]", "[[linear algebra network equilibrium system]]", "[[linear algebra truss hooke law constitutive relation]]"]
---

# Structural Mechanics Electrical Network Analogy

## Plain English
Trusses and resistor networks are governed by the same three-equation mathematical skeleton: a gradient law, a constitutive law, and a divergence (balance) law — with every quantity having a direct counterpart in both worlds.

## Intuition
Replace "displacement" with "voltage," "elongation" with "current," "bar stiffness" with "conductance," and "force" with "injected current," and every formula for a truss becomes a formula for a circuit — and vice versa.

## Formal Definition
> **Definition (Analogy Table):**
>
> | Structural | Electrical |
> |---|---|
> | Displacement $\mathbf{u}$ | Voltage $\mathbf{v}$ |
> | Elongation $\mathbf{e} = A\mathbf{u}$ | Voltage drop $\mathbf{e} = A\mathbf{v}$ |
> | Internal force $\mathbf{y} = C\mathbf{e}$ | Current $\mathbf{y} = G\mathbf{e}$ |
> | External force $\mathbf{f} = A^T\mathbf{y}$ | Injected current $\mathbf{f} = A^T\mathbf{y}$ |
> | Stiffness matrix $K = A^T C A$ | Graph Laplacian $L = A^T G A$ |
> | Bar stiffness $c_k$ | Conductance $g_k = 1/r_k$ |
> | Rigid translation | Uniform voltage shift |
> | Grounding a node | Fixing reference voltage |

## Worked Example
One-dimensional two-node truss (single bar, $c = 3$) vs. two-node resistor network (conductance $g = 3$, resistance $r = 1/3\ \Omega$). Both yield:

$$K = L = \begin{bmatrix} 3 & -3 \\ -3 & 3 \end{bmatrix}$$

Grounding node 2 (setting $u_2 = 0$ or $v_2 = 0$) gives reduced system $[3]\,x = b$, solved identically in both cases.

## Key Properties
- The mathematical identity is exact at the level of linear algebra; it is not an approximation.
- Physical meanings differ: bars resist compression as well as tension, while resistors obey Ohm's law in both current directions.
- The analogy extends to three dimensions: the truss incidence matrix is a $d$-dimensional generalization of the graph incidence matrix.

## Why It Works
Both systems arise from the same abstract pattern — a discrete gradient operator $A$, a diagonal positive-definite weight $C$ (or $G$), and its adjoint $A^T$ — because both model energy-minimizing equilibria on graphs. The $A^T C A$ structure is the universal form of the Hessian of a quadratic energy on a graph.

## Bridge to Other Domains
> **→ Machine Learning:** Graph neural networks and spectral graph methods use the graph Laplacian $L = A^T G A$ as a smoothness operator; the structural stiffness matrix is the same object applied to physical geometry.
> *Why it matters:* Intuition about rigidity and connectivity in structures directly informs why dense graph Laplacians produce smoother signals in spectral GNNs.

> **→ Differential Equations:** The truss equilibrium $K\mathbf{u} = \mathbf{f}$ discretizes the boundary value problem $-\nabla \cdot (c\,\nabla u) = f$; the same matrix $K$ appears in finite-element methods for elliptic PDEs.
> *Why it matters:* Finite-element stiffness matrices are literally truss stiffness matrices, so structural intuition transfers directly to PDE numerics.

## Guru's Note
Whenever you see $A^T C A$ with $C > 0$ diagonal, you are looking at a weighted Laplacian — the same object regardless of whether the application is circuits, trusses, PDEs, or graph learning.