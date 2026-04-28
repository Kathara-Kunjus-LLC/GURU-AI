---
title: linear algebra matrix multiplication
domain: linear algebra
parent-domain: mathematics
source: "Linear Algebra and Its Applications, Ch. 2"
prereqs: []
builds-into: ["[[linear algebra eigenvectors]]", "[[linear algebra eigenvalues]]", "[[linear algebra singular value decomposition]]"]
related: []
---

# Linear Algebra Matrix Multiplication

## Plain English

A way to combine two matrices that corresponds to applying two linear transformations one after the other.

## Intuition

Matrix multiplication is like applying two Instagram filters in sequence — order matters because blur-then-sharpen looks different from sharpen-then-blur. $AB$ means "first apply $B$, then apply $A$." Each entry in the result is a dot product: how much the $i$-th output depends on the $j$-th input, routed through all intermediate dimensions.

## Formal Definition

> **Definition:**
> The product $C = AB$ of an $m \times n$ matrix $A$ and an $n \times p$ matrix $B$ is the $m \times p$ matrix:
> $$C_{ij} = \sum_{k=1}^n A_{ik} B_{kj}$$
>
> The inner dimension ($n$) must match. The result has the outer dimensions ($m \times p$).

## Worked Example

$$A = \begin{bmatrix}1 & 2\\3 & 4\end{bmatrix}, \quad B = \begin{bmatrix}2 & 0\\1 & 3\end{bmatrix}$$

$$C_{11} = 1\cdot2 + 2\cdot1 = 4, \quad C_{12} = 1\cdot0 + 2\cdot3 = 6$$

$$C_{21} = 3\cdot2 + 4\cdot1 = 10, \quad C_{22} = 3\cdot0 + 4\cdot3 = 12$$

$$AB = \begin{bmatrix}4 & 6\\10 & 12\end{bmatrix}$$

Note: $BA = \begin{bmatrix}2&4\\10&14\end{bmatrix} \neq AB$ — multiplication is not commutative.

## Key Properties

$$(AB)C = A(BC) \quad \text{(associative)}$$

$$A(B+C) = AB + AC \quad \text{(distributive)}$$

$$AB \neq BA \quad \text{in general (not commutative)}$$

$$(AB)^\top = B^\top A^\top$$

## Why It Works

Each column of $AB$ is $A$ applied to the corresponding column of $B$. This makes matrix multiplication exactly the composition of linear maps: if $B$ maps $\mathbb{R}^p \to \mathbb{R}^n$ and $A$ maps $\mathbb{R}^n \to \mathbb{R}^m$, then $AB$ maps $\mathbb{R}^p \to \mathbb{R}^m$, combining both transformations. The formula $C_{ij} = \sum_k A_{ik}B_{kj}$ is just the coordinate representation of this composition.

## Bridge to Other Domains

> **→ Machine Learning:** A neural network forward pass is a sequence of matrix multiplications interleaved with nonlinear activations: $\mathbf{h}^{(l)} = \sigma(W^{(l)}\mathbf{h}^{(l-1)} + \mathbf{b}^{(l)})$. The depth of the network is the number of matrix multiplications in the chain.
> *Why it matters:* Efficient matrix multiplication is literally the computational bottleneck of deep learning — GPU design is optimized around it.

> **→ Computer Graphics:** 3D transformations (rotation, scaling, translation, projection) are all $4\times 4$ matrix multiplications applied to homogeneous coordinate vectors. A full scene transformation pipeline is a product of matrices.
> *Why it matters:* Composing transformations is simply multiplying their matrices — a complete rendering pipeline is a single matrix product.

## Where It Appears

- Neural network forward and backward passes
- Coordinate transformations in graphics and robotics
- Markov chain state evolution ($\mathbf{p}_{t+1} = P\mathbf{p}_t$)
- Solving linear systems via Gaussian elimination

## Common Confusions

> ⚠ You might think **matrix multiplication is commutative** — but $AB \neq BA$ in general. The order represents the order of applying transformations, and transformations do not commute.

## Guru's Note

Matrix multiplication is function composition made concrete — always think about what transformation each matrix applies, not just the numbers.
