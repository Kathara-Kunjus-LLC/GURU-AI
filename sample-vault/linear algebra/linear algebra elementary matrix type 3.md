---
title: linear algebra elementary matrix type 3
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra elementary matrix]]"]
builds-into: ["[[linear algebra gauss-jordan elimination]]", "[[linear algebra ldv factorization]]"]
related: ["[[linear algebra lower unitriangular matrix]]"]
---

# Linear Algebra Elementary Matrix Type 3

## Plain English
An elementary matrix of type 3 is the identity matrix with one diagonal entry replaced by a nonzero scalar, and it scales a single row of any matrix it left-multiplies.

## Intuition
It acts like a volume knob for one row: turning it up or down by factor $c$ affects only that row, leaving all others untouched.

## Formal Definition
> **Definition:**
> The type-3 elementary matrix $E$ of size $n \times n$ that multiplies row $i$ by nonzero scalar $c$ is the diagonal matrix:
> $$E = \text{diag}(1, \ldots, 1, c, 1, \ldots, 1)$$
> where $c$ appears in the $i$-th diagonal position. Its inverse is:
> $$E^{-1} = \text{diag}(1, \ldots, 1, 1/c, 1, \ldots, 1)$$

## Worked Example
The matrix that multiplies row 2 of a $3 \times 3$ matrix by $5$:

$$E = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 5 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad E^{-1} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \frac{1}{5} & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

Applying to $A = \begin{bmatrix} 2 & 3 \\ 4 & 1 \\ 0 & 6 \end{bmatrix}$:

$$EA = \begin{bmatrix} 2 & 3 \\ 20 & 5 \\ 0 & 6 \end{bmatrix}$$

Row 2 is scaled by $5$; rows 1 and 3 are unchanged.

## Key Properties
- Every type-3 elementary matrix is invertible (its inverse scales by $1/c$).
- Type-3 matrices are diagonal, hence both upper and lower triangular.
- Multiplying all diagonal pivots to $1$ is exactly the step that converts $U$ into upper unitriangular $V$ in the LDV factorization.

## Why It Works
The diagonal structure means left-multiplication only rescales one row independently of all others, and the inverse operation simply undoes this scaling with the reciprocal — making the inverse always available as long as $c \neq 0$.

## Bridge to Other Domains
> **→ Signal Processing:** Scaling a single row of a transform matrix corresponds to applying a frequency-domain gain to one frequency bin — the elementary operation underlying equalization filters.
> *Why it matters:* Recognizing row scaling as a diagonal matrix operation makes it easy to compose and invert multi-stage filter designs algebraically.

## Guru's Note
Type 3 is the most visually simple elementary matrix — it just rescales one row — but it is the ingredient that separates Gaussian elimination (which doesn't need it) from Gauss-Jordan (which does).