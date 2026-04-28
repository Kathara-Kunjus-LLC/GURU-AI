---
title: linear algebra eigenvalues
domain: linear algebra
parent-domain: mathematics
source: Linear Algebra and Its Applications, Ch. 5
prereqs: ["[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra eigendecomposition]]", "[[linear algebra singular value decomposition]]"]
related: ["[[linear algebra eigenvectors]]"]
---

## Definition

A scalar $\lambda$ is an eigenvalue of matrix $A$ if there exists a nonzero vector $\mathbf{v}$ such that $A\mathbf{v} = \lambda\mathbf{v}$.

Equivalently, $\lambda$ is an eigenvalue iff $\det(A - \lambda I) = 0$.

## Intuition

Eigenvalues tell you how much the transformation stretches or compresses along each eigenvector direction. A negative eigenvalue means the direction is flipped.

## Formal notation

The characteristic polynomial $p(\lambda) = \det(A - \lambda I)$ has degree $n$ for an $n \times n$ matrix. Its roots are the eigenvalues (possibly complex, possibly repeated).

$$\text{tr}(A) = \sum_i \lambda_i, \qquad \det(A) = \prod_i \lambda_i$$

## Bridge to other domains

In **stability analysis**, eigenvalues of the Jacobian at a fixed point determine whether the system is stable. All eigenvalues with negative real part → stable; any positive real part → unstable.

In **graph theory**, eigenvalues of the adjacency or Laplacian matrix encode structural properties: connectivity, clustering, random walk mixing time.

## Where it appears

Stability of ODEs, spectral clustering, PageRank, covariance matrix analysis, principal component variance.

## Common confusions

An $n\times n$ matrix has exactly $n$ eigenvalues counted with multiplicity (over $\mathbb{C}$), but may have fewer distinct real eigenvalues.
