---
title: linear algebra eigenvectors
domain: linear algebra
parent-domain: mathematics
source: Linear Algebra and Its Applications, Ch. 5
prereqs: ["[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra eigendecomposition]]", "[[machine learning principal component analysis]]"]
related: ["[[linear algebra eigenvalues]]"]
---

## Definition

A nonzero vector $\mathbf{v}$ is an eigenvector of matrix $A$ if:

$$A\mathbf{v} = \lambda\mathbf{v}$$

for some scalar $\lambda$ (the corresponding eigenvalue). The vector is only scaled, never rotated.

## Intuition

When you apply a transformation $A$ to most vectors, they both scale and rotate. Eigenvectors are the special directions that only scale — they point along the "natural axes" of the transformation.

## Formal notation

The set of all eigenvectors for eigenvalue $\lambda$ (plus the zero vector) forms the eigenspace:

$$E_\lambda = \ker(A - \lambda I) = \{\mathbf{v} : A\mathbf{v} = \lambda\mathbf{v}\}$$

## Bridge to other domains

In **statistics/machine learning**, eigenvectors of the covariance matrix are the principal components in PCA — they are the directions of maximum variance in the data.

In **differential equations**, eigenvectors of the system matrix determine the modes of a linear ODE: $\dot{\mathbf{x}} = A\mathbf{x}$ has solutions $e^{\lambda t}\mathbf{v}$ where $(\lambda, \mathbf{v})$ is an eigenpair.

In **quantum mechanics**, eigenvectors of the Hamiltonian operator are stationary states. Measurement collapses the state to an eigenvector with the corresponding eigenvalue as the observed energy.

## Where it appears

PCA, spectral graph theory, Google PageRank, vibration analysis, quantum mechanics.

## Common confusions

Eigenvectors are only defined up to a scalar multiple. Normalizing them to unit length ($\|\mathbf{v}\| = 1$) is a convention, not a requirement.
