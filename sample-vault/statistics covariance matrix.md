---
title: statistics covariance matrix
domain: statistics
parent-domain: mathematics
source: Pattern Recognition and Machine Learning, Ch. 2
prereqs: ["[[statistics gaussian distribution]]"]
builds-into: ["[[machine learning principal component analysis]]"]
related: ["[[probability independence]]", "[[linear algebra eigendecomposition]]"]
---

## Definition

The covariance matrix $\Sigma$ of a random vector $\mathbf{X} \in \mathbb{R}^d$ is:

$$\Sigma_{ij} = \text{Cov}(X_i, X_j) = \mathbb{E}[(X_i - \mu_i)(X_j - \mu_j)]$$

In matrix form: $\Sigma = \mathbb{E}[(\mathbf{X}-\boldsymbol\mu)(\mathbf{X}-\boldsymbol\mu)^\top]$.

## Intuition

$\Sigma$ captures all pairwise linear relationships between dimensions. The diagonal entries are variances; off-diagonal entries measure how dimensions move together.

## Formal notation

$\Sigma$ is always symmetric positive semidefinite. The sample covariance from $n$ observations is:

$$\hat\Sigma = \frac{1}{n-1}\sum_{i=1}^n (\mathbf{x}_i - \bar{\mathbf{x}})(\mathbf{x}_i - \bar{\mathbf{x}})^\top$$

## Bridge to other domains

In **linear algebra**, $\Sigma$ is a symmetric PSD matrix, so it has a clean eigendecomposition $\Sigma = V\Lambda V^\top$. Its eigenvectors are the principal components; its eigenvalues are the variances along those directions.

In **machine learning**, the covariance matrix is the sufficient statistic of a multivariate Gaussian distribution — knowing $\boldsymbol\mu$ and $\Sigma$ fully specifies the distribution.

## Where it appears

PCA, Gaussian discriminant analysis, Kalman filters, portfolio optimization (Markowitz).

## Common confusions

A large off-diagonal entry $\Sigma_{ij}$ means dimensions $i$ and $j$ are linearly correlated. It does not mean they are causally related.
