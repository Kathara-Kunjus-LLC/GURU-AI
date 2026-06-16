---
title: linear algebra gaussian elimination
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra linear system]]"]
builds-into: ["[[linear algebra lu decomposition]]", "[[linear algebra triangular form]]"]
related: ["[[linear algebra matrix factorization]]"]
---

# Linear Algebra Gaussian Elimination

## Plain English
A step-by-step procedure that simplifies any system of linear equations into triangular form by repeatedly adding multiples of one equation to another, then reads off the solution by back-substitution.

## Intuition
Think of it as peeling an onion from the outside in: each pass eliminates one variable from all equations below it, shrinking the active problem by one dimension each time until only one equation in one unknown remains.

## Formal Definition
> **Definition:**
> Given a system $A\mathbf{x} = \mathbf{b}$, Gaussian Elimination applies a sequence of row operations of the form
> $$R_j \leftarrow R_j - \ell_{ji}\, R_i, \quad \ell_{ji} = \frac{a_{ji}}{a_{ii}}$$
> to produce an equivalent upper-triangular system $U\mathbf{x} = \mathbf{c}$.
>
> Where $R_i$ is the $i$-th equation (pivot row), $a_{ii}$ is the pivot entry, and $\ell_{ji}$ is the multiplier for row $j$.

## Worked Example
Starting from the system:
$$x + 2y + z = 2, \quad 2x + 6y + z = 7, \quad x + y + 4z = 3$$

Subtract $2 \times$ row 1 from row 2 (multiplier $\ell_{21} = 2$):
$$2y - z = 3$$

Subtract $1 \times$ row 1 from row 3 (multiplier $\ell_{31} = 1$):
$$-y + 3z = 1$$

Add $\frac{1}{2} \times$ row 2 to row 3 (multiplier $\ell_{32} = -\frac{1}{2}$):
$$\frac{5}{2}z = \frac{5}{2}$$

Back-substitute: $z = 1$, then $y = 2$, then $x = -3$.

## Key Properties
- Produces an equivalent system — same solution set as the original.
- Requires $O(n^3/3)$ arithmetic operations for an $n \times n$ system.
- The multipliers $\ell_{ji}$ are exactly the entries of the lower-triangular factor $L$ in the $LU$ decomposition.

## Why It Works
Adding a multiple of one equation to another is an invertible operation, so it cannot create or destroy solutions — the solution set is preserved at every step. Eliminating variables in order ensures each step reduces the number of active unknowns by exactly one. The resulting triangular system is immediately solvable by back-substitution because each equation involves one fewer unknown than the previous.

## Bridge to Other Domains
> **→ Numerical Methods:** Gaussian Elimination is the backbone of direct linear solvers; partial pivoting (swapping rows to put the largest entry in the pivot position) controls round-off growth and is the practical modification used in every production implementation.
> *Why it matters:* Without pivoting, floating-point errors can make an otherwise solvable system appear singular, so understanding elimination is prerequisite to understanding numerical stability.

## Common Confusions
> ⚠ You might think **equivalent systems must look alike** — but actually **two systems are equivalent whenever they share the same solution set**, regardless of how different their equations look after elimination steps.

## Guru's Note
The multipliers you compute during elimination are not throwaway work — save them, because they become the $L$ matrix in $LU$ decomposition and let you solve the same coefficient matrix with any right-hand side for almost free.