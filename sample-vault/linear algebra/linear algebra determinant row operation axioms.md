---
title: linear algebra determinant row operation axioms
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant]]", "[[linear algebra row echelon form]]"]
builds-into: ["[[linear algebra determinant via gaussian elimination]]", "[[linear algebra permutation expansion determinant]]"]
related: ["[[linear algebra partial pivoting]]"]
---

# Linear Algebra Determinant Row Operation Axioms

## Plain English
Three rules describe exactly how each type of elementary row operation changes the determinant of a matrix.

## Intuition
Imagine the rows as edges of a parallelepiped: shearing one edge (type 1) keeps the volume the same, swapping two edges flips orientation and negates volume (type 2), and scaling an edge scales the volume by the same factor (type 3).

## Formal Definition
> **Definition:** For any square matrix $A$:
>
> - **Type 1** (row replacement): $R_i \leftarrow R_i + c R_j$ gives $\det A' = \det A$
> - **Type 2** (row swap): $R_i \leftrightarrow R_j$ gives $\det A' = -\det A$
> - **Type 3** (row scaling): $R_i \leftarrow c R_i$ gives $\det A' = c \cdot \det A$
>
> Where $c$ is any scalar and $i \neq j$.

## Worked Example
Let $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, so $\det A = (1)(4) - (2)(3) = -2$.

Scale row 1 by $5$: new matrix $\begin{bmatrix} 5 & 10 \\ 3 & 4 \end{bmatrix}$, determinant $= (5)(4)-(10)(3) = -10 = 5 \cdot (-2)$ ✓

Swap rows: $\begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix}$, determinant $= (3)(2)-(4)(1) = 2 = -(-2)$ ✓

## Key Properties
- Type-1 ops are free: they power Gaussian Elimination without touching $\det$.
- Each type-2 swap costs a sign flip; track the parity of total swaps.
- Type-3 scaling is why $\det(cA) = c^n \det A$ for an $n \times n$ matrix.

## Why It Works
These three axioms, together with $\det I = 1$, uniquely determine the determinant function — no other scalar function on square matrices satisfies all four conditions simultaneously. The uniqueness proof constructs the permutation expansion (1.87) and shows it is the only solution.

## Bridge to Other Domains
> **→ Differential Equations:** The Wronskian, which tests linear independence of solution functions, transforms under the same sign-flip rule when two functions are swapped — its determinant structure inherits exactly these axioms.
> *Why it matters:* Understanding row-operation axioms lets you simplify Wronskian calculations the same way you simplify matrix determinants.

## Guru's Note
Internalizing these three rules is more powerful than memorizing any expansion formula, because they let you simplify before you compute.