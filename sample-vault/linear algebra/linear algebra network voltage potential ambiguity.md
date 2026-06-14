---
title: linear algebra network voltage potential ambiguity
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: ["[[linear algebra network resistivity matrix]]", "[[linear algebra network grounding]]"]
builds-into: []
related: ["[[linear algebra statically indeterminate system]]"]
---

# Linear Algebra Network Voltage Potential Ambiguity

## Plain English
Absolute voltage potentials at network nodes are not uniquely determined — only their differences are physical — so the equilibrium system has infinitely many solutions that all produce identical, unique currents and wire voltages.

## Intuition
Imagine measuring temperatures relative to a reference: whether you call the room 20°C or 293K, the temperature difference between two points is the same — only relative values matter, not the absolute baseline.

## Formal Definition
> **Definition:**
> The null space of the resistivity matrix $K = A^T C A$ for a connected network is:
> $$\ker K = \ker A = \text{span}\{(1, 1, \ldots, 1)^T\}$$
>
> If $u$ solves $Ku = f$, then $u + t\mathbf{1}$ also solves it for any $t \in \mathbb{R}$. The wire voltages $v = Au$ and currents $y = CAu$ are invariant:
> $$A(u + t\mathbf{1}) = Au + tA\mathbf{1} = Au = v$$

## Worked Example
The general solution for a 4-node network is $u = (1/2 + t,\; 1/4 + t,\; 1/4 + t,\; t)^T$. Setting $t = 0$ (ground node 4) gives $u = (1/2, 1/4, 1/4, 0)^T$. Setting $t = -1/4$ gives $u = (1/4, 0, 0, -1/4)^T$. Both yield identical currents:
$$y_1 = 1/4, \quad y_2 = 1/4, \quad y_3 = 1/2, \quad y_4 = 1/4, \quad y_5 = 1/4$$

## Key Properties
- The free parameter $t$ shifts all potentials uniformly and cancels in every voltage difference
- Physical observables (currents and wire voltages) are uniquely determined despite the non-unique potentials
- Grounding fixes $t$ and selects one representative from the affine solution family

## Why It Works
$K$ is singular precisely because $A\mathbf{1} = 0$: each row of $A$ sums to zero (one $+1$ and one $-1$), so uniform shifts are invisible to $A$. This is a mathematical expression of the physical fact that only potential differences — not absolute potentials — drive electrons.

## Bridge to Other Domains
> **→ Signal Processing:** The same gauge freedom appears in the choice of DC offset in a signal — adding a constant shifts the spectrum's DC component but leaves all frequency differences unchanged, so only the AC content (differences) carries information.
> *Why it matters:* Engineers routinely ground one reference point to fix the gauge, in both circuits and signal processing pipelines.

## Guru's Note
Never worry that your potentials look "wrong" — as long as the currents match, you've found the right physics; the potential values are just a convention.