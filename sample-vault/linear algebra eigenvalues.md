---
title: linear algebra eigenvalues
domain: linear algebra
parent-domain: mathematics
source: "Linear Algebra and Its Applications, Ch. 5"
prereqs: ["[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra eigendecomposition]]", "[[linear algebra singular value decomposition]]"]
related: ["[[linear algebra eigenvectors]]"]
---

# Linear Algebra Eigenvalues

## Plain English

The scaling factors by which a matrix stretches or compresses along its special directions.

## Intuition

Most vectors, when transformed by a matrix, both change direction and change length. Eigenvalues belong to the special directions (eigenvectors) where the transformation only scales — no rotation. A positive eigenvalue stretches; negative flips and stretches; zero collapses the direction entirely.

## Formal Definition

> **Definition:**
> A scalar $\lambda$ is an **eigenvalue** of matrix $A$ if there exists a nonzero vector $\mathbf{v}$ such that:
> $$A\mathbf{v} = \lambda\mathbf{v}$$
>
> Equivalently, $\lambda$ is an eigenvalue iff $\det(A - \lambda I) = 0$.
>
> The **characteristic polynomial** $p(\lambda) = \det(A - \lambda I)$ has degree $n$ for an $n \times n$ matrix. Its roots are the eigenvalues.
>
> $$\text{tr}(A) = \sum_i \lambda_i, \qquad \det(A) = \prod_i \lambda_i$$

## Worked Example

Find the eigenvalues of $A = \begin{bmatrix}3 & 1\\0 & 2\end{bmatrix}$.

$$\det(A - \lambda I) = \det\begin{bmatrix}3-\lambda & 1\\0 & 2-\lambda\end{bmatrix} = (3-\lambda)(2-\lambda) = 0$$

$$\lambda_1 = 3, \quad \lambda_2 = 2$$

Check: $\text{tr}(A) = 3 + 2 = 5 = \lambda_1 + \lambda_2$ ✓ and $\det(A) = 6 = \lambda_1\lambda_2$ ✓

## Key Properties

$$\det(A - \lambda I) = 0 \implies \lambda \text{ is an eigenvalue}$$

$$\text{tr}(A) = \sum_i \lambda_i$$

$$\det(A) = \prod_i \lambda_i$$

$$A \text{ is invertible} \iff 0 \text{ is not an eigenvalue}$$

## Why It Works

$A\mathbf{v} = \lambda\mathbf{v}$ means $(A - \lambda I)\mathbf{v} = \mathbf{0}$ has a nonzero solution. A linear system has a nonzero solution iff the matrix is singular, i.e. iff $\det(A - \lambda I) = 0$. The characteristic polynomial captures exactly when this singularity occurs.

## Bridge to Other Domains

> **→ Differential Equations:** Eigenvalues of the system matrix $A$ in $\dot{\mathbf{x}} = A\mathbf{x}$ determine stability. All eigenvalues with negative real part → asymptotically stable equilibrium. Any eigenvalue with positive real part → unstable.
> *Why it matters:* Stability analysis of any linear dynamical system reduces to computing eigenvalues.

> **→ Graph Theory:** Eigenvalues of the adjacency matrix or graph Laplacian encode structural properties: connectivity, clustering coefficients, random walk mixing time. The second-smallest Laplacian eigenvalue (Fiedler value) measures graph connectivity.
> *Why it matters:* Spectral graph theory uses eigenvalues to analyze network structure without enumerating all paths.

## Where It Appears

- Stability of ODEs and control systems
- PCA — eigenvalues of the covariance matrix are explained variances
- PageRank — principal eigenvector of the web graph transition matrix
- Quantum mechanics — observable values are eigenvalues of operators

## Common Confusions

> ⚠ You might think **an $n\times n$ matrix always has $n$ distinct real eigenvalues** — but over $\mathbb{R}$, eigenvalues may be complex or repeated. Over $\mathbb{C}$, exactly $n$ eigenvalues always exist (counted with multiplicity).

## Guru's Note

The eigenvalues of a matrix tell you what the transformation does in its most natural coordinate system — if the eigenvalues surprise you, you don't yet understand the matrix.
