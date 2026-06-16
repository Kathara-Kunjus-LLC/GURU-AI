---
title: linear algebra matrix multiplication
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra vector]]"]
builds-into: ["[[linear algebra linear system]]", "[[linear algebra lu decomposition]]", "[[linear algebra elementary matrix]]"]
related: ["[[linear algebra matrix addition]]", "[[linear algebra identity matrix]]"]
---

# Matrix Multiplication

## Plain English
Matrix multiplication combines two matrices by taking dot products of every row of the first with every column of the second to produce a new matrix.

## Intuition
Each output entry answers: "how much does row $i$ of $A$ overlap with column $j$ of $B$?" — a simultaneous compression and combination of two transformations into one.

## Formal Definition
> **Definition:**
> If $A$ is $m \times n$ and $B$ is $n \times p$, their product $C = AB$ is the $m \times p$ matrix with entries:
> $$c_{ij} = \sum_{k=1}^{n} a_{ik} \, b_{kj}$$
>
> Equivalently, the $j$-th column of $C$ is $A \mathbf{b}_j$, where $\mathbf{b}_j$ is the $j$-th column of $B$.

## Worked Example
$$\begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} x + 2y + z \\ 2x + 6y + z \\ x + y + 4z \end{bmatrix}$$
Each row of $A$ dots with the single column of $\mathbf{x}$ to reproduce the left-hand side of each equation.

## Key Properties
- **Not commutative:** $AB \neq BA$ in general; $BA$ may not even be defined.
- **Associative:** $(AB)C = A(BC)$ whenever sizes permit.
- **Size constraint:** $A$ is $m \times n$, $B$ must be $n \times p$ — the inner dimensions must match.

## Why It Works
The row-times-column rule is the unique definition that makes $A\mathbf{x} = \mathbf{b}$ encode a system of linear equations exactly — any other entry-wise product would destroy this correspondence.

## Bridge to Other Domains
> **→ Machine Learning:** Each layer of a neural network applies a matrix multiplication $\mathbf{h} = W\mathbf{x}$ followed by a nonlinearity — the entire forward pass is a chain of matrix products.
> *Why it matters:* Backpropagation is exactly the chain rule applied to these matrix products, so understanding non-commutativity prevents catastrophic gradient errors.

## Common Confusions
> ⚠ You might think matrix multiplication works entry-wise like addition — but actually $c_{ij} = \sum_k a_{ik} b_{kj}$ because the operation encodes function composition, not pointwise scaling.

## Guru's Note
Non-commutativity is not a quirk to memorize — it is the feature that makes matrix multiplication powerful enough to represent compositions of transformations.