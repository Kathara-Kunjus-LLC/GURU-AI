---
title: linear algebra truss bar elongation linear approximation
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra discrete gradient divergence duality]]"]
builds-into: ["[[linear algebra truss incidence matrix]]", "[[linear algebra truss stiffness matrix]]"]
related: ["[[linear algebra electrical mechanical correspondence]]"]
---

# Truss Bar Elongation Linear Approximation

## Plain English
When a bar's endpoints move by small amounts, the change in the bar's length can be well approximated by a simple dot product formula instead of the exact nonlinear square-root expression.

## Intuition
Imagine stretching a rubber band slightly — only the component of motion pulling along the band's length actually stretches it; sideways wiggles barely change the length at all. The dot product with the unit vector along the bar captures exactly that lengthwise component.

## Formal Definition
> **Definition:**
> If bar $k$ connects node $i$ to node $j$ with unit vector $\mathbf{n}_k = \frac{\mathbf{a}_i - \mathbf{a}_j}{\|\mathbf{a}_i - \mathbf{a}_j\|}$, then its linearized elongation under nodal displacements $\mathbf{u}_i, \mathbf{u}_j \in \mathbb{R}^d$ is
> $$e_k = \mathbf{n}_k \cdot (\mathbf{u}_i - \mathbf{u}_j)$$
>
> Where $e_k$ is the elongation of bar $k$, $\mathbf{n}_k$ is the unit vector pointing from node $j$ toward node $i$, and $\mathbf{u}_i, \mathbf{u}_j$ are the displacement vectors of the two endpoint nodes.

## Worked Example
Let bar $k$ run from $\mathbf{a}_j = (0,0)^T$ to $\mathbf{a}_i = (3,4)^T$, so $L = 5$ and $\mathbf{n}_k = (3/5, 4/5)^T$. Suppose node $i$ moves by $\mathbf{u}_i = (1, 0)^T$ and node $j$ moves by $\mathbf{u}_j = (0, 0)^T$.

$$e_k = \mathbf{n}_k \cdot (\mathbf{u}_i - \mathbf{u}_j) = \left(\frac{3}{5}, \frac{4}{5}\right) \cdot (1, 0) = \frac{3}{5}$$

So the bar elongates by $0.6$ units — less than the full displacement $1$, because only the lengthwise component counts.

## Key Properties
- The exact elongation $\|(\mathbf{a}_i - \mathbf{a}_j) + (\mathbf{u}_i - \mathbf{u}_j)\| - \|\mathbf{a}_i - \mathbf{a}_j\|$ is nonlinear in displacements; the linearization is valid when $\|\mathbf{u}\| \ll L$.
- The linearized elongation depends only on the unit direction $\mathbf{n}_k$, not on bar length $L$.
- Rigid motions (translations and infinitesimal rotations) produce zero elongation in every bar.

## Why It Works
The exact elongation is a square-root function of $\varepsilon$; its first-order Taylor expansion around $\varepsilon = 0$ gives $g'(0)\varepsilon = \varepsilon \, b/a$, where $b = (\mathbf{a}_i - \mathbf{a}_j) \cdot (\mathbf{u}_i - \mathbf{u}_j)$ and $a = \|\mathbf{a}_i - \mathbf{a}_j\|$. Dividing by $\varepsilon$ and dropping the small-displacement parameter yields the dot-product formula. This is the same linearization used in calculus tangent-line approximations.

## Bridge to Other Domains
> **→ Signal Processing:** The projection of a displacement vector onto a unit direction is the same operation as computing the component of a signal along a basis vector in transform analysis.
> *Why it matters:* Both problems reduce to inner products with unit vectors, so orthogonal decompositions unify structural analysis and spectral methods.

## Common Confusions
> ⚠ You might think the elongation equals the full magnitude $\|\mathbf{u}_i - \mathbf{u}_j\|$ — but actually it equals only the dot product with $\mathbf{n}_k$, because perpendicular motion rotates the bar without stretching it.

## Guru's Note
Draw the unit vector along the bar and project the relative displacement onto it — that projection is all that matters for elongation.