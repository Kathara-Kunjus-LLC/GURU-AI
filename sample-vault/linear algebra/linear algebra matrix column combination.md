---
title: linear algebra matrix column combination
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix multiplication]]", "[[linear algebra vector]]"]
builds-into: ["[[linear algebra linear system]]"]
related: ["[[linear algebra matrix form of linear system]]", "[[linear algebra matrix multiplication]]"]
---

# Matrix Column Combination

## Plain English
Multiplying a matrix $A$ by a vector $\mathbf{x}$ produces a linear combination of the columns of $A$, with the entries of $\mathbf{x}$ as the coefficients.

## Intuition
Instead of thinking row-by-row, think column-by-column: $A\mathbf{x}$ says "take $x_1$ copies of column 1, $x_2$ copies of column 2, and so on, then add them all up" — the result is a single blended column.

## Formal Definition
> **Definition:**
> If $A = \begin{bmatrix} \mathbf{c}_1 & \mathbf{c}_2 & \cdots & \mathbf{c}_n \end{bmatrix}$ with columns $\mathbf{c}_j \in \mathbb{R}^m$ and $\mathbf{x} \in \mathbb{R}^n$, then:
> $$A\mathbf{x} = x_1 \mathbf{c}_1 + x_2 \mathbf{c}_2 + \cdots + x_n \mathbf{c}_n = \sum_{j=1}^n x_j \mathbf{c}_j$$

## Worked Example
$$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 5 \\ -1 \end{bmatrix} = 5 \begin{bmatrix} 1 \\ 3 \end{bmatrix} + (-1) \begin{bmatrix} 2 \\ 4 \end{bmatrix} = \begin{bmatrix} 5 \\ 15 \end{bmatrix} + \begin{bmatrix} -2 \\ -4 \end{bmatrix} = \begin{bmatrix} 3 \\ 11 \end{bmatrix}$$

## Key Properties
- The column view and the row-dot-product view of $A\mathbf{x}$ always give the same answer.
- The system $A\mathbf{x} = \mathbf{b}$ is solvable iff $\mathbf{b}$ lies in the span of the columns of $A$.
- The columns of $AB$ are $A$ times the columns of $B$: $AB = \begin{bmatrix} A\mathbf{b}_1 & \cdots & A\mathbf{b}_p \end{bmatrix}$.

## Why It Works
Matrix-vector multiplication is linear in $\mathbf{x}$, so by linearity it equals the sum of the results of multiplying $A$ by each coordinate vector $x_j \mathbf{e}_j$ — and $A\mathbf{e}_j$ is exactly the $j$-th column of $A$.

## Bridge to Other Domains
> **→ Machine Learning:** The hidden-layer computation $\mathbf{h} = W\mathbf{x}$ in a neural network is a linear combination of the columns of the weight matrix $W$ — each neuron in $\mathbf{h}$ is a dot product (row view), but the entire output is a column combination (column view) that sits in the column space of $W$.
> *Why it matters:* The rank of $W$ limits the dimension of the representable outputs, explaining why low-rank weight matrices bottleneck model capacity.

## Guru's Note
Switching from the row view to the column view of matrix multiplication is the single conceptual move that makes column spaces, null spaces, and linear combinations feel unified rather than separate.