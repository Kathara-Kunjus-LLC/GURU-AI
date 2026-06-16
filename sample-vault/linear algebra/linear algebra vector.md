---
title: linear algebra vector
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]"]
builds-into: ["[[linear algebra matrix multiplication]]", "[[linear algebra linear system]]"]
related: ["[[linear algebra matrix]]"]
---

# Vector

## Plain English
A vector is a single column (or row) of numbers that represents a point, a direction, or a list of unknowns in one package.

## Intuition
Picture an arrow in space: its tip's coordinates form a column vector — three numbers stacked vertically give you north–south, east–west, up–down all at once.

## Formal Definition
> **Definition:**
> A **column vector** of length $n$ is an $n \times 1$ matrix:
> $$\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{bmatrix}$$
>
> A **row vector** of length $n$ is a $1 \times n$ matrix $\mathbf{a} = \begin{bmatrix} a_1 & a_2 & \cdots & a_n \end{bmatrix}$.

## Worked Example
For the system $x + 2y + z = 2$, $2x + 6y + z = 7$, $x + y + 4z = 3$, the unknown vector and right-hand side vector are:
$$\mathbf{x} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}, \qquad \mathbf{b} = \begin{bmatrix} 2 \\ 7 \\ 3 \end{bmatrix}$$
Both are $3 \times 1$ column vectors.

## Key Properties
- "Vector" without qualification always means **column** vector.
- A $1 \times 1$ matrix is simultaneously a row vector and a column vector.
- The zero vector $\mathbf{0}$ has all entries equal to $0$.

## Why It Works
Separating the unknowns $\mathbf{x}$ and the right-hand sides $\mathbf{b}$ from the coefficient matrix $A$ lets a linear system be written as the single equation $A\mathbf{x} = \mathbf{b}$, shifting focus from individual equations to a single matrix-vector relationship.

## Bridge to Other Domains
> **→ Machine Learning:** The weight vector $\mathbf{w}$ in a linear classifier is a column vector whose dot product with a feature vector $\mathbf{x}$ produces the prediction score.
> *Why it matters:* The entire prediction pipeline $\hat{y} = \mathbf{w}^\top \mathbf{x}$ is one row-times-column vector product.

## Guru's Note
Always default to column vectors — the asymmetry between row and column is intentional and load-bearing throughout all of linear algebra.