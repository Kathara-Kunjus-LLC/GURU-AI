---
title: linear algebra truss stability theorem
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss stiffness matrix]]", "[[linear algebra truss mechanism]]", "[[linear algebra truss rigid motion kernel]]"]
builds-into: []
related: ["[[linear algebra network equilibrium solvability condition]]", "[[linear algebra network equilibrium system]]"]
---

# Truss Stability Theorem

## Plain English
A truss can resist any external loading without collapsing if and only if the only displacement that stretches no bar is the zero displacement — in other words, the reduced incidence matrix has no nontrivial kernel.

## Intuition
If there is any way to move the nodes without stressing any bar, then a tiny force in that direction will set the structure moving with no resistance; eliminating all such "free" directions is exactly what it means to be stable.

## Formal Definition
> **Definition (Theorem 6.8):**
> A structure with reduced incidence matrix $A^\star$ is stable if and only if
> $$\ker A^\star = \{\mathbf{0}\}$$
>
> Equivalently, the reduced stiffness matrix $K^\star = (A^\star)^T C A^\star$ is positive definite. More generally, an external force $\mathbf{f}^\star$ maintains equilibrium if and only if
> $$\mathbf{f}^\star \in \operatorname{coimg} A^\star = (\ker A^\star)^\perp$$

## Worked Example
Doubly-reduced triangular truss with two nodes fixed: the $2 \times 2$ reduced stiffness matrix

$$K^{\star\star} = \begin{bmatrix} \frac{3}{2} & -1 \\ -1 & \frac{3}{2} \end{bmatrix}$$

has eigenvalues $\frac{1}{2}$ and $\frac{5}{2}$, both positive, so $K^{\star\star} > 0$ and the structure is stable. Any force vector $\mathbf{f}^{\star\star} \in \mathbb{R}^2$ produces a unique displacement $\mathbf{u}^{\star\star} = (K^{\star\star})^{-1}\mathbf{f}^{\star\star}$.

## Key Properties
- Stability requires at least $d$ fixed nodes in $\mathbb{R}^d$ to remove rigid translations, plus additional constraints (fixed nodes or bars) to kill mechanisms.
- A planar structure needs 2 non-coincident fixed nodes minimum; a spatial structure needs 3 non-collinear fixed nodes minimum.
- Adding bars cannot destabilize a structure: appending rows to $A^\star$ can only shrink or preserve $\ker A^\star$.

## Why It Works
The Fredholm Alternative (Theorem 4.46) states that $A^\star \mathbf{u} = \mathbf{f}^\star$ has a solution if and only if $\mathbf{f}^\star \perp \ker (A^\star)^T$. For the force-balance equation $(A^\star)^T \mathbf{y} = \mathbf{f}^\star$, solvability requires $\mathbf{f}^\star \perp \ker A^\star$. When $\ker A^\star = \{\mathbf{0}\}$, no constraint is imposed on $\mathbf{f}^\star$, giving full stability.

## Bridge to Other Domains
> **→ Linear Algebra (Electrical Networks):** The grounded network stability condition — $\ker A^\star = \{\mathbf{0}\}$ after removing the grounded node's column — is the same theorem applied to electrical circuits, where it guarantees unique nodal potentials.
> *Why it matters:* A single mathematical criterion ($\ker A^\star = \{\mathbf{0}\}$) governs stability in both structural mechanics and circuit theory.

## Guru's Note
The theorem is elegant but easy to forget in the wrong form: stability is $\ker A^\star = \{\mathbf{0}\}$, not $\ker K^\star = \{\mathbf{0}\}$ — but the two are equivalent since $K^\star = (A^\star)^T C A^\star$ and $C > 0$.