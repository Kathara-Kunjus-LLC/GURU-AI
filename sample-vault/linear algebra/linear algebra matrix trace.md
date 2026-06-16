---
title: linear algebra matrix trace
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra matrix multiplication]]"]
builds-into: []
related: ["[[linear algebra matrix commutator]]", "[[linear algebra diagonal matrix]]"]
---

# Matrix Trace

## Plain English
The trace of a square matrix is the sum of its diagonal entries, a single number that captures a fundamental invariant of the matrix.

## Intuition
The trace is like the "total heat" of a matrix — it adds up only what sits on the main diagonal, ignoring everything else, yet this simple sum turns out to be preserved under many transformations.

## Formal Definition
> **Definition:**
> For an $n \times n$ matrix $A$, the **trace** is:
> $$\text{tr}(A) = \sum_{i=1}^n a_{ii} = a_{11} + a_{22} + \cdots + a_{nn}$$

## Worked Example
$$\text{tr}\begin{bmatrix} 3 & 7 & 2 \\ -1 & 5 & 0 \\ 4 & -2 & -4 \end{bmatrix} = 3 + 5 + (-4) = 4$$

## Key Properties
- $\text{tr}(A + B) = \text{tr}(A) + \text{tr}(B)$ (linear).
- $\text{tr}(AB) = \text{tr}(BA)$ even though $AB \neq BA$ — a remarkable symmetry.
- $\text{tr}(ABC) = \text{tr}(CAB) = \text{tr}(BCA)$ (cyclic permutation only).

## Why It Works
The identity $\text{tr}(AB) = \text{tr}(BA)$ holds because both expressions sum the same set of products $\sum_{i,k} a_{ik} b_{ki}$ — just collected in a different order, but the total is the same.

## Bridge to Other Domains
> **→ Machine Learning:** The trace of the Hessian matrix of a loss function equals the sum of its eigenvalues, giving a scalar measure of the total curvature of the loss surface at a point — large trace means sharp, narrow minima that generalize poorly.
> *Why it matters:* Trace-based regularization (minimizing $\text{tr}(H)$) is one strategy for finding flatter, more generalizable minima in neural network training.

## Guru's Note
The cyclic property $\text{tr}(ABC) = \text{tr}(CAB)$ is not a commutation of the matrices — the order $A,B,C$ is preserved cyclically, and breaking that cycle (e.g., $\text{tr}(ACB)$) gives a different number.