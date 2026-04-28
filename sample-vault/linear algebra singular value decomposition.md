---
title: linear algebra singular value decomposition
domain: linear algebra
parent-domain: mathematics
source: "Linear Algebra and Its Applications, Ch. 7"
prereqs: ["[[linear algebra eigendecomposition]]"]
builds-into: []
related: ["[[machine learning principal component analysis]]"]
---

# Linear Algebra Singular Value Decomposition

## Plain English

A way to decompose any matrix — even non-square or singular ones — into three interpretable pieces: rotate input, scale, rotate output.

## Intuition

Every linear transformation, no matter how complicated, is equivalent to: align the input to its natural axes, stretch or compress each axis by a specific amount (the singular values), then align the output. SVD finds those natural axes and scaling amounts for any matrix — even rectangular ones where eigendecomposition doesn't apply.

## Formal Definition

> **Definition:**
> Every real matrix $A \in \mathbb{R}^{m \times n}$ has a singular value decomposition:
> $$A = U \Sigma V^\top$$
>
> Where $U \in \mathbb{R}^{m\times m}$ and $V \in \mathbb{R}^{n\times n}$ are orthogonal matrices, and $\Sigma \in \mathbb{R}^{m\times n}$ is diagonal with non-negative entries $\sigma_1 \geq \sigma_2 \geq \cdots \geq 0$ (the singular values).
>
> The rank-$k$ truncated SVD gives the best rank-$k$ approximation to $A$:
> $$A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$$

## Worked Example

$$A = \begin{bmatrix}3 & 0\\0 & 2\end{bmatrix}$$

For a diagonal matrix, SVD is trivial: $U = I$, $V = I$, $\Sigma = A$.

$$\sigma_1 = 3, \quad \sigma_2 = 2$$

Rank-1 approximation: $A_1 = 3 \cdot \begin{bmatrix}1\\0\end{bmatrix}\begin{bmatrix}1&0\end{bmatrix} = \begin{bmatrix}3&0\\0&0\end{bmatrix}$

The rank-1 approximation captures the dominant stretching direction but loses the minor axis.

## Key Properties

$$A = U\Sigma V^\top, \quad U^\top U = I, \quad V^\top V = I$$

$$\text{rank}(A) = \text{number of nonzero singular values}$$

$$\|A - A_k\|_F = \sqrt{\sigma_{k+1}^2 + \cdots + \sigma_r^2} \quad \text{(best rank-}k\text{ approximation)}$$

$$A^\dagger = V\Sigma^\dagger U^\top \quad \text{(pseudoinverse via SVD)}$$

## Why It Works

$U$ and $V$ are found from the eigenvectors of $AA^\top$ and $A^\top A$ respectively — both are symmetric PSD matrices with the same nonzero eigenvalues $\sigma_i^2$. The singular values are the square roots of these shared eigenvalues. This construction works for any matrix because $AA^\top$ and $A^\top A$ are always symmetric PSD and therefore always have real, non-negative eigenvalues.

## Bridge to Other Domains

> **→ Machine Learning:** SVD of a centred data matrix $X$ is numerically equivalent to PCA. Computing $X = U\Sigma V^\top$ and taking the columns of $V$ gives principal components directly — more numerically stable than eigendecomposing $X^\top X$.
> *Why it matters:* In practice, PCA is almost always implemented via SVD, not eigendecomposition of the covariance matrix.

> **→ Signal Processing:** The singular values of a matrix of signal measurements determine the effective rank — the number of independent signal components. Truncated SVD is the basis of noise reduction: keep only the top-$k$ singular values, discard the rest as noise.
> *Why it matters:* Low-rank approximation via SVD is the principled way to separate signal from noise in high-dimensional data.

> **→ Information Retrieval:** Latent Semantic Analysis (LSA) applies truncated SVD to a term-document matrix to find latent semantic dimensions. Words and documents are projected onto a shared low-dimensional space where semantic similarity can be computed as cosine distance.
> *Why it matters:* SVD is the original word embedding technique — preceding Word2Vec by decades.

## Where It Appears

- PCA (numerical implementation)
- Recommender systems — matrix factorisation of user-item ratings
- Image compression — store only top-$k$ singular values and vectors
- Pseudoinverse computation for least-squares regression
- Latent Semantic Analysis

## Common Confusions

> ⚠ You might think **SVD requires a square matrix** — but SVD exists for every real matrix of any shape. This is its main advantage over eigendecomposition, which is only defined for square matrices and not always computable.

## Guru's Note

SVD always exists and always reveals the intrinsic geometry — when eigendecomposition fails, SVD is the answer.
