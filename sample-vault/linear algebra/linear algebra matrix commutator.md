---
title: linear algebra matrix commutator
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix multiplication]]", "[[linear algebra matrix commutativity failure]]"]
builds-into: []
related: ["[[linear algebra matrix commutativity failure]]", "[[linear algebra matrix trace]]"]
---

# Matrix Commutator

## Plain English
The commutator of two matrices is the difference between their products in the two possible orders, measuring exactly how much and in what direction the two matrices fail to commute.

## Intuition
The commutator $[A, B] = AB - BA$ is the "leftover" after you try to swap $A$ and $B$: if it is zero, swapping is free; if it is nonzero, the matrix records exactly what you pay for swapping.

## Formal Definition
> **Definition:**
> For $n \times n$ matrices $A$ and $B$, the **commutator** is:
> $$[A, B] = AB - BA$$
>
> Properties: bilinear, skew-symmetric ($[A,B] = -[B,A]$), and satisfying the Jacobi identity:
> $$[[A,B],C] + [[C,A],B] + [[B,C],A] = O$$

## Worked Example
$$A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, \quad B = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$$
$$AB = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}, \quad BA = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$
$$[A,B] = AB - BA = \begin{bmatrix} 0 & -1 \\ 0 & 0 \end{bmatrix} \neq O$$

## Key Properties
- $[A,B] = O$ iff $A$ and $B$ commute.
- $\text{tr}([A,B]) = 0$ always — the commutator has zero trace.
- The Jacobi identity makes $n \times n$ matrices with the commutator bracket into a **Lie algebra**.

## Why It Works
The commutator is bilinear in both arguments and antisymmetric, so it behaves like a "cross product" for matrices — capturing the noncommutativity of matrix multiplication in a single object that can be analyzed and manipulated algebraically.

## Bridge to Other Domains
> **→ Signal Processing / Quantum Mechanics:** The Heisenberg uncertainty principle is a consequence of the nonzero commutator $[X, P] = i\hbar I$ between position and momentum operators — these operators are infinite-dimensional matrices, and their commutator is the algebraic source of the uncertainty principle.
> *Why it matters:* Non-commutativity of observables is not a physical quirk but an algebraic fact about the matrices representing them.

## Guru's Note
If you encounter the Jacobi identity again in Lie groups, differential geometry, or quantum field theory, recognize it immediately — this is the same algebraic structure you first saw for matrices here.