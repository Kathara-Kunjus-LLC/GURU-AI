---
title: linear algebra matrix factorization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra lu decomposition]]"]
builds-into: []
related: ["[[linear algebra gaussian elimination]]", "[[linear algebra matrix inverse]]"]
---

# Linear Algebra Matrix Factorization

## Plain English
Writing a matrix as a product of simpler, more structured matrices so that computations with it become easier or more revealing.

## Intuition
Just as factoring the integer $12 = 4 \times 3$ splits a number into manageable pieces, factoring a matrix $A = LU$ or $A = QR$ splits it into matrices whose triangular or orthogonal structure makes solving systems and understanding geometry far cheaper.

## Formal Definition
> **Definition:**
> A matrix factorization of $A \in \mathbb{R}^{m \times n}$ is an expression:
> $$A = F_1 F_2 \cdots F_k$$
>
> Where each factor $F_i$ has a special structure (triangular, orthogonal, diagonal, etc.) chosen so that operations involving $A$ — such as solving $A\mathbf{x} = \mathbf{b}$, computing $\det(A)$, or finding eigenvalues — can be performed by cheaper or more stable operations on the factors.

## Worked Example
For the $2 \times 2$ matrix $A = \begin{bmatrix} 4 & 3 \\ 6 & 3 \end{bmatrix}$, the $LU$ factorization gives:
$$L = \begin{bmatrix} 1 & 0 \\ \tfrac{3}{2} & 1 \end{bmatrix}, \quad U = \begin{bmatrix} 4 & 3 \\ 0 & -\tfrac{3}{2} \end{bmatrix}$$

So $A = LU$, and $\det(A) = \det(L)\det(U) = 1 \cdot (-6) = -6$ — read off immediately from $U$'s diagonal.

## Key Properties
- Different factorizations serve different purposes: $LU$ for solving systems, $QR$ for least squares, eigendecomposition for dynamics.
- The factorization approach is almost always more efficient and stable than forming $A^{-1}$ explicitly.
- Most factorizations cost $O(n^3)$ to compute but reduce subsequent operations to $O(n^2)$.

## Why It Works
Structured matrices (triangular, orthogonal, diagonal) interact with vectors through simple, fast operations — forward/back substitution, inner products — so splitting $A$ into such factors converts one hard problem into several easy ones.

## Bridge to Other Domains
> **→ Data Science:** Matrix factorizations like SVD and NMF decompose data matrices into interpretable low-rank structures, enabling dimensionality reduction, recommendation systems, and topic modeling.
> *Why it matters:* The same algebraic idea — replace one hard matrix with a product of structured ones — underlies both numerical linear algebra and modern data analysis.

## Guru's Note
Whenever you are handed a matrix problem, ask "what factorization turns this hard matrix into easy ones?" — that question drives most of applied linear algebra.