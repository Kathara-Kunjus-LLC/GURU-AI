---
title: linear algebra statically indeterminate system
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra reduced incidence matrix]]", "[[linear algebra stiffness matrix]]"]
builds-into: []
related: ["[[linear algebra mass-spring chain]]", "[[linear algebra statically determinate system]]"]
---

# Linear Algebra Statically Indeterminate System

## Plain English
A mechanical system in which the internal forces cannot be determined from the force-balance equations alone — you must first solve for the displacements using the full stiffness system.

## Intuition
Imagine two ropes holding up a chandelier: knowing the chandelier weighs 10 kg doesn't tell you how much tension is in each rope unless you also know how stiff each rope is and how much it stretches.

## Formal Definition
> **Definition:**
> A system is statically indeterminate if the force-balance matrix $A^T$ is not square (or is singular), so $A^T y = f$ does not have a unique solution for $y$.
>
> Resolution requires solving the full system:
> $$Ku = f, \quad K = A^T C A$$
> and then computing $e = Au$, $y = Ce$.

## Worked Example
Fixed-end chain: $A$ is $4 \times 3$, so $A^T$ is $3 \times 4$ — fat, not square. With $f = (0,1,0)^T$, $A^T y = f$ has infinitely many solutions for $y$. Solving $Ku = f$ first gives $u = (\frac{1}{2}, 1, \frac{1}{2})^T$, then:
$$e = Au = \left(\frac{1}{2}, -\frac{1}{2}, \frac{1}{2}, -\frac{1}{2}\right)^T, \quad y = Ce = e$$

The internal forces are uniquely determined only after solving for displacements.

## Key Properties
- Occurs when both ends of the chain are fixed, making $A$ rectangular $(n+1) \times n$
- The minimum-norm solution to $A^T y = f$ equals the physically correct internal forces when $C = I$
- Adding constraints (fixed ends) over-constrains the force equations while uniquely determining displacements

## Why It Works
With more springs than needed for force balance, the extra springs carry load in amounts determined by their relative stiffnesses — the stiffness matrix encodes this competition, and solving $Ku = f$ resolves it by invoking compatibility (the elongations must be consistent with the displacements).

## Bridge to Other Domains
> **→ Statistics:** The minimum-norm solution to an underdetermined system is the least-squares pseudoinverse solution; statically indeterminate force recovery is algebraically identical to finding the best-fit regression coefficients when there are more predictors than constraints.
> *Why it matters:* Both rely on $A^T(AA^T)^{-1}$ as the projection onto the row space of $A$.

## Guru's Note
Statically indeterminate just means "the geometry over-constrains things" — the stiffness matrix is the tool that resolves the ambiguity by using material properties.