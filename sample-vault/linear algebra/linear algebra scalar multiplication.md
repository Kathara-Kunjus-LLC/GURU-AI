---
title: linear algebra scalar multiplication
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]"]
builds-into: ["[[linear algebra matrix multiplication]]"]
related: ["[[linear algebra matrix addition]]"]
---

# Scalar Multiplication

## Plain English
Scalar multiplication stretches or shrinks every entry of a matrix by the same real number.

## Intuition
Multiplying a matrix by $3$ is like zooming in on every cell of a spreadsheet simultaneously — every number triples, the shape stays identical.

## Formal Definition
> **Definition:**
> Given a scalar $c \in \mathbb{R}$ and an $m \times n$ matrix $A$, the scalar multiple $B = cA$ is the $m \times n$ matrix with entries:
> $$b_{ij} = c \, a_{ij}, \quad i = 1, \ldots, m, \quad j = 1, \ldots, n$$

## Worked Example
$$3 \begin{bmatrix} 1 & -1 \\ 2 & 4 \end{bmatrix} = \begin{bmatrix} 3 \cdot 1 & 3 \cdot (-1) \\ 3 \cdot 2 & 3 \cdot 4 \end{bmatrix} = \begin{bmatrix} 3 & -3 \\ 6 & 12 \end{bmatrix}$$

## Key Properties
- $c(A + B) = cA + cB$ (distributive over matrix addition).
- $(c + d)A = cA + dA$ (distributive over scalar addition).
- $0 \cdot A = O$ (zero scalar kills the matrix).

## Why It Works
Because scalar multiplication acts independently on each entry, all distributive and associative laws reduce to the corresponding laws for real numbers applied position by position.

## Bridge to Other Domains
> **→ Machine Learning:** Multiplying a weight matrix by a learning rate $\eta$ during gradient descent is scalar multiplication — it uniformly scales every weight update without changing their relative directions.
> *Why it matters:* Choosing $\eta$ too large causes divergence; too small causes slow convergence — the geometry of the update is controlled entirely by this single scalar.

## Guru's Note
A scalar is just a number wearing a fancy name — the word exists only to distinguish it from matrices and vectors in the same equation.