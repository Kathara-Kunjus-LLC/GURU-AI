---
title: linear algebra truss mechanism
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss rigid motion kernel]]", "[[linear algebra truss incidence matrix]]"]
builds-into: ["[[linear algebra truss stability theorem]]"]
related: ["[[linear algebra network equilibrium solvability condition]]", "[[linear algebra network voltage potential ambiguity]]"]
---

# Truss Mechanism

## Plain English
A mechanism is a non-rigid deformation of a structure — a way the nodes can move and change shape without stretching or compressing any bar, even after the structure has been grounded to remove rigid motions.

## Intuition
Imagine a parallelogram frame pinned at all four corners: you can shear it into a rhombus without changing any bar length. That shearing motion is a mechanism — the frame has no rigidity against it, so even a tiny sideways push will collapse it.

## Formal Definition
> **Definition:**
> After fixing enough nodes to remove all rigid motions (reducing $A$ to $A^\star$), any nonzero vector $\mathbf{z}^\star \in \ker A^\star$ is a mechanism of the structure.
>
> By the Fredholm Alternative, an external force $\mathbf{f}^\star$ maintains equilibrium if and only if
> $$\mathbf{f}^\star \perp \ker A^\star, \quad \text{i.e.,} \quad \mathbf{z}^\star \cdot \mathbf{f}^\star = 0 \text{ for all mechanisms } \mathbf{z}^\star.$$

## Worked Example
Three-bar planar structure (Example 6.7): after fixing nodes 1 and 4, the reduced incidence matrix $A^\star$ has $\ker A^\star$ spanned by $\mathbf{z}^\star = (1,-1,1,1)^T$. This represents:
- Node 2 moves in direction $(1,-1)^T$ (down-right at $45°$)
- Node 3 moves in direction $(1,1)^T$ (up-right at $45°$)

A horizontal force $f_2 = f_3 = 1$, $g_2 = g_3 = 0$ fails the orthogonality test:

$$\mathbf{z}^\star \cdot \mathbf{f}^\star = 1 \cdot 1 + (-1) \cdot 0 + 1 \cdot 1 + 1 \cdot 0 = 2 \neq 0$$

so it triggers the mechanism. A vertical force $f_2 = f_3 = 0$, $g_2 = g_3 = 1$ gives $\mathbf{z}^\star \cdot \mathbf{f}^\star = -1 + 1 = 0$: equilibrium is possible.

## Key Properties
- Mechanisms induce no internal bar forces; displacements along a mechanism are indeterminate.
- A structure with a mechanism is unstable: infinitesimal forces along the mechanism direction cause unbounded motion.
- Adding bars to $A^\star$ appends rows and can only shrink $\ker A^\star$; it never introduces new mechanisms.

## Why It Works
Because bars are modeled as one-dimensional springs that resist only elongation/compression, any deformation mode orthogonal to all bar directions costs zero energy. The Fredholm Alternative then dictates that the force must also be orthogonal to those zero-energy modes for a solution to exist.

## Bridge to Other Domains
> **→ Control Systems:** A mechanism in a structure corresponds to an uncontrollable mode in a linear system — a direction the control inputs cannot influence, leading to potential instability.
> *Why it matters:* The Kalman controllability rank condition (matrix has full column rank) is the exact analogue of $\ker A^\star = \{\mathbf{0}\}$ for structural stability.

## Common Confusions
> ⚠ You might think fixing enough nodes always eliminates mechanisms — but actually fixing nodes only removes rigid motions; separate bar additions are needed to kill mechanisms that arise from geometric configuration.

## Guru's Note
Mechanisms and rigid motions both live in a kernel, but mechanisms survive after grounding — they are the structure's "hidden flaw" that extra bars must cure.