---
title: machine learning principal component analysis
domain: machine learning
parent-domain: computer science
source: Pattern Recognition and Machine Learning, Ch. 12
prereqs: ["[[linear algebra eigendecomposition]]", "[[statistics covariance matrix]]", "[[linear algebra eigenvectors]]"]
builds-into: []
related: ["[[linear algebra singular value decomposition]]", "[[machine learning gaussian mixture model]]"]
---

## Definition

PCA finds a linear projection that maximises the variance of the projected data. Given data $X \in \mathbb{R}^{n \times d}$, the principal components are the eigenvectors of the sample covariance matrix, ordered by decreasing eigenvalue.

## Intuition

If you shine a light on a cloud of data points and watch the shadow, PCA finds the angle that makes the shadow as spread out as possible. The first PC is the direction of greatest spread; the second PC is the direction of greatest spread orthogonal to the first, and so on.

## Formal notation

1. Centre the data: $\tilde{X} = X - \bar{X}$
2. Compute covariance: $\hat\Sigma = \frac{1}{n-1}\tilde{X}^\top\tilde{X}$
3. Eigendecompose: $\hat\Sigma = V\Lambda V^\top$
4. Project to $k$ dimensions: $Z = \tilde{X} V_k$

Reconstruction: $\hat X = Z V_k^\top + \bar{X}$.

## Bridge to other domains

PCA sits at the intersection of **linear algebra** and **statistics**. The algorithm is the eigendecomposition of the covariance matrix — a pure linear algebra operation. The *objective* (maximise variance, minimise reconstruction error) is a statistical criterion. Neither course teaches PCA fully; the connection between the two framings is the bridge.

In **information theory**, the number of bits needed to transmit the compressed representation is related to the entropy of the projected distribution — PCA compression is optimal (in the linear, MSE sense) by this measure.

In **signal processing**, PCA applied to multichannel signals is equivalent to the Karhunen-Loève transform — the decorrelating transform that achieves optimal linear compression.

## Where it appears

Dimensionality reduction, data visualisation (2D/3D projections), noise reduction, face recognition (Eigenfaces), collaborative filtering.

## Common confusions

PCA finds directions of maximum variance, not maximum class separability. For classification, LDA (Linear Discriminant Analysis) is often more appropriate.
