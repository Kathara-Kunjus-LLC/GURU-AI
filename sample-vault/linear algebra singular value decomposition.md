---
title: linear algebra singular value decomposition
domain: linear algebra
parent-domain: mathematics
source: Linear Algebra and Its Applications, Ch. 7
prereqs: ["[[linear algebra eigendecomposition]]"]
builds-into: []
related: ["[[machine learning principal component analysis]]"]
---

## Definition

Every real matrix $A \in \mathbb{R}^{m \times n}$ has a singular value decomposition:

$$A = U \Sigma V^\top$$

where $U \in \mathbb{R}^{m\times m}$ and $V \in \mathbb{R}^{n\times n}$ are orthogonal matrices and $\Sigma \in \mathbb{R}^{m\times n}$ is diagonal with non-negative entries $\sigma_1 \geq \sigma_2 \geq \cdots \geq 0$ (the singular values).

## Intuition

SVD generalises eigendecomposition to non-square matrices. It reveals the "skeleton" of any linear transformation: rotate input space, scale along principal axes, rotate output space.

## Formal notation

The rank-$k$ truncated SVD gives the best rank-$k$ approximation to $A$ (in both the Frobenius and spectral norms):

$$A \approx \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$$

## Bridge to other domains

In **machine learning**, SVD is equivalent to PCA on the data matrix (when the data is centred). Numerically, computing SVD of the data matrix $X$ is more stable than eigendecomposing $X^\top X$.

In **signal processing**, the singular values of a matrix of signal measurements determine the effective rank — the number of independent signal components. Low-rank approximation via SVD is the basis of noise reduction and compression.

In **information retrieval**, Latent Semantic Analysis (LSA) applies truncated SVD to the term-document matrix to find latent semantic dimensions.

## Where it appears

PCA (numerical implementation), recommender systems (matrix factorisation), image compression, pseudo-inverse computation, least-squares regression.

## Common confusions

SVD always exists (unlike eigendecomposition). Every matrix — rectangular, singular, any shape — has an SVD.
