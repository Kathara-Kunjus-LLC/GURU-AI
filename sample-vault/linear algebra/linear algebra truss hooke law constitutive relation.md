---
title: linear algebra truss hooke law constitutive relation
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss bar elongation linear approximation]]"]
builds-into: ["[[linear algebra truss stiffness matrix]]"]
related: ["[[linear algebra ohm law matrix form]]", "[[linear algebra electrical mechanical correspondence]]"]
---

# Truss Hooke Law Constitutive Relation

## Plain English
Each bar in a truss acts like a spring: its internal force is proportional to how much it has been stretched or compressed.

## Intuition
A taut guitar string pulled sideways snaps back harder the more you pull; a structural bar does the same — the stiffness constant $c_k$ sets how hard it pushes back per unit of elongation.

## Formal Definition
> **Definition:**
> The internal force vector $\mathbf{y} \in \mathbb{R}^m$ is related to the elongation vector $\mathbf{e} \in \mathbb{R}^m$ by
> $$\mathbf{y} = C\mathbf{e}, \qquad C = \mathrm{diag}(c_1, c_2, \ldots, c_m)$$
>
> Where $c_k > 0$ is the stiffness of bar $k$, $y_k > 0$ means bar $k$ is in tension, and $y_k < 0$ means bar $k$ is in compression.

## Worked Example
Three bars with stiffnesses $c_1 = 2$, $c_2 = 1$, $c_3 = 3$ and elongations $e_1 = 0.5$, $e_2 = -0.2$, $e_3 = 0.1$:

$$C = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 3 \end{bmatrix}, \qquad \mathbf{e} = \begin{bmatrix} 0.5 \\ -0.2 \\ 0.1 \end{bmatrix}$$

$$\mathbf{y} = C\mathbf{e} = \begin{bmatrix} 1.0 \\ -0.2 \\ 0.3 \end{bmatrix}$$

Bar 1 is in tension ($y_1 = 1.0 > 0$), bar 2 in compression ($y_2 = -0.2 < 0$), bar 3 in tension.

## Key Properties
- $C$ is diagonal and positive definite: $C > 0$.
- The relation is linear (Hooke's law regime); large deformations require nonlinear models.
- $C$ plays the same role as the conductance matrix in electrical networks.

## Why It Works
Hooke's law is the first-order approximation to any smooth force-displacement curve near equilibrium; for small elongations the restoring force is accurately proportional to deformation. The diagonal structure of $C$ reflects the physical independence of bars — elongating one bar does not directly change the force in another.

## Bridge to Other Domains
> **→ Linear Algebra (Electrical Networks):** The constitutive relation $\mathbf{y} = C\mathbf{e}$ is structurally identical to Ohm's law $\mathbf{y} = C\mathbf{e}$ (current = conductance × voltage drop), making bars and resistors mathematically interchangeable.
> *Why it matters:* Every result derived for resistor networks — including the Gram-matrix structure of the Laplacian — carries over immediately to truss analysis.

## Guru's Note
Whenever you see a diagonal positive-definite matrix sandwiched between $A^T$ and $A$, you are looking at a weighted Gram matrix — and the stiffness matrix is exactly that.