---
title: linear algebra identity matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra matrix inverse]]", "[[linear algebra elementary matrix]]", "[[linear algebra lu decomposition]]"]
related: ["[[linear algebra diagonal matrix]]"]
---

# Identity Matrix

## Plain English
The identity matrix is the square matrix that leaves every other matrix unchanged when multiplied by it, playing the role of the number $1$ in matrix arithmetic.

## Intuition
Multiplying by the identity matrix is like multiplying a number by $1$ — it is the "do nothing" transformation that preserves every vector exactly as it is.

## Formal Definition
> **Definition:**
> The $n \times n$ identity matrix $I_n$ has entries:
> $$\delta_{ij} = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \neq j \end{cases}$$
>
> Explicitly: $I_n = \begin{bmatrix} 1 & 0 & \cdots & 0 \\ 0 & 1 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & 1 \end{bmatrix}$

## Worked Example
For $n = 3$:
$$I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \qquad I_3 \begin{bmatrix} 2 \\ 5 \\ -1 \end{bmatrix} = \begin{bmatrix} 1 \cdot 2 + 0 \cdot 5 + 0 \cdot (-1) \\ 0 \cdot 2 + 1 \cdot 5 + 0 \cdot (-1) \\ 0 \cdot 2 + 0 \cdot 5 + 1 \cdot (-1) \end{bmatrix} = \begin{bmatrix} 2 \\ 5 \\ -1 \end{bmatrix}$$

## Key Properties
- $I_m A = A = A I_n$ for any $m \times n$ matrix $A$.
- $I_n$ is a special case of a diagonal matrix: $I_n = \text{diag}(1, 1, \ldots, 1)$.
- $I_n$ is both upper and lower unitriangular.

## Why It Works
The $1$s on the diagonal select exactly one entry from each row when computing a product, reproducing the original entries unchanged — the zeros suppress all cross-contributions.

## Bridge to Other Domains
> **→ Numerical Methods:** In iterative solvers, the identity matrix appears in preconditioners $M \approx A$ designed to make $M^{-1}A \approx I$, accelerating convergence by making the system "nearly the identity."
> *Why it matters:* How close $M^{-1}A$ is to $I$ directly controls how many iterations the solver needs.

## Guru's Note
Whenever you need a placeholder "no transformation" in a matrix expression, reach for $I$ — it is the matrix equivalent of multiplying by one.