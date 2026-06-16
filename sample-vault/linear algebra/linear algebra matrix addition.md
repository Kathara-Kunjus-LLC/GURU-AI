---
title: linear algebra matrix addition
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]"]
builds-into: ["[[linear algebra matrix multiplication]]", "[[linear algebra scalar multiplication]]"]
related: ["[[linear algebra scalar multiplication]]"]
---

# Matrix Addition

## Plain English
Matrix addition combines two same-size matrices by adding their corresponding entries one by one.

## Intuition
Like adding two identically formatted spreadsheets cell by cell — you can only do it when the sheets have the same number of rows and columns.

## Formal Definition
> **Definition:**
> If $A$ and $B$ are both $m \times n$ matrices, their sum $C = A + B$ is the $m \times n$ matrix with entries:
> $$c_{ij} = a_{ij} + b_{ij}, \quad i = 1, \ldots, m, \quad j = 1, \ldots, n$$

## Worked Example
$$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} + \begin{bmatrix} 5 & -1 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1+5 & 2+(-1) \\ 3+0 & 4+2 \end{bmatrix} = \begin{bmatrix} 6 & 1 \\ 3 & 6 \end{bmatrix}$$

## Key Properties
- **Commutativity:** $A + B = B + A$.
- **Associativity:** $(A + B) + C = A + (B + C)$.
- **Zero matrix:** $A + O = A$, where $O$ is the $m \times n$ zero matrix.

## Why It Works
Entry-wise addition is the only natural way to combine two grids of the same shape; it inherits commutativity and associativity directly from addition of real numbers at each position.

## Bridge to Other Domains
> **→ Signal Processing:** Superimposing two discrete signals is exactly entry-wise vector addition — the combined signal's value at each time step is the sum of the two individual values.
> *Why it matters:* Linearity of superposition is what makes Fourier analysis possible.

## Guru's Note
Matrix addition is the easy one — the only rule worth remembering is that the sizes must match exactly before you start.