---
title: linear algebra singular matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra nonsingular matrix]]", "[[linear algebra pivoting]]", "[[linear algebra augmented matrix]]"]
builds-into: ["[[linear algebra matrix inverse]]", "[[linear algebra null space]]"]
related: ["[[linear algebra regular matrix]]", "[[linear algebra lu decomposition]]"]
---

# Linear Algebra Singular Matrix

## Plain English
A square matrix is singular if Gaussian Elimination with row swaps gets permanently stuck — at some column, both the diagonal entry and every entry below it are zero.

## Intuition
A singular matrix encodes at least one equation that is either a duplicate of another or flat-out contradicts it, so the system either has infinitely many solutions or none at all.

## Formal Definition
> **Definition:**
> A square matrix $A$ is **singular** if during Gaussian Elimination (with row interchanges) there exists a column $j$ such that $m_{kj} = 0$ for all $k \geq j$ at the point when column $j$ is being processed. The system $Ax = b$ then either has no solution or infinitely many solutions, depending on $b$.

## Worked Example
Let $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$. Subtract $2 \times$ row 1 from row 2:
$$\begin{bmatrix} 1 & 2 \\ 0 & 0 \end{bmatrix}$$

No row below has a nonzero entry in column 2 to swap in. The second pivot is missing — $A$ is singular. The system $Ax = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$ has infinitely many solutions ($x_1 + 2x_2 = 1$), while $Ax = \begin{bmatrix} 1 \\ 3 \end{bmatrix}$ has no solution.

## Key Properties
- A singular matrix cannot be reduced to upper triangular form with all nonzero diagonal entries.
- A singular matrix cannot have an inverse.
- A square matrix with an all-zero column is automatically singular.

## Why It Works
The zero column in elimination means one variable never contributes a determining equation — it can be anything (infinite solutions) or the remaining equations are contradictory (no solution). In either case, uniqueness fails, which is the defining failure of singularity.

## Bridge to Other Domains
> **→ Machine Learning:** A singular covariance matrix in a Gaussian model signals that some features are perfectly linearly dependent, which causes the model's log-likelihood to blow up and requires dimensionality reduction or regularization before fitting.
> *Why it matters:* Recognizing singularity early prevents numerical crashes and guides feature selection in high-dimensional regression and classification.

## Guru's Note
Singular matrices are the ones that make elimination grind to a halt with a zero row; when you see that happen, the matrix has no inverse and the system's behavior depends entirely on the right-hand side.