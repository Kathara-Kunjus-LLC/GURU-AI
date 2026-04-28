---
title: linear algebra eigendecomposition
domain: linear algebra
parent-domain: mathematics
source: Linear Algebra and Its Applications, Ch. 5
prereqs: ["[[linear algebra eigenvectors]]", "[[linear algebra eigenvalues]]"]
builds-into: ["[[linear algebra singular value decomposition]]", "[[machine learning principal component analysis]]"]
related: []
---

## Definition

A diagonalisable matrix $A$ can be written as:

$$A = V \Lambda V^{-1}$$

where $V$ is the matrix of eigenvectors (columns) and $\Lambda = \text{diag}(\lambda_1, \ldots, \lambda_n)$ is the diagonal matrix of eigenvalues.

## Intuition

Change basis to the eigenvector frame, apply a simple scaling, change back. Eigendecomposition reveals what a transformation does in its "natural" coordinate system.

## Formal notation

For symmetric matrices, $V$ is orthogonal ($V^{-1} = V^\top$), giving the spectral decomposition:

$$A = V \Lambda V^\top = \sum_i \lambda_i \mathbf{v}_i \mathbf{v}_i^\top$$

Each term $\lambda_i \mathbf{v}_i \mathbf{v}_i^\top$ is a rank-1 matrix — a building block.

## Bridge to other domains

In **statistics**, the eigendecomposition of the covariance matrix $\Sigma = V\Lambda V^\top$ is the theoretical foundation of PCA. The eigenvectors are principal directions; eigenvalues are variances along them.

## Where it appears

PCA, computing matrix powers efficiently ($A^k = V\Lambda^k V^{-1}$), solving linear ODEs, spectral graph analysis.

## Common confusions

Not all matrices are diagonalisable. A matrix is diagonalisable over $\mathbb{R}$ iff it has $n$ linearly independent eigenvectors, which is guaranteed for symmetric matrices but not in general.
