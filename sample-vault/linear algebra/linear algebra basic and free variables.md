---
title: linear algebra basic and free variables
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra row echelon form]]", "[[linear algebra matrix rank]]"]
builds-into: ["[[linear algebra solution existence and uniqueness theorem]]", "[[linear algebra homogeneous system]]"]
related: []
---

# Linear Algebra Basic and Free Variables

## Plain English
After row-reducing a linear system, variables attached to pivot columns are called basic (their values are forced once you pick everything else), and variables in non-pivot columns are called free (you can set them to anything you like).

## Intuition
Think of a pivot column as a locked door — the basic variable behind it has exactly one value once you fix all the free variables — while a free variable is an open dial you can turn to any setting, generating a whole family of solutions.

## Formal Definition
> **Definition:**
> Given a linear system $Ux = c$ in row echelon form with pivot columns $j_1 < j_2 < \cdots < j_r$:
>
> - **Basic variables:** $x_{j_1}, x_{j_2}, \ldots, x_{j_r}$ — one per pivot column.
> - **Free variables:** all remaining $x_j$ for $j \notin \{j_1, \ldots, j_r\}$ — there are $n - r$ of them.
>
> The general solution expresses each basic variable as a linear function of the $n - r$ free variables.

## Worked Example
Row echelon form of a $3 \times 5$ system with pivots in columns 1, 3, 5:

$$\begin{bmatrix} 1 & 3 & 2 & -1 & 0 \\ 0 & 0 & -3 & 6 & 3 \\ 0 & 0 & 0 & 0 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \\ u \\ v \end{bmatrix} = \begin{bmatrix} 0 \\ 3 \\ 3 \end{bmatrix}$$

Pivot columns: 1, 3, 5 $\Rightarrow$ basic variables: $x, z, v$. Free variables: $y, u$.

Back-substitute from row 3: $v = \frac{3}{4}$.

Row 2: $z = -1 + 2u + \frac{1}{4}\cdot 3 = -\frac{1}{4} + 2u$.

Row 1: $x = -3y - 2z + u = \frac{1}{2} - 3y - 3u$.

$y$ and $u$ are arbitrary.

## Key Properties
1. There are exactly $r$ basic variables and $n - r$ free variables, where $r = \operatorname{rank} A$.
2. Each free variable parameterizes a one-dimensional family of solutions.
3. If $n - r = 0$, the basic variables are uniquely determined (unique solution or no solution).

## Why It Works
Back-substitution solves for each basic variable using its pivot equation, and the pivot's nonzero value guarantees division is valid. Free variables have no pivot to solve from, so they are unconstrained — setting each one to a parameter $t_i$ and expressing the basic variables in terms of those parameters describes the full solution manifold.

## Common Confusions
> ⚠ You might think **a free variable can only appear in underdetermined systems** — but actually **free variables appear whenever $\operatorname{rank} A < n$**, which can happen even when $m > n$ if the rows are linearly dependent.

## Guru's Note
Count free variables first: $n - r$ tells you immediately whether you have one solution, infinitely many, or need to check compatibility — before doing any back-substitution.