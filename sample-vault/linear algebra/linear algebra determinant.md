---
title: linear algebra determinant
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra row echelon form]]", "[[linear algebra partial pivoting]]", "[[linear algebra matrix rank]]"]
builds-into: ["[[linear algebra determinant product formula]]", "[[linear algebra cramer rule]]", "[[linear algebra permutation expansion determinant]]"]
related: ["[[linear algebra homogeneous system]]", "[[linear algebra solution existence and uniqueness theorem]]"]
---

# Linear Algebra Determinant

## Plain English
The determinant is a single number attached to any square matrix that tells you whether the matrix is invertible.

## Intuition
Think of the determinant as the signed volume scaling factor: it measures how much a linear transformation stretches or squishes space, and it flips sign whenever the transformation reverses orientation.

## Formal Definition
> **Definition:**
> For a square matrix $A$, the determinant $\det A$ is the unique scalar satisfying:
> 1. Adding a multiple of one row to another leaves $\det A$ unchanged.
> 2. Swapping two rows negates $\det A$.
> 3. Multiplying a row by scalar $c$ multiplies $\det A$ by $c$.
> 4. $\det U = u_{11} u_{22} \cdots u_{nn}$ for any upper triangular $U$.
>
> Where $u_{ii}$ are the diagonal entries of $U$.

## Worked Example
Compute $\det A$ for $A = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}$.

Row-reduce: subtract $2 \times$ row 1 from row 2:

$$\begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$$

No row swaps, so by axiom (iv):

$$\det A = 2 \cdot 1 = 2$$

Check with the $2 \times 2$ formula $ad - bc$: $$(2)(3) - (1)(4) = 6 - 4 = 2 \checkmark$$

## Key Properties
- $\det A \neq 0$ if and only if $A$ is nonsingular (invertible).
- $\det I = 1$.
- A matrix with any all-zero row has $\det A = 0$.

## Why It Works
The four axioms uniquely determine a function on square matrices: Gaussian Elimination reduces any matrix to upper triangular form while tracking sign changes from row swaps and scalar factors, and the product of diagonal entries of the result gives the determinant. Because LU factorization always works (up to permutation), this procedure is always well-defined.

## Bridge to Other Domains
> **→ Machine Learning:** The determinant of a covariance matrix appears in the normalizing constant of the multivariate Gaussian density, scaling the probability distribution by the square root of $\det \Sigma$.
> *Why it matters:* A near-zero determinant signals near-linear dependence among features, causing numerical instability in Gaussian models and making the density undefined.

## Common Confusions
> ⚠ You might think $\det(A + B) = \det A + \det B$ — but actually this is false because the determinant is multilinear in rows, not linear in the whole matrix; e.g., $\det \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = 4 \neq 1 + 1$.

## Guru's Note
Master the Gaussian Elimination route — it's both the fastest computation and the clearest proof of why the determinant detects singularity.