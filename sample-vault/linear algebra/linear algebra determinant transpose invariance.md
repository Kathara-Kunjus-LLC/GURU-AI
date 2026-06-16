---
title: linear algebra determinant transpose invariance
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant]]", "[[linear algebra determinant row operation axioms]]"]
builds-into: ["[[linear algebra determinant product formula]]"]
related: ["[[linear algebra determinant via gaussian elimination]]"]
---

# Linear Algebra Determinant Transpose Invariance

## Plain English
Transposing a matrix — flipping it across its diagonal — does not change its determinant.

## Intuition
The permutation expansion sums over all ways to pick one entry per row and one per column; transposing just relabels which index is "row" and which is "column," leaving the set of products and their signs unchanged.

## Formal Definition
> **Definition:** For any square matrix $A$:
> $$\det(A^T) = \det A$$
>
> As a consequence, elementary **column** operations obey the same determinant rules as elementary row operations.

## Worked Example
Let $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, so $A^T = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$.

$$\det A = (1)(4) - (2)(3) = -2$$

$$\det(A^T) = (1)(4) - (3)(2) = -2 \checkmark$$

## Key Properties
- Column operations (swap, scale, add-multiple) affect $\det$ by the same rules as row operations.
- $\det(A^{-T}) = \det(A^{-1}) = 1/\det A$.
- Symmetric matrices ($A = A^T$) trivially satisfy $\det A = \det A^T$.

## Why It Works
The permutation expansion $\det A = \sum_\pi (\text{sign}\,\pi)\, a_{\pi(1),1} \cdots a_{\pi(n),n}$ reads one entry from each column; when $A$ is transposed the entry $a_{\pi(i),i}$ becomes $a_{i,\pi(i)}$, and summing over all permutations $\pi$ gives the same set of signed products, just re-indexed.

## Bridge to Other Domains
> **→ Machine Learning:** Gram matrices $G = X^T X$ satisfy $\det G = \det(X^T)\det(X) = (\det X)^2 \geq 0$ via the product formula plus transpose invariance — explaining why Gram matrices are always positive semidefinite and why their determinant is a perfect square.
> *Why it matters:* This underpins the kernel trick: the Gram matrix of any dataset is guaranteed to be positive semidefinite, making kernel methods well-defined.

## Guru's Note
This theorem is the reason you can freely switch between row-reduction and column-reduction when computing a determinant — use whichever gives you zeros faster.