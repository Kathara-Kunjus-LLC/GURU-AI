---
title: statistics covariance matrix
domain: statistics
parent-domain: mathematics
source: "Pattern Recognition and Machine Learning, Ch. 2"
prereqs: ["[[statistics gaussian distribution]]"]
builds-into: ["[[machine learning principal component analysis]]"]
related: ["[[probability independence]]", "[[linear algebra eigendecomposition]]"]
---

# Statistics Covariance Matrix

## Plain English

A matrix that captures how much every pair of dimensions in your data tend to move together.

## Intuition

Height and weight tend to increase together — positive covariance. Temperature and heating bill tend to move in opposite directions — negative covariance. The covariance matrix packages all such pairwise relationships into one object. The diagonal entries are just variances (how spread out each dimension is on its own).

## Formal Definition

> **Definition:**
> The covariance matrix $\Sigma$ of a random vector $\mathbf{X} \in \mathbb{R}^d$:
> $$\Sigma_{ij} = \text{Cov}(X_i, X_j) = \mathbb{E}[(X_i - \mu_i)(X_j - \mu_j)]$$
>
> In matrix form:
> $$\Sigma = \mathbb{E}[(\mathbf{X}-\boldsymbol\mu)(\mathbf{X}-\boldsymbol\mu)^\top]$$
>
> The sample covariance from $n$ observations:
> $$\hat\Sigma = \frac{1}{n-1}\sum_{i=1}^n (\mathbf{x}_i - \bar{\mathbf{x}})(\mathbf{x}_i - \bar{\mathbf{x}})^\top$$

## Worked Example

Two dimensions: $x_1$ = height (cm), $x_2$ = weight (kg). Three observations:

$$\mathbf{x}_1 = \begin{bmatrix}170\\65\end{bmatrix}, \quad \mathbf{x}_2 = \begin{bmatrix}180\\80\end{bmatrix}, \quad \mathbf{x}_3 = \begin{bmatrix}160\\55\end{bmatrix}$$

$$\bar{\mathbf{x}} = \begin{bmatrix}170\\66.7\end{bmatrix}$$

$$\hat\Sigma = \frac{1}{2}\left[\begin{bmatrix}0\\-1.7\end{bmatrix}\begin{bmatrix}0&-1.7\end{bmatrix} + \begin{bmatrix}10\\13.3\end{bmatrix}\begin{bmatrix}10&13.3\end{bmatrix} + \begin{bmatrix}-10\\-11.7\end{bmatrix}\begin{bmatrix}-10&-11.7\end{bmatrix}\right] = \begin{bmatrix}100 & 125 \\ 125 & 162.3\end{bmatrix}$$

Positive off-diagonal entry confirms height and weight covary positively.

## Key Properties

$$\Sigma = \Sigma^\top \quad \text{(symmetric)}$$

$$\mathbf{v}^\top \Sigma \mathbf{v} \geq 0 \quad \forall \mathbf{v} \quad \text{(positive semidefinite)}$$

$$\Sigma_{ii} = \text{Var}(X_i) \geq 0$$

## Why It Works

Each term $(\mathbf{x}_i - \bar{\mathbf{x}})(\mathbf{x}_i - \bar{\mathbf{x}})^\top$ is a rank-1 outer product. Averaging these outer products accumulates directional information — directions where data varies a lot contribute large outer products. The result is symmetric because covariance is symmetric: how much $X_i$ moves with $X_j$ equals how much $X_j$ moves with $X_i$.

## Bridge to Other Domains

> **→ Linear Algebra:** $\Sigma$ is a symmetric PSD matrix, so it has a clean eigendecomposition $\Sigma = V\Lambda V^\top$. Its eigenvectors are the principal directions of variance; its eigenvalues are the variances along those directions.
> *Why it matters:* PCA is entirely built on this eigendecomposition — understanding the covariance matrix as a linear algebra object makes PCA inevitable.

> **→ Machine Learning:** The covariance matrix is the sufficient statistic of a multivariate Gaussian: knowing $\boldsymbol\mu$ and $\Sigma$ fully specifies $\mathcal{N}(\boldsymbol\mu, \Sigma)$. Gaussian discriminant analysis, Gaussian processes, and Kalman filters all center on estimating and manipulating $\Sigma$.
> *Why it matters:* If you can estimate the covariance matrix accurately, you can fit a full Gaussian model to your data.

## Where It Appears

- PCA — eigendecomposition of the sample covariance matrix
- Gaussian discriminant analysis — class-conditional covariances
- Kalman filters — process and measurement noise covariances
- Portfolio optimization — Markowitz mean-variance optimization

## Common Confusions

> ⚠ You might think **a large $\Sigma_{ij}$ means $X_i$ causes $X_j$** — but covariance only measures linear association, not causation. A confounder can create large covariance between two otherwise unrelated variables.

## Guru's Note

The covariance matrix is where linear algebra and statistics meet — if you understand both its geometry (as a quadratic form) and its statistics (as a measure of joint variation), you understand a huge fraction of modern data analysis.
