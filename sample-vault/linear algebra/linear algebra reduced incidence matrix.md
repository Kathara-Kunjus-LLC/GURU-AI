---
title: linear algebra reduced incidence matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: []
builds-into: ["[[linear algebra stiffness matrix]]", "[[linear algebra mass-spring chain]]"]
related: []
---

# Linear Algebra Reduced Incidence Matrix

## Plain English
A matrix that encodes which masses each spring connects, including the fixed boundary supports, so that spring elongations can be computed from mass displacements by a single matrix multiply.

## Intuition
Label each spring as a row and each mass as a column; put $+1$ where the spring pulls up on a mass and $-1$ where it pulls down — the matrix then automatically computes how much each spring stretches when you shift the masses.

## Formal Definition
> **Definition:**
> $$e = Au, \quad A \in \mathbb{R}^{(n+1)\times n}$$
>
> Where $e_j$ is the elongation of spring $j$, $u_i$ is the displacement of mass $i$, and the entries of $A$ satisfy:
> $$a_{j,j} = 1, \quad a_{j,j-1} = -1 \text{ (internal springs)}, \quad e_1 = u_1, \quad e_{n+1} = -u_n$$

## Worked Example
Three masses, four springs, both ends fixed. The matrix $A$ is $4 \times 3$:
$$A = \begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \\ 0 & 0 & -1 \end{bmatrix}$$

Displacement $u = (2, 1, 1)^T$ gives elongations:
$$e = Au = \begin{bmatrix} 2 \\ -1 \\ 0 \\ -1 \end{bmatrix}$$

Top spring stretches, second and fourth compress, third is unchanged.

## Key Properties
- Columns of $A$ are always linearly independent for a chain with at least one fixed end
- The transpose $A^T$ is the force-balance coefficient matrix — geometry and statics share the same matrix
- Changing boundary conditions (one vs. two fixed ends) changes only specific rows of $A$

## Why It Works
Each row of $A$ implements a finite difference: $e_j = u_j - u_{j-1}$ measures relative displacement, which is exactly what determines stretch. Fixed supports contribute rows with a single $\pm 1$ because one endpoint of that spring cannot move.

## Bridge to Other Domains
> **→ Signal Processing:** The reduced incidence matrix is a discrete first-difference operator; its transpose is a discrete divergence, and together they form the discrete gradient–divergence pair underlying finite difference schemes.
> *Why it matters:* This is why the same tridiagonal $K = A^T A$ structure appears in both spring networks and 1-D heat conduction discretizations.

## Guru's Note
Once you see that $A$ is just a signed finite-difference matrix, its role in building the symmetric positive definite $K = A^T C A$ feels completely natural rather than mysterious.