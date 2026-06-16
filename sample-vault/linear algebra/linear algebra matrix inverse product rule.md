---
title: linear algebra matrix inverse product rule
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix inverse]]", "[[linear algebra matrix commutativity failure]]"]
builds-into: []
related: ["[[linear algebra elementary matrix]]", "[[linear algebra permuted lu decomposition]]"]
---

# Linear Algebra Matrix Inverse Product Rule

## Plain English
The inverse of a product of matrices is the product of their individual inverses, but taken in the reverse order.

## Intuition
Think of putting on socks then shoes: to undo it, you must take off shoes first, then socks — the reversal is forced because the operations nest inside each other.

## Formal Definition
> **Definition (Lemma 1.21):**
> If $A$ and $B$ are invertible $n \times n$ matrices, then $AB$ is invertible and
> $$( AB )^{-1} = B^{-1} A^{-1}$$
>
> More generally, for a $k$-fold product:
> $$(A_1 A_2 \cdots A_k)^{-1} = A_k^{-1} \cdots A_2^{-1} A_1^{-1}$$

## Worked Example
Let $A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$ with $A^{-1} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}$, and $B = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ with $B^{-1} = \begin{bmatrix} 1 & -2 \\ 0 & 1 \end{bmatrix}$.

$$AB = \begin{bmatrix} 2 & 5 \\ 1 & 3 \end{bmatrix}$$

$$(AB)^{-1} = B^{-1}A^{-1} = \begin{bmatrix} 1 & -2 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 3 & -5 \\ -1 & 2 \end{bmatrix}$$

Verify: $(AB)(AB)^{-1} = \begin{bmatrix} 2 & 5 \\ 1 & 3 \end{bmatrix}\begin{bmatrix} 3 & -5 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I$. ✓

## Key Properties
- Order reversal is mandatory because matrix multiplication is not commutative.
- $(A+B)^{-1} \neq A^{-1} + B^{-1}$ in general.
- The rule generalizes to any finite number of factors.

## Why It Works
Setting $X = B^{-1}A^{-1}$ and checking both $X(AB) = B^{-1}(A^{-1}A)B = I$ and $(AB)X = A(BB^{-1})A^{-1} = I$ uses only associativity, showing $X$ is simultaneously a left and right inverse.

## Bridge to Other Domains
> **→ Machine Learning:** In neural networks, backpropagation reverses the forward-pass chain of transformations layer by layer — exactly the reversal rule $(A_1 \cdots A_k)^{-1} = A_k^{-1} \cdots A_1^{-1}$ applied to the Jacobian chain rule.
> *Why it matters:* Recognizing this algebraic structure clarifies why gradients must flow backward through layers in the reverse order of the forward pass.

## Guru's Note
The reversal trips up almost everyone the first time — always check order explicitly until the socks-and-shoes analogy becomes automatic.