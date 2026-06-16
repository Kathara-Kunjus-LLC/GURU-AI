---
title: linear algebra solution existence and uniqueness theorem
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra matrix rank]]", "[[linear algebra basic and free variables]]", "[[linear algebra row echelon form]]"]
builds-into: ["[[linear algebra homogeneous system]]"]
related: ["[[linear algebra network equilibrium solvability condition]]", "[[linear algebra statically determinate system]]"]
---

# Linear Algebra Solution Existence and Uniqueness Theorem

## Plain English
A system of linear equations has either exactly one solution, infinitely many solutions, or no solution at all — no other count is possible.

## Intuition
Lines, planes, and hyperplanes can intersect in a single point, along an entire line or plane, or not at all — there is no geometry that produces exactly two or three intersection points, because linearity forces any two solutions to generate a whole line of solutions between them.

## Formal Definition
> **Theorem (Theorem 1.45):**
> A system $Ax = b$ of $m$ linear equations in $n$ unknowns, where $A$ has rank $r$, satisfies exactly one of:
>
> - **(i) Unique solution:** $r = n$ and the system is compatible. Requires $m \geq n$.
> - **(ii) Infinitely many solutions:** the system is compatible and $r < n$, giving $n - r \geq 1$ free variables.
> - **(iii) No solution:** the row echelon form contains a row $[0 \; 0 \; \cdots \; 0 \mid c_i]$ with $c_i \neq 0$.
>
> The system is **compatible** if and only if every all-zero row in the echelon form of $A$ also has a zero in the augmented column.

## Worked Example
System with $m = 3$, $n = 3$, rank $r = 2$ after reduction:

$$\begin{bmatrix} 3 & -1 & 2 \\ 0 & \frac{14}{3} & -\frac{8}{3} \\ 0 & 0 & 0 \end{bmatrix} \mathbf{x} = \begin{bmatrix} b \\ a - \frac{1}{3}b \\ c - \frac{1}{3}b - \frac{4}{3}a \end{bmatrix}$$

Compatibility requires the last entry $= 0$: i.e., $\frac{4}{3}a + \frac{1}{3}b - c = 0$.

If satisfied: one free variable ($z$), so **infinitely many solutions**.
If not satisfied: **no solution**.

## Key Properties
1. A linear system can never have exactly 2, 3, or any other finite number $> 1$ of solutions.
2. Incompatibility requires $\operatorname{rank} A < \operatorname{rank}[A \mid b]$ (augmented rank exceeds coefficient rank).
3. For a square $n \times n$ nonsingular $A$: always case (i) for any $b$.

## Why It Works
If $x_1$ and $x_2$ are both solutions, then $A(x_1 - x_2) = 0$, so $x_1 - x_2$ solves the homogeneous system. If that system has a nontrivial solution $v$, then $x_1 + tv$ is a solution for every $t \in \mathbb{R}$, giving infinitely many. Linearity forces this binary: either the homogeneous system is trivial (unique solution) or it is not (infinitely many).

## Bridge to Other Domains
> **→ Numerical Methods:** Detecting which case applies before running a solver prevents numerical disasters: attempting back-substitution on an incompatible system produces garbage, while missing free variables yields only one of infinitely many valid outputs.
> *Why it matters:* Rank-revealing $QR$ and $LU$ factorizations are specifically designed to identify the case and expose free variables automatically.

## Common Confusions
> ⚠ You might think **a system with more equations than unknowns ($m > n$) must have a unique solution** — but actually **it can have no solution or infinitely many**, as rank deficiency from redundant equations can lower $r$ below $n$.

## Guru's Note
The fact that "two solutions implies infinitely many" is the cleanest test for whether a system is linear — if you ever find exactly two solutions to something, the equations cannot all be linear.