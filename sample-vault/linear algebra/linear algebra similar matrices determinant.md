---
title: linear algebra similar matrices determinant
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant product formula]]", "[[linear algebra determinant inverse formula]]"]
builds-into: []
related: ["[[linear algebra determinant]]"]
---

# Linear Algebra Similar Matrices Determinant

## Plain English
Two matrices that represent the same linear transformation in different bases always have the same determinant.

## Intuition
Changing basis is just relabeling the coordinate system — the volume scaling factor of the underlying transformation is a physical quantity independent of which coordinate frame you use to measure it.

## Formal Definition
> **Definition:** Matrices $A$ and $B$ are **similar** if $B = S^{-1}AS$ for some invertible matrix $S$. Then:
> $$\det B = \det(S^{-1}AS) = \det(S^{-1}) \cdot \det A \cdot \det S = \frac{1}{\det S} \cdot \det A \cdot \det S = \det A$$

## Worked Example
Let $A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$ and $S = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$.

$$S^{-1} = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}, \quad B = S^{-1}AS = \begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}$$

$$\det A = (3)(2)-(1)(0) = 6, \quad \det B = (3)(2) = 6 \checkmark$$

## Key Properties
- Similarity preserves determinant, trace, characteristic polynomial, and eigenvalues.
- Converse is false: equal determinants do not imply similarity.
- $\det(S^{-1}AS) = \det A$ is a one-line proof from the product formula and inverse formula.

## Why It Works
The product formula gives $\det(S^{-1}AS) = \det(S^{-1})\det(A)\det(S)$, and the inverse formula gives $\det(S^{-1}) = 1/\det S$, so the $\det S$ factors cancel exactly, leaving $\det A$.

## Bridge to Other Domains
> **→ Machine Learning:** The determinant of a covariance matrix is invariant under orthogonal change of basis — this is why principal component analysis can diagonalize the covariance matrix without changing the total data variance (which is the trace) or the generalized variance (which is the determinant).
> *Why it matters:* It guarantees that the geometry of the data distribution is preserved no matter which orthonormal frame you analyze it in.

## Guru's Note
This fact reappears constantly in eigenvalue theory — whenever you diagonalize a matrix, you are constructing a similarity transformation that leaves the determinant (and thus the product of eigenvalues) unchanged.