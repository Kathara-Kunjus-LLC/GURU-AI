---
title: linear algebra graph laplacian
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network resistivity matrix]]"]
builds-into: []
related: ["[[linear algebra kirchhoff current law]]", "[[linear algebra kirchhoff voltage law]]"]
---

# Linear Algebra Graph Laplacian

## Plain English
The graph Laplacian is a matrix built from a graph's structure that generalizes the second-derivative operator to networks, with diagonal entries equal to vertex degrees and off-diagonal entries equal to $-1$ for adjacent vertices.

## Intuition
Just as the second derivative $u'' = f$ measures how a function curves at each point, the graph Laplacian measures how a function on the nodes differs from its neighbors' average — it is a discrete curvature operator.

## Formal Definition
> **Definition:**
> For a graph with $n$ vertices, the graph Laplacian is:
> $$L = D - J = A^T A$$
>
> where $D = \text{diag}(d_1, \ldots, d_n)$ is the diagonal degree matrix ($d_i$ = number of edges at vertex $i$), $J$ is the symmetric adjacency matrix ($J_{ij} = 1$ if vertices $i,j$ are connected, $0$ otherwise), and $A$ is any incidence matrix for the graph.
>
> Entries:
> $$L_{ii} = d_i, \quad L_{ij} = -1 \text{ if } i \sim j, \quad L_{ij} = 0 \text{ otherwise}$$

## Worked Example
A path graph on 3 nodes (edges 1–2 and 2–3) has degree sequence $(1, 2, 1)$ and:
$$L = D - J = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 1 \end{bmatrix} - \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix} = \begin{bmatrix} 1 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 1 \end{bmatrix}$$

## Key Properties
- $L$ is symmetric, positive semi-definite, and independent of edge orientation
- $\ker L$ is spanned by $\mathbf{1}$; the multiplicity of eigenvalue $0$ equals the number of connected components
- For a connected graph on $n$ vertices, the second smallest eigenvalue $\lambda_2 > 0$ (algebraic connectivity or Fiedler value) measures how well-connected the graph is

## Why It Works
$L = A^T A$ is a Gram matrix (hence PSD), and the constant vector $\mathbf{1}$ is always in the kernel because $A\mathbf{1} = 0$ (each row of $A$ has one $+1$ and one $-1$, summing to zero). The Laplacian is orientation-independent because $A^T A$ squares out the sign choices.

## Bridge to Other Domains
> **→ Machine Learning:** The graph Laplacian is the operator behind spectral clustering, manifold learning (Laplacian Eigenmaps), and semi-supervised learning — its eigenvectors define the smoothest functions on the graph.
> *Why it matters:* The Fiedler vector (eigenvector for $\lambda_2$) partitions the graph into two clusters with minimum cut, connecting circuit theory directly to unsupervised learning.

> **→ Numerical Methods:** For a square grid graph, $L$ coincides with the standard finite-difference discretization of $-\nabla^2$ (the negative Laplacian), making circuit analysis the prototype for all discrete PDE solvers on grids.
> *Why it matters:* Solvers designed for $L$ (Cholesky, multigrid, conjugate gradient) transfer directly to Poisson equation discretizations.

## Common Confusions
> ⚠ You might think **the graph Laplacian depends on how you orient the edges** — but actually **$L = A^T A$ is the same regardless of orientation** because squaring cancels all sign choices.

## Guru's Note
The second eigenvalue $\lambda_2$ of $L$ is the single most useful number you can extract from a graph — it tells you how hard it is to disconnect the network.