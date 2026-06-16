---
title: linear algebra compatibility condition
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra row echelon form]]", "[[linear algebra matrix rank]]"]
builds-into: ["[[linear algebra solution existence and uniqueness theorem]]"]
related: ["[[linear algebra network equilibrium solvability condition]]", "[[linear algebra basic and free variables]]"]
---

# Linear Algebra Compatibility Condition

## Plain English
A linear system has at least one solution if and only if no row-reduction step ever produces a zero row on the left side paired with a nonzero entry on the right side — that pairing would demand $0 = c$ for some $c \neq 0$.

## Intuition
Each all-zero row in the echelon form represents an equation that became $0 \cdot x_1 + \cdots + 0 \cdot x_n = c_i$ — a constraint purely on the right-hand side that the variables cannot satisfy unless $c_i = 0$.

## Formal Definition
> **Definition:**
> The system $Ax = b$ is **compatible** (has at least one solution) if and only if:
> $$\operatorname{rank} A = \operatorname{rank}[A \mid b]$$
>
> Equivalently, in the row echelon form of $[A \mid b]$, every row of the form
> $$[0 \; 0 \; \cdots \; 0 \mid c_i]$$
> satisfies $c_i = 0$.
>
> The $m - r$ zero rows of $A$'s echelon form impose $m - r$ **linear constraints on $b$** for the system to be compatible.

## Worked Example
Row-reduce the augmented matrix for the system from Example 1.46 (with $a, b, c$ as right-hand sides):

$$\begin{bmatrix} 3 & -1 & 2 & b \\ 0 & \frac{14}{3} & -\frac{8}{3} & a - \frac{b}{3} \\ 0 & 0 & 0 & c - \frac{b}{3} - \frac{4a}{3} \end{bmatrix}$$

The last row gives the compatibility constraint:

$$\frac{4}{3}a + \frac{1}{3}b - c = 0$$

If $a = 3, b = 0, c = 4$: $\frac{4}{3}(3) + 0 - 4 = 0$ ✓ — system is compatible.

## Key Properties
1. A system is compatible iff $\operatorname{rank}[A \mid b] = \operatorname{rank} A$.
2. There are exactly $m - r$ linear constraints on $b$ imposed by compatibility.
3. If every row of $A$ contains a pivot ($r = m$), the system is compatible for all $b$.

## Why It Works
Adding $b$ as an extra column can only increase the rank by at most 1. If $\operatorname{rank}[A \mid b] = r + 1$, then $b$ is not in the column space of $A$ — the system asks for a linear combination of $A$'s columns to equal a vector outside their span, which is impossible.

## Bridge to Other Domains
> **→ Signal Processing:** The compatibility condition is equivalent to asking whether a desired signal $b$ lies in the range of a measurement operator $A$; when it does not, least-squares methods find the closest achievable approximation rather than an exact solution.
> *Why it matters:* This is why overdetermined systems in signal processing are solved via pseudoinverse or normal equations instead of direct inversion.

## Guru's Note
The compatibility condition is just the statement that $b$ must lie in the column space of $A$ — once you see it that way, the $m - r$ constraint equations are simply the orthogonal complement conditions.