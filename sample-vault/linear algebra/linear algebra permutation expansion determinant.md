---
title: linear algebra permutation expansion determinant
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: ["[[linear algebra determinant]]", "[[linear algebra determinant row operation axioms]]"]
builds-into: ["[[linear algebra cramer rule]]", "[[linear algebra determinant transpose invariance]]"]
related: ["[[linear algebra determinant via gaussian elimination]]"]
---

# Linear Algebra Permutation Expansion Determinant

## Plain English
The determinant can be written as a sum over all ways to choose one entry from each row and each column, each term signed according to whether that selection corresponds to an even or odd rearrangement of the rows.

## Intuition
Think of placing $n$ non-attacking rooks on an $n \times n$ chessboard — every valid placement picks exactly one entry per row and column; you multiply those entries and assign $+$ or $-$ based on how "shuffled" the column positions are relative to their natural order.

## Formal Definition
> **Definition:** For an $n \times n$ matrix $A$ with entries $a_{ij}$:
> $$\det A = \sum_{\pi} (\operatorname{sign} \pi)\, a_{\pi(1),1}\, a_{\pi(2),2} \cdots a_{\pi(n),n}$$
>
> Where the sum is over all $n!$ permutations $\pi$ of $\{1, \ldots, n\}$, and $\operatorname{sign} \pi = +1$ if $\pi$ is an even permutation (even number of transpositions) and $-1$ if odd.

## Worked Example
For $n = 2$: the two permutations of $\{1,2\}$ are $\pi_1 = (1,2)$ (identity, even) and $\pi_2 = (2,1)$ (one swap, odd):

$$\det \begin{bmatrix} a & b \\ c & d \end{bmatrix} = (+1)\cdot a_{1,1}a_{2,2} + (-1)\cdot a_{2,1}a_{1,2} = ad - bc$$

For $n=3$: there are $3! = 6$ terms — three with $+$ sign and three with $-$ sign — giving the rule-of-Sarrus formula:

$$a_{11}a_{22}a_{33} + a_{31}a_{12}a_{23} + a_{21}a_{32}a_{13} - a_{11}a_{32}a_{23} - a_{21}a_{12}a_{33} - a_{31}a_{22}a_{13}$$

## Key Properties
- Contains $n!$ terms — completely impractical for $n \geq 5$ (a $10 \times 10$ determinant has $3{,}628{,}800$ terms).
- Proves the determinant is well-defined and unique.
- Immediately implies $\det(A^T) = \det A$ since the same products appear when rows and columns are exchanged.

## Why It Works
Each permutation $\pi$ represents one way to pick a "diagonal" of entries covering every row and column exactly once. The sign tracks orientation: even permutations preserve the orientation of the coordinate system; odd ones flip it. Summing all signed products is the only formula consistent with the four determinant axioms, as can be verified by direct substitution.

## Bridge to Other Domains
> **→ Probability:** The permanent of a matrix, defined by the same sum but with all signs set to $+1$, counts the number of perfect matchings in a bipartite graph and appears in the computation of multi-photon coincidence probabilities in quantum optics.
> *Why it matters:* The determinant and permanent are twin formulas that diverge only in sign assignment — understanding one illuminates the other, and the hardness of computing the permanent (it is $\#P$-complete) contrasts sharply with the $O(n^3)$ determinant.

## Common Confusions
> ⚠ You might think this expansion is the standard way to compute determinants — but actually Gaussian Elimination is $O(n^3)$ while this formula is $O(n!)$, so the expansion is only ever used for proofs and for $2\times 2$ or $3\times 3$ matrices by hand.

## Guru's Note
Know this formula well enough to derive the $2 \times 2$ and $3 \times 3$ cases and to cite it in proofs, but never use it to compute anything larger than $3 \times 3$.