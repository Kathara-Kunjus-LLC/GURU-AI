---
title: linear algebra matrix commutativity failure
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra elementary matrix]]"]
related: ["[[linear algebra matrix multiplication]]", "[[linear algebra matrix commutator]]"]
---

# Matrix Commutativity Failure

## Plain English
Unlike ordinary numbers, matrix multiplication is not commutative: switching the order of two matrices generally produces a different result, or may not even be defined.

## Intuition
Multiplying matrices is like applying transformations in sequence — rotating then reflecting gives a different result than reflecting then rotating, just as putting on your shoes before your socks differs from socks before shoes.

## Formal Definition
> **Definition:**
> For matrices $A$ (size $m \times n$) and $B$ (size $n \times p$), the product $AB$ has size $m \times p$, while $BA$ requires $B$ to be $p \times m$ and has size $p \times n$ — different sizes unless $m = p = n$. Even when both are square and the same size, $AB \neq BA$ in general.
>
> The **commutator** measures the failure:
> $$[A, B] = AB - BA$$

## Worked Example
$$\begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}, \qquad \begin{bmatrix} 0 & 0 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 1 & 1 \end{bmatrix}$$
The two products have the same size but are completely different matrices.

## Key Properties
- $AB = BA$ is the exception, not the rule, even for square matrices of the same size.
- A $1 \times n$ row vector times an $n \times 1$ column vector gives a $1 \times 1$ scalar; reversed, an $n \times 1$ times a $1 \times n$ gives an $n \times n$ matrix — dramatically different.
- Diagonal matrices with distinct diagonal entries commute only with other diagonal matrices.

## Why It Works
Matrix multiplication encodes function composition, and composition of functions is not generally commutative — applying $f$ after $g$ versus $g$ after $f$ can give entirely different results, so matrices inherit this asymmetry.

## Bridge to Other Domains
> **→ Signal Processing:** Convolution of signals is commutative $(f * g = g * f)$, but when implemented as matrix-vector products (via circulant matrices), the matrices happen to commute — this is the algebraic reason the commutative convolution theorem holds.
> *Why it matters:* Recognizing which classes of matrices commute (circulant, diagonal, functions of the same matrix) allows massive computational shortcuts.

## Guru's Note
Before canceling or reordering any matrix product, ask: "do these commute?" — the answer is almost always no, and assuming otherwise is the single most common algebraic error in matrix calculations.