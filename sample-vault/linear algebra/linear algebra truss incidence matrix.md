---
title: linear algebra truss incidence matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss bar elongation linear approximation]]", "[[linear algebra electrical network graph model]]"]
builds-into: ["[[linear algebra truss stiffness matrix]]", "[[linear algebra truss stability theorem]]"]
related: ["[[linear algebra discrete gradient divergence duality]]", "[[linear algebra graph laplacian]]"]
---

# Truss Incidence Matrix

## Plain English
The incidence matrix of a truss is a rectangular array that encodes, for each bar, how much each node's displacement contributes to that bar's elongation.

## Intuition
Think of it as a table where each row is a bar and each column pair is a node: the entries are the signed unit-vector components showing which way each node pulls or pushes on that bar. It is a higher-dimensional cousin of the signed incidence matrix of a directed graph.

## Formal Definition
> **Definition:**
> For a structure with $m$ bars and $n$ nodes in $\mathbb{R}^d$, the incidence matrix $A \in \mathbb{R}^{m \times dn}$ satisfies
> $$\mathbf{e} = A\mathbf{u}$$
>
> Where $\mathbf{e} \in \mathbb{R}^m$ is the vector of bar elongations, $\mathbf{u} \in \mathbb{R}^{dn}$ is the stacked nodal displacement vector, and the $k$-th row has $\mathbf{n}_k^T$ in the $d$ slots for node $i$ and $-\mathbf{n}_k^T$ in the $d$ slots for node $j$ (zeros elsewhere), with $\mathbf{n}_k = (\mathbf{a}_i - \mathbf{a}_j)/\|\mathbf{a}_i - \mathbf{a}_j\|$.

## Worked Example
Two nodes in $\mathbb{R}^2$: $\mathbf{a}_1 = (0,0)^T$, $\mathbf{a}_2 = (1,1)^T$. The single bar has unit vector

$$\mathbf{n}_1 = \frac{\mathbf{a}_1 - \mathbf{a}_2}{\|\mathbf{a}_1 - \mathbf{a}_2\|} = \left(-\tfrac{1}{\sqrt{2}}, -\tfrac{1}{\sqrt{2}}\right)^T$$

The incidence matrix is the $1 \times 4$ row:

$$A = \begin{bmatrix} -\tfrac{1}{\sqrt{2}} & -\tfrac{1}{\sqrt{2}} & \tfrac{1}{\sqrt{2}} & \tfrac{1}{\sqrt{2}} \end{bmatrix}$$

For displacements $\mathbf{u}_1 = (1,0)^T$, $\mathbf{u}_2 = (0,0)^T$:

$$e = A\mathbf{u} = -\tfrac{1}{\sqrt{2}} \cdot 1 + (-\tfrac{1}{\sqrt{2}}) \cdot 0 + \tfrac{1}{\sqrt{2}} \cdot 0 + \tfrac{1}{\sqrt{2}} \cdot 0 = -\tfrac{1}{\sqrt{2}}$$

## Key Properties
- $A$ depends only on bar directions, not bar lengths — exactly as the graph incidence matrix depends only on connectivity, not wire lengths.
- $\ker A$ contains all rigid-body motions (translations and linearized rotations).
- Fixing nodes amounts to deleting the corresponding column groups, yielding the reduced incidence matrix $A^\star$.

## Why It Works
Each bar's elongation is a linear function of nodal displacements (after linearization), so all $m$ elongation equations assemble naturally into one matrix equation $\mathbf{e} = A\mathbf{u}$. The row structure directly mirrors the linearized elongation formula $e_k = \mathbf{n}_k \cdot \mathbf{u}_i - \mathbf{n}_k \cdot \mathbf{u}_j$, placing $\mathbf{n}_k^T$ and $-\mathbf{n}_k^T$ in the correct column slots.

## Bridge to Other Domains
> **→ Linear Algebra (Graph Theory):** The truss incidence matrix is a $d$-dimensional generalization of the signed node-edge incidence matrix of a directed graph, with unit vectors replacing $\pm 1$ entries.
> *Why it matters:* Results about graph Laplacians and network equilibrium transfer directly to structural analysis, unifying circuit theory and structural mechanics.

## Guru's Note
Build the matrix one row at a time: for each bar, write the unit vector in the columns of its "head" node and the negative unit vector in the columns of its "tail" node.