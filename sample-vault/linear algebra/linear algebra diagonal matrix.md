---
title: linear algebra diagonal matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra identity matrix]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra matrix inverse]]"]
related: ["[[linear algebra triangular form]]", "[[linear algebra identity matrix]]"]
---

# Diagonal Matrix

## Plain English
A diagonal matrix is a square matrix where every entry off the main diagonal is zero, so only the diagonal entries can be nonzero.

## Intuition
A diagonal matrix is a set of independent scaling knobs — it stretches or shrinks each coordinate axis independently without mixing them.

## Formal Definition
> **Definition:**
> A square matrix $A$ is **diagonal** if $a_{ij} = 0$ for all $i \neq j$. The shorthand notation is:
> $$D = \text{diag}(c_1, c_2, \ldots, c_n) = \begin{bmatrix} c_1 & 0 & \cdots & 0 \\ 0 & c_2 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & c_n \end{bmatrix}$$

## Worked Example
$$D = \text{diag}(2, -3, 5) = \begin{bmatrix} 2 & 0 & 0 \\ 0 & -3 & 0 \\ 0 & 0 & 5 \end{bmatrix}, \qquad D \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 2 \\ -3 \\ 5 \end{bmatrix}$$
Each entry of the output is just the corresponding diagonal entry times the input entry.

## Key Properties
- Products of diagonal matrices are diagonal; their diagonal entries multiply pairwise.
- A diagonal matrix $D$ commutes with another diagonal matrix of the same size.
- $I_n = \text{diag}(1, 1, \ldots, 1)$ is the special case with all diagonal entries equal to $1$.

## Why It Works
Because off-diagonal entries are zero, the row-times-column product reduces to a single nonzero term at each position — the diagonal entry scales the corresponding coordinate with no interference from other coordinates.

## Bridge to Other Domains
> **→ Machine Learning:** The diagonal of the covariance matrix of uncorrelated features is a diagonal matrix — principal component analysis (PCA) transforms data so the covariance matrix becomes diagonal, decoupling the features.
> *Why it matters:* Diagonal covariance means features are independent, collapsing the full matrix computation to $n$ independent scalar operations.

## Guru's Note
Solving a linear system $Dx = b$ with a diagonal coefficient matrix is trivial — just divide each $b_i$ by $d_{ii}$ — so diagonalizing is always worth attempting first.