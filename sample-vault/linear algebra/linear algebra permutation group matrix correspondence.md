---
title: linear algebra permutation group matrix correspondence
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra permutation matrix]]", "[[linear algebra matrix multiplication]]", "[[linear algebra matrix commutativity failure]]"]
builds-into: []
related: ["[[linear algebra identity matrix]]", "[[linear algebra permuted lu decomposition]]"]
---

# Linear Algebra Permutation Group Matrix Correspondence

## Plain English
Every rearrangement of a finite ordered list corresponds to exactly one permutation matrix, and composing two rearrangements corresponds to multiplying their matrices — the two structures are the same object in different clothes.

## Intuition
Shuffling a deck of cards twice is the same as finding one big shuffle that does both at once; multiplying two permutation matrices is exactly that "one big shuffle" computed by matrix multiplication.

## Formal Definition
> **Definition:**
> A permutation $\pi$ of $\{1, \ldots, n\}$ corresponds to the permutation matrix $P_\pi$ with entries:
> $$(P_\pi)_{ij} = \begin{cases} 1 & \text{if } j = \pi(i) \\ 0 & \text{otherwise} \end{cases}$$
>
> Composition of permutations corresponds to matrix multiplication:
> $$P_{\pi_1 \circ \pi_2} = P_{\pi_1} P_{\pi_2}$$
>
> There are $n!$ distinct $n \times n$ permutation matrices, one per permutation of $n$ elements.

## Worked Example
Two permutations of $\{1,2,3\}$: $\pi_1$ swaps 1 and 2, $\pi_2$ swaps 2 and 3.

$$P_{\pi_1} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad P_{\pi_2} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$

$$P_{\pi_1} P_{\pi_2} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}, \quad P_{\pi_2} P_{\pi_1} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$$

The products differ, confirming noncommutativity: swapping rows $\{1,2\}$ then $\{2,3\}$ is not the same as swapping $\{2,3\}$ then $\{1,2\}$.

## Key Properties
- The $n \times n$ permutation matrices form a group under multiplication isomorphic to the symmetric group $S_n$.
- Multiplication of permutation matrices is noncommutative for $n \geq 3$.
- The inverse of a permutation matrix equals its transpose: $P^{-1} = P^T$.

## Why It Works
Each row of $P_\pi$ has exactly one $1$ in column $\pi(i)$; when two such matrices multiply, the $(i,k)$ entry of the product counts how many intermediate indices $j$ satisfy both $\pi_1(i) = j$ and $\pi_2(j) = k$ — which is exactly $1$ if $k = (\pi_2 \circ \pi_1)(i)$ and $0$ otherwise, reproducing the composition permutation.

## Bridge to Other Domains
> **→ Coding:** The symmetric group $S_n$ — identical to this matrix group — is the foundation of sorting algorithm analysis; the minimum number of swaps to sort a permutation equals the number of cycles minus $n$, a fact proved by studying the group structure.
> *Why it matters:* Understanding permutation composition lets you count operations, detect already-sorted inputs, and design optimal in-place sorting routines.

## Guru's Note
The single most useful fact here: $P^T = P^{-1}$ for every permutation matrix, which means undoing a row shuffle costs nothing beyond a transpose.