---
title: linear algebra linear system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: []
builds-into: ["[[linear algebra gaussian elimination]]", "[[linear algebra lu decomposition]]", "[[linear algebra matrix inverse]]"]
related: ["[[linear algebra determinant]]"]
---

# Linear Algebra Linear System

## Plain English
A collection of equations where every unknown appears only to the first power and no two unknowns are multiplied together, all of which must be satisfied simultaneously.

## Intuition
Each equation carves out a flat hyperplane in space, and solving the system means finding the point (or line, or plane) where all those hyperplanes intersect at once.

## Formal Definition
> **Definition:**
> A linear system of $m$ equations in $n$ unknowns $x_1, \ldots, x_n$ is
> $$\sum_{j=1}^{n} a_{ij}\, x_j = b_i, \quad i = 1, \ldots, m$$
> or in matrix form $A\mathbf{x} = \mathbf{b}$, where $A \in \mathbb{R}^{m \times n}$, $\mathbf{x} \in \mathbb{R}^n$, $\mathbf{b} \in \mathbb{R}^m$.
>
> Where $a_{ij}$ are the known coefficients, $b_i$ are the right-hand sides, and $x_j$ are the unknowns.

## Worked Example
The system
$$x + 2y + z = 2, \quad 2x + 6y + z = 7, \quad x + y + 4z = 3$$
has coefficient matrix
$$A = \begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 2 \\ 7 \\ 3 \end{bmatrix}$$
and the unique solution is $\mathbf{x} = \begin{bmatrix} -3 & 2 & 1 \end{bmatrix}^T$.

## Key Properties
- A square system ($m = n$) with nonsingular $A$ has exactly one solution.
- A general system has either no solution, exactly one solution, or infinitely many solutions — no other possibilities.
- Linearity means the solution set is an affine subspace (a shifted linear subspace).

## Why It Works
The restriction to first-power terms makes the equations compatible with superposition: if $\mathbf{x}_1$ and $\mathbf{x}_2$ are solutions to the homogeneous system, so is any linear combination. This additive structure is exactly what allows elimination and matrix factorization methods to work systematically and completely.

## Bridge to Other Domains
> **→ Differential Equations:** Discretizing a differential equation on a grid converts it into a linear system $A\mathbf{x} = \mathbf{b}$ whose size equals the number of grid points, making linear system solvers the computational engine of numerical PDE methods.
> *Why it matters:* The sparsity structure of $A$ (mostly zeros) is the key to making million-variable systems tractable.

## Guru's Note
Before you touch any algorithm, check whether $m = n$ and whether $A$ looks full rank — those two facts alone determine which of the three outcome categories ($0$, $1$, or $\infty$ solutions) is even possible.