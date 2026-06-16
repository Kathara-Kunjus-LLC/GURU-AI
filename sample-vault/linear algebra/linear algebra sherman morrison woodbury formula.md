---
title: linear algebra sherman morrison woodbury formula
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra matrix inverse product rule]]"]
builds-into: []
related: ["[[linear algebra nonsingular matrix]]"]
---

# Linear Algebra Sherman Morrison Woodbury Formula

## Plain English
The Sherman-Morrison-Woodbury formula gives an exact closed-form expression for the inverse of a matrix that has been modified by a low-rank update, without recomputing the full inverse from scratch.

## Intuition
If you know how to invert $A$ and someone adds a small "correction" $VBU$ to it, this formula lets you update the inverse cheaply — like patching software without reinstalling the whole system.

## Formal Definition
> **Sherman-Morrison-Woodbury Formula:**
> If $A$ and $B$ are invertible and the matrices are of compatible sizes, then:
> $$(A + VBU)^{-1} = A^{-1} - A^{-1}V(B^{-1} + UA^{-1}V)^{-1}UA^{-1}$$
>
> The simpler special case ($A = I_m$, $B = I_n$):
> $$(I_m + UV)^{-1} = I_m - U(I_n + VU)^{-1}V$$
>
> Where $U$ is $m \times n$, $V$ is $n \times m$, and $I_n + VU$ is invertible whenever $I_m + UV$ is.

## Worked Example
Let $A = I_2$ and $U = V^T = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (rank-1 update). Then $UV = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$ and $VU = [2]$ (scalar).

$$(I_2 + UV)^{-1} = I_2 - \begin{bmatrix}1\\1\end{bmatrix}(1 + 2)^{-1}\begin{bmatrix}1 & 1\end{bmatrix} = I_2 - \frac{1}{3}\begin{bmatrix}1&1\\1&1\end{bmatrix} = \begin{bmatrix}\frac{2}{3}&-\frac{1}{3}\\-\frac{1}{3}&\frac{2}{3}\end{bmatrix}$$

## Key Properties
- Reduces the cost of inverting an $n \times n$ rank-$k$ update from $O(n^3)$ to $O(nk^2)$.
- Assumes $A$, $B$, and the inner matrix $B^{-1} + UA^{-1}V$ are all invertible.
- The rank-1 case (Sherman-Morrison) is used widely in quasi-Newton optimization.

## Why It Works
The identity $(I_n + VU)^{-1} = I_n - V(I_m + UV)^{-1}U$ is verified by multiplying both sides by $(I_n + VU)$ and checking the product equals $I_n$. The general formula follows by substituting $A^{-1}V$ for $V$ and $UA^{-1}$ for $U$.

## Bridge to Other Domains
> **→ Machine Learning:** Gaussian process regression and kernel methods require inverting $K + \sigma^2 I$ where $K$ is a kernel (covariance) matrix; the Woodbury formula enables $O(nm^2)$ inference when the kernel has a low-rank structure ($m \ll n$).
> *Why it matters:* Without this formula, Gaussian process regression on large datasets would be computationally intractable.

## Guru's Note
This formula is the algebraic engine behind incremental learning — any time you update a model by adding new data without retraining from scratch, you are implicitly using a variant of this identity.