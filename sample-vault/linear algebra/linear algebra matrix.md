---
title: linear algebra matrix
domain: linear algebra
parent-domain: mathematics
source: "LinearAlgebraTextbook, Chapter 3: Chapter 1: Linear Algebraic Systems"
prereqs: []
builds-into: ["[[linear algebra matrix multiplication]]", "[[linear algebra linear system]]", "[[linear algebra gaussian elimination]]"]
related: ["[[linear algebra vector]]", "[[linear algebra lu decomposition]]"]
---

# Matrix

## Plain English
A matrix is a rectangular grid of numbers arranged in rows and columns, used to organize and compute with structured data.

## Intuition
Think of a matrix as a spreadsheet: rows are records, columns are fields, and every cell holds a single number — the row and column indices tell you exactly where you are.

## Formal Definition
> **Definition:**
> An $m \times n$ matrix $A$ is an array of $mn$ real numbers arranged in $m$ rows and $n$ columns:
> $$A = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}$$
>
> Where $a_{ij}$ denotes the entry in row $i$ and column $j$, with $1 \le i \le m$ and $1 \le j \le n$.

## Worked Example
The coefficient matrix for the system $x + 2y + z = 2$, $2x + 6y + z = 7$, $x + y + 4z = 3$ is:
$$A = \begin{bmatrix} 1 & 2 & 1 \\ 2 & 6 & 1 \\ 1 & 1 & 4 \end{bmatrix}$$
This is a $3 \times 3$ (square) matrix; entry $a_{23} = 1$ sits in row 2, column 3.

## Key Properties
- Two matrices are equal iff they have the same size and every corresponding entry matches.
- A matrix with $m = n$ is called **square**; a matrix with $n = 1$ is a **column vector**.
- The entry $a_{ij}$ is indexed row-first, column-second — always.

## Why It Works
Packaging numbers into a rectangular array lets a single symbol $A$ stand for an entire transformation or system, so that operations on equations (like elimination) become operations on arrays — compressing notation and revealing structure simultaneously.

## Bridge to Other Domains
> **→ Machine Learning:** A dataset of $m$ samples with $n$ features is naturally stored as an $m \times n$ matrix, and training reduces to matrix operations on this object.
> *Why it matters:* Every gradient-descent update, weight matrix, and attention score in a neural network is a matrix computation.

## Guru's Note
Get the index order $(i, j)$ — row then column — tattooed in your mind before touching any other matrix concept.