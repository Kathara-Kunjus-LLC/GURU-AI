---
title: linear algebra stiffness matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra reduced incidence matrix]]", "[[linear algebra hooke law]]"]
builds-into: ["[[linear algebra equilibrium potential energy]]"]
related: ["[[linear algebra mass-spring chain]]"]
---

# Linear Algebra Stiffness Matrix

## Plain English
The matrix $K = A^T C A$ that converts mass displacements directly into the forces needed to hold the system in equilibrium.

## Intuition
It collapses the three-step pipeline — stretch geometry, spring law, force balance — into one matrix so you can solve for all displacements at once, much like a single transfer function summarizes a whole chain of operations.

## Formal Definition
> **Definition:**
> $$K = A^T C A, \quad K \in \mathbb{R}^{n \times n}$$
>
> Where $A$ is the $(n+1) \times n$ reduced incidence matrix, $C = \operatorname{diag}(c_1, \ldots, c_{n+1}) > 0$ is the spring stiffness matrix, and the equilibrium system is $Ku = f$.

## Worked Example
Two masses, three unit springs, both ends fixed. $A$ is $3 \times 2$, $C = I_3$:
$$A = \begin{bmatrix} 1 & 0 \\ -1 & 1 \\ 0 & -1 \end{bmatrix}, \quad K = A^T A = \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}$$

Apply $f = (1, 0)^T$:
$$u = K^{-1}f = \frac{1}{3}\begin{bmatrix} 2 \\ 1 \end{bmatrix}$$

Both masses shift down, top mass more so.

## Key Properties
- $K$ is symmetric: $K = K^T$ because $(A^T C A)^T = A^T C^T A = A^T C A$
- $K$ is positive definite when $A$ has linearly independent columns and $C > 0$, guaranteeing a unique equilibrium
- $K$ has symmetric tridiagonal structure for a chain, enabling $O(n)$ solution

## Why It Works
$K$ is a Gram matrix for the $C$-weighted inner product $\langle v, w \rangle = v^T C w$. Positive definiteness follows because $u^T K u = (Au)^T C (Au) = \|Au\|_C^2 > 0$ for all $u \neq 0$ whenever $Au \neq 0$, which is guaranteed by the linear independence of $A$'s columns.

## Bridge to Other Domains
> **→ Numerical Methods:** The stiffness matrix is the central object in the finite element method; assembling $K$ from element contributions and solving $Ku = f$ is the entire computational skeleton of FEM for structural analysis.
> *Why it matters:* Understanding that $K = A^T C A$ is always positive definite justifies using Cholesky factorization (half the cost of LU) in FEM solvers.

## Common Confusions
> ⚠ You might think constructing $K = A^T C A$ and then factoring $K = LDL^T$ are connected steps — but $L$ and $D$ typically have different sizes than $A$ and $C$, so there is no shortcut from one factorization to the other.

## Guru's Note
The symmetric tridiagonal structure of $K$ for a chain is not an accident to exploit — it is the direct consequence of each spring coupling only nearest neighbors, and it reappears in every discretization of a 1-D differential operator.