---
title: linear algebra 2x2 determinant
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]"]
builds-into: ["[[linear algebra matrix inverse]]"]
related: ["[[linear algebra nonsingular matrix]]", "[[linear algebra singular matrix]]"]
---

# Linear Algebra 2x2 Determinant

## Plain English
The determinant of a $2 \times 2$ matrix is a single number that tells you whether the matrix is invertible and, if so, by how much it scales areas.

## Intuition
Picture the two rows of the matrix as vectors spanning a parallelogram: the determinant is the signed area of that parallelogram, which is zero exactly when the two rows point in the same direction and the matrix collapses to a line.

## Formal Definition
> **Definition:**
> $$\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc$$
>
> Where $a, d$ are the diagonal entries and $b, c$ are the off-diagonal entries. The matrix is invertible if and only if $\det A \neq 0$.

## Worked Example
For $A = \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix}$:

$$\det A = (3)(2) - (4)(1) = 6 - 4 = 2$$

Since $\det A = 2 \neq 0$, the matrix is invertible:

$$A^{-1} = \frac{1}{2}\begin{bmatrix} 2 & -4 \\ -1 & 3 \end{bmatrix} = \begin{bmatrix} 1 & -2 \\ -\frac{1}{2} & \frac{3}{2} \end{bmatrix}$$

## Key Properties
- $\det A = 0$ if and only if $A$ is singular (non-invertible).
- $\det(AB) = \det(A)\det(B)$.
- $\det(A^{-1}) = \frac{1}{\det A}$.

## Why It Works
The inverse formula for a $2 \times 2$ matrix requires dividing by $ad - bc$; when this quantity is zero, the two equations for the inverse columns become inconsistent, reflecting the geometric fact that the matrix squashes the plane to a line and no inverse transformation can restore it.

## Bridge to Other Domains
> **→ Probability:** The determinant of the covariance matrix of a multivariate normal distribution appears in the normalizing constant, and equals zero exactly when two random variables are perfectly linearly correlated — collapsing the joint distribution to a lower-dimensional space.
> *Why it matters:* Checking $\det \Sigma > 0$ is the standard diagnostic for whether a multivariate normal density is well-defined.

## Guru's Note
Memorize $ad - bc$ cold — it reappears constantly as the denominator in the $2 \times 2$ inverse formula and is the seed from which the full theory of determinants grows.