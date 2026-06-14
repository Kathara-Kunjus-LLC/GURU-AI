---
title: linear algebra truss rigid motion kernel
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss incidence matrix]]"]
builds-into: ["[[linear algebra truss stability theorem]]", "[[linear algebra truss mechanism]]"]
related: ["[[linear algebra network voltage potential ambiguity]]", "[[linear algebra network grounding]]"]
---

# Truss Rigid Motion Kernel

## Plain English
The kernel of a truss's incidence matrix consists of all displacement patterns that move the structure as a rigid body — translations and (linearized) rotations — without stretching any bar.

## Intuition
Picking up a triangular steel frame and sliding it across the floor is a rigid translation; spinning it in place is a rigid rotation. Either way, no bar changes length, so both motions live in $\ker A$.

## Formal Definition
> **Definition:**
> A displacement vector $\mathbf{u} \in \mathbb{R}^{dn}$ is a rigid motion of a $d$-dimensional structure if and only if
> $$A\mathbf{u} = \mathbf{0}$$
>
> A free (ungrounded) planar structure ($d = 2$) has $\dim(\ker A) = 3$ (2 translations + 1 linearized rotation); a free spatial structure ($d = 3$) has $\dim(\ker A) = 6$ (3 translations + 3 linearized rotations).

## Worked Example
For the equilateral triangle with nodes at $\mathbf{a}_1 = (\frac{1}{2}, \frac{\sqrt{3}}{2})^T$, $\mathbf{a}_2 = (1,0)^T$, $\mathbf{a}_3 = (0,0)^T$, the kernel basis vectors are:

$$\mathbf{z}_1 = (1,0,1,0,1,0)^T \quad \text{(horizontal translation)}$$
$$\mathbf{z}_2 = (0,1,0,1,0,1)^T \quad \text{(vertical translation)}$$
$$\mathbf{z}_3 \approx (-\tfrac{\sqrt{3}}{2}, \tfrac{1}{2}, 0, 1, 0, 0)^T \quad \text{(linearized rotation)}$$

Check: $A\mathbf{z}_1 = \mathbf{0}$ because translating all nodes equally changes no bar length.

## Key Properties
- Translations appear as kernel vectors where all $d$-blocks equal the same unit coordinate vector $\mathbf{e}_i$.
- Linearized rotations are tangent vectors to the circular node paths; the actual circular motion lies outside the kernel.
- Grounding one node removes 2 translational modes (planar) or 3 (spatial); a second non-coincident fixed node removes the remaining rotational mode.

## Why It Works
A rigid displacement changes no inter-node distances to first order, so all elongations $e_k = \mathbf{n}_k \cdot (\mathbf{u}_i - \mathbf{u}_j) = 0$. The kernel therefore encodes geometric degrees of freedom that $A$ is blind to, precisely because $A$ was built from the same linearization that makes rotations appear as straight-line motions.

## Bridge to Other Domains
> **→ Linear Algebra (Electrical Networks):** The kernel of the electrical network incidence matrix consists of uniform potential shifts (adding a constant to all node potentials); the truss analogue is uniform translation — both are "gauge freedoms" removed by grounding.
> *Why it matters:* Grounding a structural node and grounding a circuit node are mathematically identical operations that collapse the kernel to $\{\mathbf{0}\}$.

## Common Confusions
> ⚠ You might think linearized rotations are exact rotations — but actually the kernel contains only the *tangent directions* to circular arcs; the true nonlinear rotation stays outside $\ker A$, which is why the linear model can overestimate stability.

## Guru's Note
Count $\dim(\ker A)$ before you do anything else: 3 for a free planar truss, 6 for a free spatial one — if you get more, you have mechanisms too.