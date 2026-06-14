---
title: linear algebra hooke law
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra reduced incidence matrix]]"]
builds-into: ["[[linear algebra stiffness matrix]]", "[[linear algebra mass-spring chain]]"]
related: []
---

# Linear Algebra Hooke Law

## Plain English
A spring's internal force is proportional to how much it has been stretched or compressed, with a positive stiffness constant that measures how hard the spring resists deformation.

## Intuition
Doubling a spring's stretch doubles the force pulling it back — the spring "remembers" its natural length and fights harder the farther you pull it from there.

## Formal Definition
> **Definition:**
> $$y = Ce, \quad C = \operatorname{diag}(c_1, c_2, \ldots, c_{n+1})$$
>
> Where $y_j$ is the internal force in spring $j$, $e_j$ is its elongation, $c_j > 0$ is the spring stiffness, and $C$ is the diagonal stiffness matrix satisfying $C > 0$ (positive definite).

## Worked Example
Three springs with stiffnesses $c_1 = 2$, $c_2 = 1$, $c_3 = 3$ and elongations $e = (0.5, -1, 0.2)^T$:
$$C = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 3 \end{bmatrix}, \quad y = Ce = \begin{bmatrix} 1 \\ -1 \\ 0.6 \end{bmatrix}$$

Spring 1 pulls with force $1$, spring 2 pushes with force $1$ (compressed), spring 3 pulls with force $0.6$.

## Key Properties
- $C$ is always diagonal and positive definite: $c_j > 0$ for all $j$
- Positive $e_j$ (stretch) gives positive $y_j$ (tension); negative $e_j$ (compression) gives negative $y_j$
- $C > 0$ is what guarantees the stiffness matrix $K = A^T C A$ is positive definite

## Why It Works
The linear proportionality holds because real springs store energy quadratically ($\frac{1}{2} c e^2$), so the restoring force — the derivative of energy with respect to elongation — is linear in $e$. This is valid only for small deformations before material nonlinearity sets in.

## Bridge to Other Domains
> **→ Control Systems:** Hooke's law is the mechanical analogue of Ohm's law ($V = RI$); both are linear constitutive relations of the form output $=$ resistance $\times$ flow, and both yield the same Gram-matrix structure in network analysis.
> *Why it matters:* Resistor networks and spring networks are solved by identical linear algebra, with $C$ playing the role of the conductance matrix.

## Guru's Note
Hooke's law is the simplest possible constitutive law — it's where "linear" in "linear elasticity" actually comes from, and all the positive-definiteness results in the chapter rest on $c_j > 0$.