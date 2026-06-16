---
title: linear algebra determinant inverse formula
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant product formula]]", "[[linear algebra determinant]]"]
builds-into: ["[[linear algebra cramer rule]]"]
related: ["[[linear algebra solution existence and uniqueness theorem]]"]
---

# Linear Algebra Determinant Inverse Formula

## Plain English
The determinant of an inverse matrix is the reciprocal of the original matrix's determinant.

## Intuition
If a transformation scales volume by factor $d$, its inverse must undo that scaling — so it scales by $1/d$; the determinants multiply to give $\det(A) \cdot \det(A^{-1}) = \det(I) = 1$.

## Formal Definition
> **Definition:** If $A$ is a nonsingular $n \times n$ matrix, then:
> $$\det(A^{-1}) = \frac{1}{\det A}$$
>
> This follows from $\det(AA^{-1}) = \det I = 1$ and the product formula $\det(AA^{-1}) = \det A \cdot \det(A^{-1})$.

## Worked Example
Let $A = \begin{bmatrix} 3 & 1 \\ 2 & 1 \end{bmatrix}$.

$$\det A = (3)(1) - (1)(2) = 1$$

$$A^{-1} = \begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix}, \quad \det(A^{-1}) = (1)(3) - (-1)(-2) = 1 = \frac{1}{1} \checkmark$$

Now let $B = \begin{bmatrix} 2 & 0 \\ 0 & 4 \end{bmatrix}$, $\det B = 8$.

$$B^{-1} = \begin{bmatrix} 1/2 & 0 \\ 0 & 1/4 \end{bmatrix}, \quad \det(B^{-1}) = \frac{1}{2} \cdot \frac{1}{4} = \frac{1}{8} = \frac{1}{\det B} \checkmark$$

## Key Properties
- Only defined when $A$ is nonsingular ($\det A \neq 0$).
- $\det(A^{-T}) = 1/\det A$ since $\det(A^T) = \det A$.
- $\det(A^{-1}B) = \det B / \det A$.

## Why It Works
The product formula $\det(AB) = \det A \cdot \det B$ applied to $AB = I$ gives $\det A \cdot \det(A^{-1}) = 1$; dividing both sides by $\det A$ (which is nonzero for invertible $A$) yields the result immediately.

## Bridge to Other Domains
> **→ Statistics:** In the formula for the multivariate Gaussian, $\det(\Sigma^{-1}) = 1/\det(\Sigma)$ connects the precision matrix's determinant to the covariance matrix's, controlling how peaked versus spread the distribution is.
> *Why it matters:* This relationship means you can reason about either parameterization interchangeably when computing likelihoods.

## Guru's Note
This result is almost a one-liner from the product formula — once you see it, you will never forget it.