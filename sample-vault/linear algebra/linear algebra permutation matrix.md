---
title: linear algebra permutation matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra identity matrix]]", "[[linear algebra elementary matrix]]", "[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra permuted lu decomposition]]", "[[linear algebra matrix commutativity failure]]"]
related: ["[[linear algebra pivoting]]", "[[linear algebra lu decomposition]]"]
---

# Linear Algebra Permutation Matrix

## Plain English
A permutation matrix is a rearrangement of the identity matrix's rows that, when multiplied on the left of any matrix, reorders that matrix's rows in the same way.

## Intuition
Picture the identity matrix as a stack of labeled rows; pull them out and re-stack them in any order — the result is a permutation matrix, and left-multiplying by it applies that same reshuffling to any other matrix.

## Formal Definition
> **Definition:**
> A matrix $P$ is a **permutation matrix** if it is obtained from the $n \times n$ identity $I$ by row interchanges. Equivalently, every row and every column of $P$ contains exactly one entry equal to $1$ and all others equal to $0$.
>
> If the permutation $\pi$ maps $i \mapsto \pi(i)$, then $P_\pi$ has a $1$ in position $(i, \pi(i))$ and $0$ elsewhere, and the product $P_\pi A$ moves row $\pi(i)$ of $A$ into row $i$.

## Worked Example
Interchange rows 1 and 2 of the $3 \times 3$ identity:
$$P = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

Apply to $A = \begin{bmatrix} a & b \\ c & d \\ e & f \end{bmatrix}$:
$$PA = \begin{bmatrix} c & d \\ a & b \\ e & f \end{bmatrix}$$

Row 2 of $A$ moved to row 1, row 1 moved to row 2, row 3 unchanged — exactly as the permutation prescribes.

## Key Properties
- There are exactly $n!$ distinct $n \times n$ permutation matrices.
- The product of two permutation matrices is a permutation matrix (composition of permutations).
- Permutation matrix multiplication is generally noncommutative: $P_1 P_2 \neq P_2 P_1$ in general.

## Why It Works
Each row of $P$ selects exactly one row of $A$ by the standard matrix-multiply rule, and since every column also has exactly one $1$, no two rows of $PA$ draw from the same row of $A$ — a perfect reordering with no duplication or loss.

## Bridge to Other Domains
> **→ Coding:** Permutation matrices are the matrix representation of bijections on a finite set, and their composition law is identical to function composition in combinatorics and group theory — the symmetric group $S_n$ is isomorphic to the group of $n \times n$ permutation matrices under multiplication.
> *Why it matters:* This connection means results about permutation groups (cycle structure, parity, order) translate directly into facts about these matrices and the row operations they encode.

## Common Confusions
> ⚠ You might think **every permutation matrix satisfies $P^2 = I$** — but actually **only elementary (single-swap) permutation matrices satisfy $P^2 = I$**; a non-elementary permutation like a 3-cycle satisfies $P^3 = I$ instead.

## Guru's Note
Every permutation matrix is just a reshuffled identity, so its columns are still orthonormal — that makes $P^{-1} = P^T$, a fact that's surprisingly useful.