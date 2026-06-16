---
title: linear algebra augmented matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix]]", "[[linear algebra vector]]", "[[linear algebra linear system]]"]
builds-into: ["[[linear algebra gaussian elimination]]", "[[linear algebra row operation]]"]
related: ["[[linear algebra gaussian elimination]]", "[[linear algebra equivalent system]]"]
---

# Augmented Matrix

## Plain English
An augmented matrix packs the coefficient matrix and the right-hand side vector of a linear system side by side into one array, so that row operations affect both simultaneously.

## Intuition
Writing the system $Ax = b$ as a tableau $[A \mid b]$ is like clipping your work sheet and your answer column together — every operation you do to one row of equations automatically updates both the coefficients and the right-hand side.

## Formal Definition
> **Definition:**
> Given the $m \times n$ coefficient matrix $A$ and the right-hand side $\mathbf{b} \in \mathbb{R}^m$, the augmented matrix is the $m \times (n+1)$ matrix:
> $$M = [A \mid \mathbf{b}] = \begin{bmatrix} a_{11} & \cdots & a_{1n} & b_1 \\ \vdots & \ddots & \vdots & \vdots \\ a_{m1} & \cdots & a_{mn} & b_m \end{bmatrix}$$

## Worked Example
For $x + 2y + z = 2$, $2x + 6y + z = 7$, $x + y + 4z = 3$:
$$M = \left[\begin{array}{ccc|c} 1 & 2 & 1 & 2 \\ 2 & 6 & 1 & 7 \\ 1 & 1 & 4 & 3 \end{array}\right]$$
Adding $-2$ times row 1 to row 2 gives row 2 $= (0, 2, -1, 3)$, updating both the coefficient entries and the right-hand side entry $7$ at once.

## Key Properties
- The original linear system is immediately recoverable from $M$.
- Row operations on $M$ correspond exactly to the same operations on the equations.
- The vertical bar is a visual reminder that the last column plays a different role.

## Why It Works
Tracking $A$ and $\mathbf{b}$ together prevents the common error of transforming coefficients while leaving right-hand sides unchanged — a single row operation on $M$ does the correct bookkeeping in one step.

## Bridge to Other Domains
> **→ Numerical Methods:** The augmented matrix is the in-place data structure used by Gaussian elimination code — algorithms update a single array $M$ rather than maintaining separate $A$ and $b$, reducing memory allocation and cache misses.
> *Why it matters:* For $n \times n$ systems, storing one $n \times (n+1)$ array instead of one $n \times n$ and one $n \times 1$ is the standard layout in LAPACK-style implementations.

## Guru's Note
The vertical bar is not mathematical notation — it is a reminder to yourself which column is special; never lose track of it when reading off the solution after row reduction.