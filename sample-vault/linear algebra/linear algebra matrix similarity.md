---
title: linear algebra matrix similarity
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra nonsingular matrix]]"]
builds-into: []
related: ["[[linear algebra matrix trace]]"]
---

# Linear Algebra Matrix Similarity

## Plain English
Two matrices are similar if one can be obtained from the other by changing the basis — multiplying by an invertible matrix on one side and its inverse on the other.

## Intuition
Similarity says $A$ and $B$ represent the same linear transformation, just described in different coordinate systems; switching coordinates via $S$ converts one description into the other.

## Formal Definition
> **Definition:**
> Matrices $A$ and $B$ are **similar**, written $A \sim B$, if there exists an invertible matrix $S$ such that
> $$B = S^{-1} A S$$
>
> Similarity is an equivalence relation: it is reflexive ($A \sim A$), symmetric, and transitive.

## Worked Example
Let $A = \begin{bmatrix} 4 & 1 \\ 0 & 2 \end{bmatrix}$ and $S = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ with $S^{-1} = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}$.

$$B = S^{-1}AS = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 4 & 1 \\ 0 & 2 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 4 & 3 \\ 0 & 2 \end{bmatrix}$$

$A \sim B$: they share eigenvalues $4$ and $2$ (invariant under similarity).

## Key Properties
- Similar matrices have identical eigenvalues, determinants, and traces.
- Similarity is an equivalence relation (reflexive, symmetric, transitive).
- Diagonalization ($A \sim D$ for diagonal $D$) is the most important special case.

## Why It Works
The invertible matrix $S$ encodes a change of basis: $S^{-1}AS$ applies $A$ in one coordinate system ($S$), performs the transformation, then returns to the original coordinates ($S^{-1}$). Any quantity that doesn't depend on the choice of basis — like eigenvalues — is preserved.

## Bridge to Other Domains
> **→ Machine Learning:** Principal Component Analysis diagonalizes the covariance matrix via a similarity transformation $S^{-1}\Sigma S = \Lambda$, where $S$ is the matrix of eigenvectors and $\Lambda$ is diagonal — directly applying the equivalence between similar matrices to find an uncorrelated coordinate system.
> *Why it matters:* The invariance of eigenvalues under similarity is exactly why PCA extracts meaningful variance directions regardless of the original coordinate representation.

## Guru's Note
Similarity is the key concept unlocking eigendecomposition — once you see that diagonalization is just a special similarity transformation, the entire spectral theory of matrices clicks into place.