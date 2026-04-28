---
title: linear algebra matrix multiplication
domain: linear algebra
parent-domain: mathematics
source: Linear Algebra and Its Applications, Ch. 2
prereqs: []
builds-into: ["[[linear algebra eigenvectors]]", "[[linear algebra eigenvalues]]", "[[linear algebra singular value decomposition]]"]
related: []
---

## Definition

The product $C = AB$ of an $m \times n$ matrix $A$ and an $n \times p$ matrix $B$ is the $m \times p$ matrix with entries:

$$C_{ij} = \sum_{k=1}^n A_{ik} B_{kj}$$

## Intuition

Matrix multiplication composes linear transformations. If $A$ rotates and $B$ scales, then $AB$ first scales then rotates.

## Formal notation

Matrix multiplication is associative $(AB)C = A(BC)$ and distributive $A(B+C) = AB + AC$ but not commutative: $AB \neq BA$ in general.

## Bridge to other domains

In **machine learning**, a neural network forward pass is a sequence of matrix multiplications (with nonlinear activations interleaved). The expressiveness of deep networks stems from composing many such transformations.

In **computer graphics**, 3D transformations (rotation, translation, projection) are all represented as matrix multiplications applied to homogeneous coordinate vectors.

## Where it appears

Neural networks, coordinate transformations, Markov chains (transition matrix powers), solving systems of equations.

## Common confusions

The number of columns of $A$ must equal the number of rows of $B$. The result shape is (rows of $A$) × (columns of $B$).
