---
title: linear algebra eigendecomposition
domain: linear algebra
parent-domain: mathematics
source: "Linear Algebra and Its Applications, Ch. 5"
prereqs: ["[[linear algebra eigenvectors]]", "[[linear algebra eigenvalues]]"]
builds-into: ["[[linear algebra singular value decomposition]]", "[[machine learning principal component analysis]]"]
related: []
---

# Linear Algebra Eigendecomposition

## Plain English

A way of writing a matrix as a product of its eigenvectors and eigenvalues that reveals exactly what the transformation does in its natural coordinate system.

## Intuition

Change your coordinate system to the eigenvector basis, apply a simple scaling (multiply each axis by its eigenvalue), then change back. Eigendecomposition makes any diagonalizable matrix look like a pure stretch in the right coordinate system — it strips away the rotational complexity and shows the bare scaling action.

## Formal Definition

> **Definition:**
> A diagonalisable matrix $A$ can be written as:
> $$A = V \Lambda V^{-1}$$
>
> Where $V$ is the matrix whose columns are eigenvectors of $A$, and $\Lambda = \text{diag}(\lambda_1, \ldots, \lambda_n)$.
>
> For symmetric matrices, $V$ is orthogonal ($V^{-1} = V^\top$), giving the **spectral decomposition**:
> $$A = V \Lambda V^\top = \sum_i \lambda_i \mathbf{v}_i \mathbf{v}_i^\top$$

## Worked Example

$A = \begin{bmatrix}3 & 1\\0 & 2\end{bmatrix}$. Eigenvalues: $\lambda_1 = 3, \lambda_2 = 2$.

Eigenvectors: $\mathbf{v}_1 = \begin{bmatrix}1\\0\end{bmatrix}$, $\mathbf{v}_2 = \begin{bmatrix}1\\-1\end{bmatrix}$.

$$V = \begin{bmatrix}1&1\\0&-1\end{bmatrix}, \quad \Lambda = \begin{bmatrix}3&0\\0&2\end{bmatrix}, \quad V^{-1} = \begin{bmatrix}1&1\\0&-1\end{bmatrix}$$

$$V\Lambda V^{-1} = \begin{bmatrix}1&1\\0&-1\end{bmatrix}\begin{bmatrix}3&0\\0&2\end{bmatrix}\begin{bmatrix}1&1\\0&-1\end{bmatrix} = \begin{bmatrix}3&1\\0&2\end{bmatrix} = A \checkmark$$

## Key Properties

$$A^k = V\Lambda^k V^{-1} \quad \text{(matrix powers are cheap)}$$

$$A \text{ diagonalisable} \iff A \text{ has } n \text{ linearly independent eigenvectors}$$

$$A \text{ symmetric} \implies V \text{ orthogonal, eigenvalues real}$$

## Why It Works

$A = V\Lambda V^{-1}$ means: $V^{-1}$ changes basis to the eigenvector frame, $\Lambda$ scales each coordinate by the corresponding eigenvalue, and $V$ changes back. Applying $A$ is equivalent to this three-step process. For symmetric matrices, the eigenvectors are orthogonal (by the spectral theorem), making $V^{-1} = V^\top$ and the decomposition especially clean.

## Bridge to Other Domains

> **→ Statistics:** The eigendecomposition of the covariance matrix $\Sigma = V\Lambda V^\top$ is the theoretical foundation of PCA. Eigenvectors are principal directions; eigenvalues are variances along those directions. Computing PCA is computing this decomposition.
> *Why it matters:* The entire algorithm of PCA is encoded in a single eigendecomposition.

> **→ Differential Equations:** $A^k = V\Lambda^k V^{-1}$ makes computing Markov chain states efficient: $\mathbf{p}_t = A^t \mathbf{p}_0 = V\Lambda^t V^{-1}\mathbf{p}_0$. Long-run behavior is determined by the dominant eigenvalue and its eigenvector.
> *Why it matters:* PageRank and any stationary distribution computation relies on finding the dominant eigenvector of a transition matrix.

## Where It Appears

- PCA — eigendecomposition of the sample covariance matrix
- Efficient matrix powers — $A^{100}$ via $V\Lambda^{100}V^{-1}$
- Solving linear ODEs — modes of $\dot{\mathbf{x}} = A\mathbf{x}$
- Spectral graph analysis — Laplacian eigendecomposition

## Common Confusions

> ⚠ You might think **every matrix is diagonalisable** — but a matrix requires $n$ linearly independent eigenvectors for diagonalisation, which is not guaranteed. Non-diagonalisable matrices require Jordan normal form. Symmetric matrices are always diagonalisable.

## Guru's Note

If you can diagonalize a matrix, you've understood it completely — everything about its behavior is encoded in its eigenvalues.
