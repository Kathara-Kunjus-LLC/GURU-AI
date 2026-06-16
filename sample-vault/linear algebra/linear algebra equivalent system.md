---
title: linear algebra equivalent system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra linear system]]"]
builds-into: ["[[linear algebra gaussian elimination]]"]
related: []
---

# Linear Algebra Equivalent System

## Plain English
Two linear systems are equivalent when every solution of one is also a solution of the other — they look different on paper but describe exactly the same set of answers.

## Intuition
Think of two different sets of instructions for reaching the same destination: the routes look nothing alike, but they all arrive at the same place.

## Formal Definition
> **Definition:**
> Two systems $A\mathbf{x} = \mathbf{b}$ and $A'\mathbf{x} = \mathbf{b}'$ are equivalent if
> $$\{\mathbf{x} : A\mathbf{x} = \mathbf{b}\} = \{\mathbf{x} : A'\mathbf{x} = \mathbf{b}'\}$$
> Each system can be derived from the other by a finite sequence of elementary row operations:
> $$R_j \leftarrow R_j + c\, R_i, \quad R_i \leftrightarrow R_j, \quad R_i \leftarrow c\, R_i \; (c \neq 0)$$

## Worked Example
The original system
$$x + 2y + z = 2, \quad 2x + 6y + z = 7, \quad x + y + 4z = 3$$
and the triangular system
$$x + 2y + z = 2, \quad 2y - z = 3, \quad \frac{5}{2}z = \frac{5}{2}$$
are equivalent: both have the unique solution $(x, y, z) = (-3, 2, 1)$.

## Key Properties
- Row operations are invertible, so equivalence is a symmetric relation.
- Adding a multiple of one equation to another never changes the solution set.
- Gaussian Elimination is a chain of equivalence-preserving transformations terminating at triangular form.

## Why It Works
Adding $c$ times equation $i$ to equation $j$ does not eliminate any solution: if $\mathbf{x}$ satisfies both original equations, it still satisfies the modified equation $j$ because $c \cdot 0 + 0 = 0$. The operation is also reversible (subtract $c$ times equation $i$ back), so no new solutions are introduced.

## Guru's Note
Every row operation in Gaussian Elimination is justified by this one idea — keep it in the back of your mind and you will never be confused about why the method works.