---
title: linear algebra network resistivity matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network equilibrium system]]", "[[linear algebra conductance matrix]]", "[[linear algebra gram matrix positive definiteness]]"]
builds-into: ["[[linear algebra graph laplacian]]", "[[linear algebra network grounding]]"]
related: ["[[linear algebra stiffness matrix]]", "[[linear algebra reduced incidence matrix]]"]
---

# Linear Algebra Network Resistivity Matrix

## Plain English
The resistivity matrix combines the network's topology and wire conductances into a single matrix whose entries encode how strongly each pair of nodes is electrically coupled.

## Formal Definition
> **Definition:**
> For a network with incidence matrix $A \in \mathbb{R}^{m \times n}$ and conductance matrix $C = \text{diag}(c_1, \ldots, c_m) > 0$:
> $$K = A^T C A \in \mathbb{R}^{n \times n}$$
>
> Entries of $K$:
> $$k_{ii} = \sum_{k \sim i} c_k, \quad k_{ij} = -c_k \text{ (if wire } k \text{ joins } i \text{ and } j\text{)}, \quad k_{ij} = 0 \text{ otherwise}$$

## Intuition
The diagonal entry $k_{ii}$ is the total "pulling strength" at node $i$, while each off-diagonal $k_{ij}$ is the negative conductance of the direct wire between $i$ and $j$ — the matrix literally encodes who is connected to whom and how strongly.

## Worked Example
For a 4-node network with conductances $c_1, \ldots, c_5$ on wires 1–5 (wire 1 between nodes 1–2, wire 2 between 1–3, wire 3 between 1–4, wire 4 between 2–4, wire 5 between 3–4):
$$K = \begin{bmatrix} c_1+c_2+c_3 & -c_1 & -c_2 & -c_3 \\ -c_1 & c_1+c_4 & 0 & -c_4 \\ -c_2 & 0 & c_2+c_5 & -c_5 \\ -c_3 & -c_4 & -c_5 & c_3+c_4+c_5 \end{bmatrix}$$

## Key Properties
- $K$ is symmetric positive semi-definite (a Gram matrix); $\ker K = \ker A$ is spanned by $\mathbf{1} = (1,\ldots,1)^T$ for a connected network
- $K\mathbf{1} = 0$: each row sums to zero, confirming charge conservation
- $K$ becomes positive definite (and invertible) after grounding one node

## Why It Works
$K = A^T C A$ is a Gram matrix with respect to the $C$-weighted inner product, so it is always positive semi-definite by construction. The kernel is non-trivial because any uniform shift of all potentials $u \mapsto u + t\mathbf{1}$ changes nothing physically — only potential differences matter.

## Bridge to Other Domains
> **→ Graph Theory:** When $C = I$, $K = A^T A$ is the graph Laplacian $D - J$ (degree matrix minus adjacency matrix), connecting circuit analysis to spectral graph theory and random walks on graphs.
> *Why it matters:* Eigenvalues of the graph Laplacian control network connectivity, diffusion rates, and clustering — all readable from the same matrix $K$.

## Common Confusions
> ⚠ You might think **$K$ is the resistance matrix** — but actually **it encodes conductances** (reciprocal of resistance), so larger conductance means a more negative off-diagonal entry and stronger coupling.

## Guru's Note
Build $K$ directly from the pattern: diagonal = sum of conductances at that node, off-diagonal = negative conductance of the connecting wire — no matrix multiplication needed for small networks.