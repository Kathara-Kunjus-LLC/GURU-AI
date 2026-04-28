---
title: linear algebra eigenvectors
domain: linear algebra
parent-domain: mathematics
source: "Linear Algebra and Its Applications, Ch. 5"
prereqs: ["[[linear algebra matrix multiplication]]"]
builds-into: ["[[linear algebra eigendecomposition]]", "[[machine learning principal component analysis]]"]
related: ["[[linear algebra eigenvalues]]"]
---

# Linear Algebra Eigenvectors

## Plain English

The special directions in which a linear transformation only stretches or compresses, without rotating.

## Intuition

Shine a flashlight through a lens. Most light rays bend. But there are a few special rays that pass straight through — only their brightness changes, not their angle. Eigenvectors are those special rays: directions that survive the transformation unchanged in orientation, only scaled by the eigenvalue.

## Formal Definition

> **Definition:**
> A nonzero vector $\mathbf{v}$ is an **eigenvector** of matrix $A$ corresponding to eigenvalue $\lambda$ if:
> $$A\mathbf{v} = \lambda\mathbf{v}$$
>
> The **eigenspace** for eigenvalue $\lambda$ is the set of all eigenvectors for that eigenvalue (plus zero):
> $$E_\lambda = \ker(A - \lambda I) = \{\mathbf{v} : A\mathbf{v} = \lambda\mathbf{v}\}$$

## Worked Example

Find an eigenvector of $A = \begin{bmatrix}3 & 1\\0 & 2\end{bmatrix}$ for $\lambda_1 = 3$.

$$(A - 3I)\mathbf{v} = \begin{bmatrix}0 & 1\\0 & -1\end{bmatrix}\mathbf{v} = \mathbf{0}$$

Row reducing: $v_2 = 0$, $v_1$ free. Take $\mathbf{v}_1 = \begin{bmatrix}1\\0\end{bmatrix}$.

Check: $A\mathbf{v}_1 = \begin{bmatrix}3\\0\end{bmatrix} = 3\begin{bmatrix}1\\0\end{bmatrix}$ ✓

## Key Properties

$$A\mathbf{v} = \lambda\mathbf{v} \iff (A - \lambda I)\mathbf{v} = \mathbf{0}$$

$$E_\lambda = \ker(A - \lambda I) \quad \text{(eigenspace)}$$

$$\mathbf{v} \text{ eigenvector} \implies c\mathbf{v} \text{ eigenvector for any } c \neq 0$$

## Why It Works

$(A - \lambda I)\mathbf{v} = \mathbf{0}$ is a homogeneous linear system. Its solution space (the null space) is exactly the eigenspace. Finding eigenvectors is just null space computation for the matrix $(A - \lambda I)$, where $\lambda$ was already found from the characteristic polynomial.

## Bridge to Other Domains

> **→ Statistics / Machine Learning:** Eigenvectors of the covariance matrix $\hat\Sigma$ are the **principal components** in PCA — the directions of maximum variance in the data. The first eigenvector (largest eigenvalue) captures the most variance; each subsequent one is orthogonal to all previous.
> *Why it matters:* PCA is entirely reducible to one eigendecomposition — understanding eigenvectors makes the algorithm self-evident.

> **→ Differential Equations:** In the system $\dot{\mathbf{x}} = A\mathbf{x}$, eigenvectors define the normal modes. The general solution is a superposition of $e^{\lambda_i t}\mathbf{v}_i$ terms — one per eigenpair.
> *Why it matters:* Solving linear ODEs is equivalent to finding eigenvectors and evolving each mode independently.

> **→ Quantum Mechanics:** Eigenvectors of the Hamiltonian operator are the stationary states (energy eigenstates). Measurement collapses the quantum state to an eigenvector, with the corresponding eigenvalue as the observed energy.
> *Why it matters:* The entire structure of quantum mechanics — energy levels, spectra, measurement — is an eigenvalue problem.

## Where It Appears

- PCA — principal components are eigenvectors of the covariance matrix
- Google PageRank — web page importance is the principal eigenvector of the link matrix
- Spectral graph theory — graph structure encoded in Laplacian eigenvectors
- Vibration analysis — resonant modes of mechanical structures

## Common Confusions

> ⚠ You might think **there is one unique eigenvector per eigenvalue** — but the eigenspace can be multi-dimensional. Any nonzero linear combination of eigenvectors sharing the same eigenvalue is also an eigenvector for that eigenvalue.

## Guru's Note

Eigenvectors are the coordinate system in which a matrix is most understandable — always ask what the natural basis is before analyzing a transformation.
