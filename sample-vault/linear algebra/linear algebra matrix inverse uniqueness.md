---
title: linear algebra matrix inverse uniqueness
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra matrix form of linear system]]"]
builds-into: []
related: ["[[linear algebra nonsingular matrix]]"]
---

# Linear Algebra Matrix Inverse Uniqueness

## Plain English
A square matrix can have at most one inverse — there is never a choice between two different inverses.

## Intuition
If two matrices both "undo" $A$, then they must agree on every input vector, which forces them to be identical — the same way two functions that agree on all inputs must be the same function.

## Formal Definition
> **Definition (Lemma 1.19):**
> If $XA = I = AX$ and $YA = I = AY$, then $X = Y$.
>
> **Proof sketch:**
> $$X = XI = X(AY) = (XA)Y = IY = Y$$

## Worked Example
Suppose both $X = \begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix}$ and $Y$ claim to be inverses of $A = \begin{bmatrix} 3 & 1 \\ 2 & 1 \end{bmatrix}$.

From $XA = I$: $$(XA)Y = IY = Y$$

But also: $$X(AY) = XI = X$$

So $X = Y$ necessarily.

## Key Properties
- Uniqueness follows from associativity of matrix multiplication alone.
- The proof uses only $XA = I$ and $AY = I$ — no other properties of $A$ are needed.
- This extends: linear operators on finite-dimensional spaces also have unique inverses.

## Why It Works
Associativity of matrix multiplication is the only ingredient in the proof. The chain $X = X(AY) = (XA)Y = Y$ is a one-line argument that requires no special properties of the matrices involved — just the ability to regroup parentheses.

## Bridge to Other Domains
> **→ Coding:** Database primary keys obey the same uniqueness logic — if two keys both "inverse-map" to the same record, they are the same key — making the algebraic argument a template for reasoning about bijections in data systems.
> *Why it matters:* The abstract pattern (a left and right identity pins down a unique object) recurs across algebra, logic, and system design.

## Guru's Note
The proof is three lines and uses only associativity — memorize the chain $X = X(AY) = (XA)Y = Y$ so you can reproduce it instantly.