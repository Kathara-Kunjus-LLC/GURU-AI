---
title: linear algebra determinant product formula
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant]]", "[[linear algebra determinant row operation axioms]]"]
builds-into: ["[[linear algebra cramer rule]]", "[[linear algebra determinant inverse formula]]"]
related: ["[[linear algebra determinant via gaussian elimination]]"]
---

# Linear Algebra Determinant Product Formula

## Plain English
The determinant of a product of two square matrices equals the product of their individual determinants.

## Intuition
Matrix multiplication composes two linear transformations, and the determinant measures volume scaling — composing two transformations multiplies their individual scaling factors, just as stretching by factor $a$ then by factor $b$ gives total scaling $ab$.

## Formal Definition
> **Definition:** For any two $n \times n$ matrices $A$ and $B$:
> $$\det(AB) = \det A \cdot \det B$$
>
> As a corollary, if $A$ is nonsingular:
> $$\det(A^{-1}) = \frac{1}{\det A}$$

## Worked Example
Let $A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$ and $B = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$.

$$\det A = 6, \quad \det B = 2$$

$$AB = \begin{bmatrix} 2 & 2 \\ 0 & 6 \end{bmatrix}, \quad \det(AB) = (2)(6) - (2)(0) = 12$$

$$\det A \cdot \det B = 6 \cdot 2 = 12 \checkmark$$

## Key Properties
- $\det(AB) = \det(BA)$ even though $AB \neq BA$ in general, because scalar multiplication commutes.
- $\det(A^k) = (\det A)^k$ for any positive integer $k$.
- $\det(A^{-1}) = (\det A)^{-1}$ when $A$ is invertible.

## Why It Works
Every nonsingular matrix factors as a product of elementary matrices $A = E_1 E_2 \cdots E_N$. Each elementary matrix has a known determinant (either $1$, $-1$, or the scaling constant $c$) given directly by the row-operation axioms, and the product formula holds for each elementary factor. Chaining these together proves the result for all nonsingular $A$; the singular case follows because $\det(ZB) = 0 = \det Z \cdot \det B$ when $Z$ has a zero row.

## Bridge to Other Domains
> **→ Probability:** The change-of-variables formula for multivariate densities uses $|\det J|$ where $J$ is the Jacobian — and when two transformations are composed, their Jacobians multiply, so the total volume distortion is $|\det(J_1 J_2)| = |\det J_1||\det J_2|$.
> *Why it matters:* This makes computing densities under composed transformations (e.g., normalizing flows in generative models) straightforward.

## Guru's Note
The product formula is why similar matrices $B = S^{-1}AS$ always share the same determinant — a fact that will matter enormously when eigenvalues appear.