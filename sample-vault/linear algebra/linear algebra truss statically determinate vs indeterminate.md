---
title: linear algebra truss statically determinate vs indeterminate
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra truss stiffness matrix]]", "[[linear algebra truss stability theorem]]"]
builds-into: []
related: ["[[linear algebra network equilibrium solvability condition]]"]
---

# Truss Statically Determinate vs Indeterminate

## Plain English
A truss is statically determinate if the internal bar forces can be computed directly from force balance alone (without knowing displacements), and statically indeterminate if one must first solve for displacements via the full stiffness system.

## Intuition
In a determinate truss the number of unknowns (bar forces) exactly matches the number of equations (force balances); adding extra bars over-constrains the system, creating redundancy that spreads load across multiple load paths.

## Formal Definition
> **Definition:**
> A stable structure with reduced incidence matrix $A^\star \in \mathbb{R}^{m \times p}$ (where $p = d \cdot n_{\text{free}}$) is
> - **statically determinate** if $A^\star$ is square and nonsingular ($m = p$, $\ker A^\star = \{\mathbf{0}\}$), so internal forces $\mathbf{y} = (A^\star)^{-T} \mathbf{f}^\star$ are uniquely determined without solving for $\mathbf{u}$.
> - **statically indeterminate** if $m > p$ (more bars than degrees of freedom), so $A^\star$ is overdetermined and full equilibrium equations $K^\star\mathbf{u}^\star = \mathbf{f}^\star$ must be solved first.

## Worked Example
Reinforced four-bar planar truss (Figure 6.16): $A^\star$ is $4 \times 4$ and nonsingular, so it is statically determinate. Under uniform downward gravity:

$$y_1 = -\sqrt{2}, \quad y_2 = -1, \quad y_3 = -\sqrt{2}, \quad y_4 = 0$$

Bar 4 (the reinforcing bar) carries zero force — a striking result readable directly from the square system.

Doubly-reinforced truss (Figure 6.17): $A^\star$ is $5 \times 4$ (rectangular), statically indeterminate. The same gravity force now distributes differently, and $y_4, y_5 \neq 0$: the extra bar participates in load-sharing.

## Key Properties
- Determinate: $m = dn_{\text{free}}$; forces uniquely determined by statics alone.
- Indeterminate: $m > dn_{\text{free}}$; forces require displacement solution; multiple load paths exist, increasing redundancy.
- Indeterminate structures tolerate bar failure better (other bars pick up load), but their analysis is more involved.

## Why It Works
When $A^\star$ is square and invertible, $(A^\star)^T\mathbf{y} = \mathbf{f}^\star$ has a unique solution $\mathbf{y}$ without any reference to $\mathbf{u}$ or $C$. When $A^\star$ is tall (more rows than columns), the system $(A^\star)^T\mathbf{y} = \mathbf{f}^\star$ is underdetermined in $\mathbf{y}$; the constitutive law $\mathbf{y} = C A^\star \mathbf{u}$ and stiffness equation are needed to select the physical solution.

## Bridge to Other Domains
> **→ Numerical Methods:** Solving a statically indeterminate system via $K^\star\mathbf{u}^\star = \mathbf{f}^\star$ is a positive-definite linear system solve — the same structure exploited by conjugate gradient and Cholesky factorization methods.
> *Why it matters:* The positive-definiteness guarantee means standard symmetric solvers apply with no special handling.

## Guru's Note
Count bars and free degrees of freedom first: if they match and $A^\star$ is invertible, you can skip the full stiffness solve and read off forces directly.