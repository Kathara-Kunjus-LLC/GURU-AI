---
title: linear algebra matrix form of linear system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra vector]]", "[[linear algebra matrix multiplication]]", "[[linear algebra linear system]]"]
builds-into: ["[[linear algebra gaussian elimination]]", "[[linear algebra lu decomposition]]", "[[linear algebra augmented matrix]]"]
related: ["[[linear algebra augmented matrix]]", "[[linear algebra equivalent system]]"]
---

# Matrix Form of Linear System

## Plain English
The matrix form $A\mathbf{x} = \mathbf{b}$ rewrites an entire system of linear equations as a single equation between two vectors, compressing all the equations and all the coefficients into three symbols.

## Intuition
Imagine shrinking a page full of equations into one line: the coefficient table becomes $A$, the unknowns become $\mathbf{x}$, and the right-hand sides become $\mathbf{b}$ — the multiplication $A\mathbf{x}$ reconstructs the left-hand side of every equation at once.

## Formal Definition
> **Definition:**
> A system of $m$ equations in $n$ unknowns:
> $$\sum_{j=1}^n a_{ij} x_j = b_i, \quad i = 1, \ldots, m$$
> is equivalent to the single matrix equation:
> $$A \mathbf{x} = \mathbf{b}$$
> where $A \in \mathbb{R}^{m \times n}$, $\mathbf{x} \in \mathbb{R}^n$, $\mathbf{b} \in \mathbb{R}^m$.

## Worked Example
The system $x + 2y + z = 2$, $2x + 6y + z = 7$, $x + y + 4z = 3$ becomes:
$$\begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 2 \\ 7 \\ 3 \end{bmatrix}$$
Checking row 2: $2(x) + 6(y) + 1(z) = 2x + 6y + z = 7$ ✓.

## Key Properties
- The $(i,j)$ entry of $A$ is the coefficient of $x_j$ in equation $i$; missing variables get coefficient $0$.
- The form $A\mathbf{x} = \mathbf{b}$ is why matrix multiplication is defined the way it is — it is the only definition that makes this encoding work.
- A homogeneous system has $\mathbf{b} = \mathbf{0}$; a regular coefficient matrix forces $\mathbf{x} = \mathbf{0}$ as the unique solution.

## Why It Works
Matrix-vector multiplication computes each row of $A$ dotted with $\mathbf{x}$, which is exactly the left-hand side of the corresponding equation — the non-obvious definition of matrix multiplication is justified entirely by making this encoding exact.

## Bridge to Other Domains
> **→ Machine Learning:** The prediction step of linear regression is $\hat{\mathbf{y}} = X\mathbf{w}$, which is $A\mathbf{x} = \mathbf{b}$ with the design matrix $X$ in place of $A$ and weights $\mathbf{w}$ in place of $\mathbf{x}$ — fitting the model is solving this equation approximately.
> *Why it matters:* The normal equations $(X^\top X)\mathbf{w} = X^\top \mathbf{y}$ are exactly a linear system of the form $A\mathbf{x} = \mathbf{b}$, solved by $LU$ or Cholesky decomposition in practice.

## Guru's Note
Every time you write $A\mathbf{x} = \mathbf{b}$, remind yourself that the non-commutative row-times-column multiplication rule was invented precisely so this single equation could stand in for an entire system.