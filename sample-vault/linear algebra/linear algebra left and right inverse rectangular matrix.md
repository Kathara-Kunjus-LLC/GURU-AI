---
title: linear algebra left and right inverse rectangular matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra nonsingular matrix]]", "[[linear algebra singular matrix]]"]
builds-into: []
related: ["[[linear algebra matrix form of linear system]]"]
---

# Linear Algebra Left and Right Inverse Rectangular Matrix

## Plain English
A non-square matrix can have a left inverse or a right inverse, but never both at the same time, which is why only square matrices can have a true two-sided inverse.

## Intuition
A tall matrix (more rows than columns) squashes high-dimensional input into a lower-dimensional output and can be "undone" from the left but cannot generate every output — so it has a left inverse but no right inverse. A wide matrix does the opposite.

## Formal Definition
> **Definitions:**
> Let $A$ be $m \times n$.
> - A matrix $B$ ($n \times m$) is a **left inverse** of $A$ if $BA = I_n$.
> - A matrix $C$ ($n \times m$) is a **right inverse** of $A$ if $AC = I_m$.
>
> If $m > n$ (tall matrix): $A$ may have a left inverse but has no right inverse.
> If $m < n$ (wide matrix): $A$ may have a right inverse but has no left inverse.
> If $m = n$ and $A$ is nonsingular: both exist and coincide.

## Worked Example
Let $A = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$ ($2 \times 1$, tall). A left inverse must satisfy $B \begin{bmatrix} 1 \\ 2 \end{bmatrix} = [1]$, e.g., $B = \begin{bmatrix} 1 & 0 \end{bmatrix}$.

Check: $BA = \begin{bmatrix} 1 & 0 \end{bmatrix}\begin{bmatrix} 1 \\ 2 \end{bmatrix} = [1] = I_1$. ✓

But $AB = \begin{bmatrix} 1 \\ 2 \end{bmatrix}\begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 2 & 0 \end{bmatrix} \neq I_2$. So no right inverse.

## Key Properties
- A tall matrix ($m > n$) can have **infinitely many** left inverses if it has one.
- A right inverse $C$ of $A$ satisfies $AC = I$, but $CA \neq I$ when $m \neq n$.
- For square matrices, left inverse ⟺ right inverse ⟺ nonsingular.

## Why It Works
A left inverse exists when the columns of $A$ are linearly independent (the system $Ax = b$ is overdetermined but consistent for some $b$). A right inverse exists when the rows are independent (the system is underdetermined with at least one solution for every $b$). These two conditions cannot both hold simultaneously for a non-square matrix.

## Bridge to Other Domains
> **→ Machine Learning:** The Moore-Penrose pseudoinverse $A^+ = (A^T A)^{-1} A^T$ is the unique left inverse that minimizes $\|x\|$ among all solutions to $Ax = b$ — generalizing matrix inversion to rectangular systems and underpinning least-squares regression.
> *Why it matters:* Understanding left vs. right inverses clarifies exactly what the pseudoinverse is minimizing and when least-squares solutions are unique.

## Guru's Note
The asymmetry between left and right inverses for rectangular matrices is the algebraic reason why overdetermined systems have "best-fit" solutions but not exact ones, and underdetermined systems have infinitely many exact solutions.