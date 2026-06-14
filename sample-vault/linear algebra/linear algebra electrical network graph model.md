---
title: linear algebra electrical network graph model
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 8: Chapter 6: Equilibrium"
prereqs: []
builds-into: ["[[linear algebra incidence matrix]]", "[[linear algebra kirchhoff voltage law]]", "[[linear algebra kirchhoff current law]]"]
related: ["[[linear algebra mass-spring chain]]"]
---

# Linear Algebra Electrical Network Graph Model

## Plain English
An electrical network of wires and junction points is modeled as a weighted directed graph where nodes are junctions and edges are wires carrying resistance weights.

## Intuition
Think of the network as a road map: intersections are nodes, roads are edges, and the "speed limit" (resistance) on each road determines how hard it is for current to flow through it.

## Formal Definition
> **Definition:**
> An electrical network is a weighted digraph $G = (V, E, R)$ where $V$ is the set of nodes (junctions), $E$ is the set of edges (wires), and $R_k > 0$ is the resistance of wire $k$.
>
> The incidence matrix $A \in \mathbb{R}^{m \times n}$ (wires $\times$ nodes) has entries
> $$A_{ki} = \begin{cases} +1 & \text{if wire } k \text{ starts at node } i \\ -1 & \text{if wire } k \text{ ends at node } i \\ 0 & \text{otherwise} \end{cases}$$

## Worked Example
A network with 4 nodes and 5 wires where wire 1 runs from node 1 to node 2 gives the first row of $A$ as:
$$A_{1,\cdot} = \begin{bmatrix} 1 & -1 & 0 & 0 \end{bmatrix}$$
All five rows assemble into the full $5 \times 4$ incidence matrix encoding the entire topology.

## Key Properties
- The orientation of each edge is arbitrary but must be fixed before computing voltages and currents
- The graph must be simple: no self-loops, at most one wire between any two nodes
- Resistance $R_k > 0$ is the edge weight; its reciprocal $c_k = 1/R_k$ is the conductance

## Why It Works
Choosing a directed graph forces a sign convention on voltages and currents, making the linear algebra well-defined. The incidence matrix then encodes the entire topology so that all three physical laws (Ohm's, Kirchhoff Voltage, Kirchhoff Current) become matrix equations involving $A$, $A^T$, and diagonal weight matrices.

## Bridge to Other Domains
> **→ Signal Processing:** The same graph-plus-weights model describes filter networks, where impedances replace resistances and complex voltages replace real ones.
> *Why it matters:* Circuit analysis techniques transfer directly to filter design, letting engineers read off frequency response from the same matrix $K = A^T C A$.

## Guru's Note
Get the orientation of every wire pinned down first — every sign in every subsequent equation flows from that single arbitrary but fixed choice.