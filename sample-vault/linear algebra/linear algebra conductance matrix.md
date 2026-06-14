---
title: linear algebra conductance matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra ohm law matrix form]]"]
builds-into: ["[[linear algebra network resistivity matrix]]"]
related: ["[[linear algebra gram matrix positive definiteness]]"]
---

# Linear Algebra Conductance Matrix

## Plain English
The conductance matrix is a diagonal positive definite matrix whose entries are the reciprocals of the wire resistances in a network.

## Intuition
Think of it as a "ease-of-flow" matrix: a large diagonal entry means electrons zip through that wire easily, while a small entry means they struggle.

## Formal Definition
> **Definition:**
> For a network with $m$ wires having resistances $R_1, \ldots, R_m > 0$, the conductance matrix is:
> $$C = R^{-1} = \text{diag}(c_1, \ldots, c_m), \quad c_k = \frac{1}{R_k}$$
>
> It is diagonal and satisfies $C > 0$ (positive definite).

## Worked Example
Three wires with resistances $R_1 = 2, R_2 = 5, R_3 = 10$ give:
$$C = \begin{bmatrix} 1/2 & 0 & 0 \\ 0 & 1/5 & 0 \\ 0 & 0 & 1/10 \end{bmatrix}$$
The weighted norm $\|v\|_C^2 = v^T C v = \frac{v_1^2}{2} + \frac{v_2^2}{5} + \frac{v_3^2}{10}$ measures total internal power.

## Key Properties
- $C$ is diagonal, symmetric, and positive definite
- $C^{-1} = R = \text{diag}(R_1, \ldots, R_m)$ is the resistance matrix
- The weighted inner product $\langle v, w \rangle_C = v^T C w$ defines the natural energy norm for the network

## Why It Works
Conductance is additive for parallel wires (total conductance = sum of individual conductances), while resistance is additive for series wires — using conductance as the fundamental variable makes the matrix structure diagonal and the Gram matrix $K = A^T C A$ cleanly positive semi-definite.

## Bridge to Other Domains
> **→ Machine Learning:** The conductance matrix plays the same role as the precision matrix (inverse covariance) in a Gaussian graphical model — both are diagonal in the wire/variable basis and both define a quadratic energy that is minimized at equilibrium.
> *Why it matters:* Inference in Gaussian graphical models and voltage computation in resistive networks reduce to the same sparse positive definite linear system.

## Guru's Note
The conductance matrix is the weight matrix that turns $A^T A$ into the physically meaningful $A^T C A$ — never forget to include it.