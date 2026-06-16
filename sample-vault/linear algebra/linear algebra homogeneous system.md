---
title: linear algebra homogeneous system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix rank]]", "[[linear algebra basic and free variables]]", "[[linear algebra solution existence and uniqueness theorem]]"]
builds-into: []
related: ["[[linear algebra truss mechanism]]", "[[linear algebra truss rigid motion kernel]]", "[[linear algebra statically determinate system]]"]
---

# Linear Algebra Homogeneous System

## Plain English
A homogeneous linear system is one where every right-hand side equals zero, so the question is not whether a solution exists but how many solutions there are beyond the obvious all-zeros answer.

## Intuition
The zero vector always satisfies $Ax = 0$, so the real question is whether the solution set is just a single point at the origin or an entire subspace of lines and planes through the origin.

## Formal Definition
> **Definition:**
> A **homogeneous system** has the form
> $$A\mathbf{x} = \mathbf{0}$$
> where $\mathbf{0}$ is the zero vector.
>
> **Theorem 1.47:** $A\mathbf{x} = \mathbf{0}$ has a nontrivial solution $\mathbf{x} \neq \mathbf{0}$ if and only if $\operatorname{rank} A = r < n$.
>
> Special cases:
> - If $m < n$: always has a nontrivial solution (more unknowns than equations).
> - If $m = n$: has a nontrivial solution $\Leftrightarrow$ $A$ is singular.

## Worked Example
Solve the homogeneous system with coefficient matrix

$$A = \begin{bmatrix} 2 & 1 & 0 & 5 \\ 4 & 2 & -1 & 8 \\ -2 & -1 & 3 & -4 \end{bmatrix}$$

Three equations, four unknowns $\Rightarrow$ nontrivial solutions guaranteed.

Row-reduce $A$:

$$\begin{bmatrix} 2 & 1 & 0 & 5 \\ 0 & 0 & -1 & -2 \\ 0 & 0 & 0 & -5 \end{bmatrix}$$

Wait — three pivots, $r = 3$, so $n - r = 4 - 3 = 1$ free variable: $x_2$.

Back-substitute from row 3: $x_4 = 0$. Row 2: $x_3 = 0$. Row 1: $x_1 = -\frac{1}{2}t$.

General solution: $x_1 = -\frac{1}{2}t,\ x_2 = t,\ x_3 = 0,\ x_4 = 0$.

## Key Properties
1. Always compatible: $\mathbf{x} = \mathbf{0}$ is always a solution (the **trivial solution**).
2. The solution set is a linear subspace (the **null space** of $A$) of dimension $n - r$.
3. Homogeneous back-substitution can skip the augmented column — it stays zero throughout.

## Why It Works
Because the zero vector always satisfies $A \cdot \mathbf{0} = \mathbf{0}$, there is no compatibility issue; the only question is dimension. Each free variable introduces exactly one linearly independent direction in the null space, so the null space has dimension exactly $n - r$.

## Bridge to Other Domains
> **→ Linear Algebra (structural mechanics):** The null space of the incidence matrix $A$ in a truss or spring system is exactly the set of displacements that produce zero elongation — the **mechanisms** and **rigid motions** — as established in the truss stability theorem.
> *Why it matters:* A structure collapses if and only if its homogeneous system has a nontrivial solution, so checking $r = n$ is the algebraic stability test.

## Common Confusions
> ⚠ You might think **a homogeneous system with $m > n$ must have only the trivial solution** — but actually **it can have infinitely many solutions** if the rows are linearly dependent and rank $r < n$, as Example 1.49 shows.

## Guru's Note
For any homogeneous system, compute $n - r$ immediately — that single number tells you the dimension of the entire solution family without doing any back-substitution.