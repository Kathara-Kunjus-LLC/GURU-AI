---
title: linear algebra symmetric matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix transpose]]"]
builds-into: ["[[linear algebra ldlt factorization]]", "[[linear algebra gram matrix positive definiteness]]"]
related: ["[[linear algebra ldv factorization]]", "[[linear algebra stiffness matrix]]"]
---

# Symmetric Matrix

## Plain English
A square matrix is symmetric if it looks the same after you swap its rows and columns.

## Intuition
Think of the main diagonal as a mirror: every entry above it has an exact twin below it in the reflected position, so the matrix is its own mirror image.

## Formal Definition
> **Definition:**
> A square matrix $A$ is symmetric if
> $$A = A^T$$
>
> Equivalently, $a_{ij} = a_{ji}$ for all indices $i, j$.

## Worked Example
The general $3 \times 3$ symmetric matrix has the form:
$$A = \begin{bmatrix} a & b & c \\ b & d & e \\ c & e & f \end{bmatrix}$$

Only 6 free parameters determine all 9 entries. Check: $a_{12} = b = a_{21}$ ✓, $a_{13} = c = a_{31}$ ✓.

## Key Properties
- All diagonal matrices (including $I$) are symmetric.
- A triangular matrix is symmetric if and only if it is diagonal.
- If $A$ is any matrix, $A^T A$ and $A A^T$ are always symmetric.

## Why It Works
The condition $A = A^T$ means the matrix encodes a relationship that is mutual: the coupling from variable $i$ to variable $j$ equals the coupling from $j$ to $i$. This reciprocity arises naturally in energy-based systems (spring networks, resistor networks) where the influence of node $i$ on node $j$ must equal the influence of $j$ on $i$ by conservation laws.

## Bridge to Other Domains
> **→ Statistics:** The covariance matrix $\Sigma$ of any random vector is symmetric because $\text{Cov}(X_i, X_j) = \text{Cov}(X_j, X_i)$, and this symmetry is what guarantees real eigenvalues and orthogonal eigenvectors for PCA.
> *Why it matters:* The spectral theorem — and thus all of PCA and factor analysis — holds only because covariance matrices are symmetric.

## Guru's Note
Whenever a system has a "mutual influence" structure — springs, resistors, probabilities — the governing matrix will be symmetric, and that symmetry is your signal that an $LDL^T$ factorization (cheaper than $LDV$) is available.