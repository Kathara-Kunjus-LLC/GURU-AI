---
title: linear algebra truss stiffness matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss incidence matrix]]", "[[linear algebra truss hooke law constitutive relation]]"]
builds-into: ["[[linear algebra truss stability theorem]]"]
related: ["[[linear algebra graph laplacian]]", "[[linear algebra conductance matrix]]", "[[linear algebra network equilibrium system]]"]
---

# Truss Stiffness Matrix

## Plain English
The stiffness matrix $K$ of a truss is the symmetric positive semidefinite matrix that directly relates nodal displacements to the external forces needed to maintain those displacements at equilibrium.

## Intuition
If you think of the whole truss as a single giant spring connecting all nodes simultaneously, $K$ is its multidimensional spring constant: $K\mathbf{u} = \mathbf{f}$ says "push the nodes by $\mathbf{u}$, and you need forces $\mathbf{f}$ to hold them there."

## Formal Definition
> **Definition:**
> Given incidence matrix $A \in \mathbb{R}^{m \times dn}$ and diagonal stiffness matrix $C = \mathrm{diag}(c_1, \ldots, c_m) > 0$, the stiffness matrix is
> $$K = A^T C A$$
>
> and the equilibrium system is $K\mathbf{u} = \mathbf{f}$, where $\mathbf{f} \in \mathbb{R}^{dn}$ is the vector of external nodal forces. $K$ is positive definite if and only if $\ker A = \{\mathbf{0}\}$.

## Worked Example
One bar in $\mathbb{R}^1$ with $c = 2$ and $A = \begin{bmatrix} -1 & 1 \end{bmatrix}$:

$$K = A^T C A = \begin{bmatrix} -1 \\ 1 \end{bmatrix} \cdot 2 \cdot \begin{bmatrix} -1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & -2 \\ -2 & 2 \end{bmatrix}$$

This is positive semidefinite ($\det K = 0$) because the whole bar can translate rigidly: $K(1,1)^T = (0,0)^T$.

## Key Properties
- $K = A^T C A$ is a positive semidefinite Gram matrix for the $C$-weighted inner product on elongation space.
- $K$ is positive definite if and only if $A$ has trivial kernel (no rigid motions or mechanisms).
- Fixing nodes reduces $A$ to $A^\star$ and $K$ to $K^\star = (A^\star)^T C A^\star$; positive definiteness of $K^\star$ guarantees structural stability.

## Why It Works
Substituting $\mathbf{e} = A\mathbf{u}$ and $\mathbf{y} = C\mathbf{e}$ into the force-balance equation $\mathbf{f} = A^T\mathbf{y}$ gives $\mathbf{f} = A^T C A\mathbf{u} = K\mathbf{u}$. The transpose $A^T$ in the force-balance arises because internal bar forces project back onto nodal directions via the same unit vectors that defined elongations — a manifestation of the adjointness between the discrete gradient $A$ and the discrete divergence $A^T$.

## Bridge to Other Domains
> **→ Linear Algebra (Electrical Networks):** $K = A^T C A$ is the exact analogue of the network Laplacian $L = A^T G A$ (where $G$ is the conductance matrix), so truss equilibrium and resistive circuit equilibrium share the same mathematical structure.
> *Why it matters:* Software for one domain (e.g., circuit simulators) can be adapted directly for the other, and theoretical results transfer wholesale.

> **→ Control Systems:** The stiffness matrix appears as the potential-energy Hessian in Lagrangian mechanics; its positive definiteness is the matrix criterion for a stable equilibrium point.
> *Why it matters:* Structural stability analysis and control-system stability analysis are both questions about the spectrum of $K$.

## Guru's Note
The three-step recipe $\mathbf{e} = A\mathbf{u}$, $\mathbf{y} = C\mathbf{e}$, $\mathbf{f} = A^T\mathbf{y}$ always collapses to $K = A^T CA$ — memorize the recipe, not the matrix.