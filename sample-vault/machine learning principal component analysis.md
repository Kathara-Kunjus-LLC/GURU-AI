---
title: machine learning principal component analysis
domain: machine learning
parent-domain: computer science
source: "Pattern Recognition and Machine Learning, Ch. 12"
prereqs: ["[[linear algebra eigendecomposition]]", "[[statistics covariance matrix]]", "[[linear algebra eigenvectors]]"]
builds-into: []
related: ["[[linear algebra singular value decomposition]]"]
---

# Machine Learning Principal Component Analysis

## Plain English

A technique that finds the directions of greatest variation in a dataset and projects the data onto those directions to reduce its dimensionality.

## Intuition

Shine a light on a cloud of data points and watch the shadow. PCA finds the angle that makes the shadow as spread out as possible — the direction of maximum variance. The first principal component is that direction; the second is the direction of maximum remaining variance that is perpendicular to the first; and so on.

## Formal Definition

> **Definition:**
> Given centred data $\tilde{X} \in \mathbb{R}^{n \times d}$, PCA finds the orthonormal directions $\mathbf{v}_1, \ldots, \mathbf{v}_k$ maximising projected variance:
> $$\mathbf{v}_1 = \arg\max_{\|\mathbf{v}\|=1} \mathbf{v}^\top \hat\Sigma \mathbf{v}$$
>
> These directions are the top-$k$ eigenvectors of the sample covariance matrix $\hat\Sigma = \frac{1}{n-1}\tilde{X}^\top\tilde{X}$.
>
> **Algorithm:**
> 1. Centre the data: $\tilde{X} = X - \bar{X}$
> 2. Compute covariance: $\hat\Sigma = \frac{1}{n-1}\tilde{X}^\top\tilde{X}$
> 3. Eigendecompose: $\hat\Sigma = V\Lambda V^\top$
> 4. Project to $k$ dimensions: $Z = \tilde{X} V_k$
> 5. Reconstruct: $\hat{X} = Z V_k^\top + \bar{X}$

## Worked Example

Data: $\mathbf{x}_1 = [2,3]^\top$, $\mathbf{x}_2 = [4,5]^\top$, $\mathbf{x}_3 = [0,1]^\top$.

$$\bar{X} = [2, 3]^\top, \quad \tilde{X} = \begin{bmatrix}0&0\\2&2\\-2&-2\end{bmatrix}$$

$$\hat\Sigma = \frac{1}{2}\begin{bmatrix}8&8\\8&8\end{bmatrix} = \begin{bmatrix}4&4\\4&4\end{bmatrix}$$

Eigenvalues: $\lambda_1 = 8$, $\lambda_2 = 0$. First eigenvector: $\mathbf{v}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix}1\\1\end{bmatrix}$.

All variance is along the diagonal — the data is perfectly 1D.

## Key Properties

$$\text{Variance explained by PC}_k = \frac{\lambda_k}{\sum_i \lambda_i}$$

$$\text{Reconstruction error} = \sum_{i=k+1}^d \lambda_i$$

$$\text{PCs are orthogonal: } \mathbf{v}_i^\top \mathbf{v}_j = 0 \text{ for } i \neq j$$

## Why It Works

The eigenvectors of $\hat\Sigma$ maximize variance because the variance of the projection $\mathbf{v}^\top\tilde{X}^\top\tilde{X}\mathbf{v}/(n-1) = \mathbf{v}^\top\hat\Sigma\mathbf{v}$ is a Rayleigh quotient, maximized by the top eigenvector. Orthogonality of successive PCs follows from the spectral theorem for symmetric matrices.

## Bridge to Other Domains

> **→ Linear Algebra + Statistics (bridge concept):** PCA sits at the intersection of both. The algorithm is the eigendecomposition of the covariance matrix — pure linear algebra. The objective (maximise variance, minimise reconstruction error) is a statistical criterion. Neither course teaches PCA completely; the connection between the two framings is the bridge.
> *Why it matters:* PCA is the canonical example of why knowing both linear algebra and statistics simultaneously is more powerful than knowing either alone.

> **→ Information Theory:** The number of bits needed to transmit the compressed representation relates to the entropy of the projected distribution. PCA compression is optimal (in the linear, MSE sense) by the rate-distortion theorem for Gaussian sources.
> *Why it matters:* PCA is the information-theoretically optimal linear compressor — this justifies its use beyond just "reducing dimensions."

## Where It Appears

- Dimensionality reduction before downstream ML tasks
- Data visualisation in 2D or 3D
- Noise reduction in signal processing (Karhunen-Loève transform)
- Face recognition (Eigenfaces)
- Genomics — identifying population structure from SNP data

## Common Confusions

> ⚠ You might think **PCA finds directions that separate classes** — but PCA maximises variance, not class separability. For supervised tasks, Linear Discriminant Analysis (LDA) is usually more appropriate than PCA.

## Guru's Note

PCA is not a black box — it is just an eigendecomposition of the covariance matrix, and every choice it makes (which directions, how many) has a direct geometric interpretation.
