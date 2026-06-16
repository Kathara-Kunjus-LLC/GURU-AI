---
title: linear algebra nonsingular matrix elementary matrix factorization
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra elementary matrix]]", "[[linear algebra gauss-jordan elimination]]", "[[linear algebra nonsingular matrix]]"]
builds-into: ["[[linear algebra ldv factorization]]"]
related: ["[[linear algebra lu decomposition]]", "[[linear algebra permuted lu decomposition]]"]
---

# Linear Algebra Nonsingular Matrix Elementary Matrix Factorization

## Plain English
Every invertible matrix can be written as a product of elementary matrices — the ones that perform the basic row operations used in Gaussian elimination.

## Intuition
Gauss-Jordan converts $A$ to $I$ by a sequence of row operations; running those operations backwards converts $I$ into $A$, expressing $A$ as a chain of elementary steps.

## Formal Definition
> **Proposition 1.25:**
> If $A$ is nonsingular, there exist elementary matrices $E_1, E_2, \ldots, E_N$ such that
> $$E_N E_{N-1} \cdots E_1 A = I$$
> and therefore
> $$A = E_1^{-1} E_2^{-1} \cdots E_N^{-1}$$
> which is itself a product of elementary matrices (since each $E_i^{-1}$ is also elementary).

## Worked Example
$A = \begin{bmatrix} 0 & 1 \\ 2 & 3 \end{bmatrix}$: swap rows via $E_1 = \begin{bmatrix} 0&1\\1&0 \end{bmatrix}$, scale row 1 by $\frac{1}{2}$ via $E_2 = \begin{bmatrix} \frac{1}{2}&0\\0&1 \end{bmatrix}$, subtract $3\times$ row 1 from row 2 via $E_3 = \begin{bmatrix} 1&0\\-3&1 \end{bmatrix}$, scale row 2 by $\frac{2}{3}$ via $E_4$.

Then $E_4 E_3 E_2 E_1 A = I$, so:

$$A = E_1^{-1} E_2^{-1} E_3^{-1} E_4^{-1}$$

Each factor is an elementary matrix.

## Key Properties
- The factorization is not unique — different orderings of row operations give different products.
- All three types of elementary matrices may appear.
- The number of factors $N$ depends on the matrix but is always finite.

## Why It Works
Gauss-Jordan is guaranteed to reduce any nonsingular matrix to $I$ in finitely many row operations. Each row operation corresponds to an invertible elementary matrix, so the reduction chain $E_N \cdots E_1 A = I$ expresses $A^{-1}$ as their product, and inverting gives $A$ itself as a product of elementary matrices.

## Bridge to Other Domains
> **→ Coding:** Compiler intermediate representations decompose complex operations into atomic instructions — an exact parallel: any invertible transformation factors into primitive, individually reversible steps.
> *Why it matters:* The principle that complex invertible operations are products of simpler ones underlies both algebraic factorization and instruction-level optimization.

## Guru's Note
This result is more profound than it looks: it says invertibility and row-operability are exactly the same thing, linking the algorithmic and structural views of matrices.