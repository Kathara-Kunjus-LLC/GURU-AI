---
title: linear algebra cramer rule
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant]]", "[[linear algebra determinant product formula]]", "[[linear algebra solution existence and uniqueness theorem]]"]
builds-into: []
related: ["[[linear algebra determinant via gaussian elimination]]", "[[linear algebra homogeneous system]]"]
---

# Linear Algebra Cramer Rule

## Plain English
Cramer's rule gives a formula for each variable of a nonsingular linear system as a ratio of two determinants.

## Intuition
Each variable's value equals the fraction of the total "signed volume" that you recover by replacing the column of coefficients for that variable with the right-hand side vector.

## Formal Definition
> **Definition:** For the nonsingular system $A\mathbf{x} = \mathbf{b}$ with $\Delta = \det A \neq 0$, the $k$-th variable is:
> $$x_k = \frac{\det A_k}{\det A} = \frac{\det A_k}{\Delta}$$
>
> Where $A_k$ is the matrix $A$ with its $k$-th column replaced by $\mathbf{b}$.

## Worked Example
Solve $x + 3y = 13$, $4x + 2y = 0$.

$$A = \begin{bmatrix} 1 & 3 \\ 4 & 2 \end{bmatrix}, \quad \Delta = (1)(2)-(3)(4) = -10$$

For $x$: replace column 1 with $\mathbf{b} = \begin{bmatrix}13\\0\end{bmatrix}$:

$$\det A_1 = \det\begin{bmatrix}13 & 3\\0 & 2\end{bmatrix} = 26, \quad x = \frac{26}{-10} = -\frac{13}{5}$$

For $y$: replace column 2 with $\mathbf{b}$:

$$\det A_2 = \det\begin{bmatrix}1 & 13\\4 & 0\end{bmatrix} = -52, \quad y = \frac{-52}{-10} = \frac{26}{5}$$

## Key Properties
- Only applies to square, nonsingular systems ($\det A \neq 0$).
- Theoretically exact — no rounding from elimination steps.
- Requires computing $n+1$ determinants of $n \times n$ matrices: $O(n \cdot n^3) = O(n^4)$, far slower than Gaussian Elimination's $O(n^3)$.

## Why It Works
The product formula $\det(A \cdot X_k) = \det A \cdot \det X_k$ can be applied to a cleverly constructed matrix $X_k$ whose determinant equals $x_k$. Alternatively, one can verify directly that substituting the ratio formulas into $A\mathbf{x} = \mathbf{b}$ and using cofactor expansion along the replaced column yields an identity.

## Bridge to Other Domains
> **→ Numerical Methods:** Cramer's rule is a textbook example of a theoretically clean but computationally catastrophic algorithm — it demonstrates that algorithmic elegance and numerical efficiency are orthogonal properties, a lesson central to algorithm design.
> *Why it matters:* Recognizing this gap prevents practitioners from using attractive closed-form expressions in production solvers where stability and speed matter.

## Common Confusions
> ⚠ You might think Cramer's rule is a practical solver — but actually for $n \geq 4$ it is dramatically slower than LU factorization; it belongs in proofs and $2 \times 2$ or $3 \times 3$ hand calculations only.

## Guru's Note
Cramer's rule is worth knowing cold for $2 \times 2$ and $3 \times 3$ systems and for theoretical arguments, but reach for LU decomposition the moment $n$ exceeds 3.