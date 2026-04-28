---
title: statistics gaussian distribution
domain: statistics
parent-domain: mathematics
source: Pattern Recognition and Machine Learning, Ch. 2
prereqs: ["[[probability sample space]]"]
builds-into: ["[[statistics covariance matrix]]", "[[machine learning gaussian mixture model]]"]
related: ["[[probability bayes theorem]]"]
---

## Definition

The Gaussian (normal) distribution with mean $\mu$ and variance $\sigma^2$ has density:

$$p(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$

Written $X \sim \mathcal{N}(\mu, \sigma^2)$.

## Intuition

The bell curve. Most probability mass sits near the mean; it falls off symmetrically. The standard deviation $\sigma$ controls how wide the bell is.

## Formal notation

Multivariate Gaussian for $\mathbf{x} \in \mathbb{R}^d$:

$$p(\mathbf{x}) = \frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}} \exp\!\left(-\tfrac{1}{2}(\mathbf{x}-\boldsymbol\mu)^\top\Sigma^{-1}(\mathbf{x}-\boldsymbol\mu)\right)$$

## Bridge to other domains

In **probability theory**, the central limit theorem states that the mean of many independent, finite-variance random variables converges to a Gaussian — explaining why Gaussians appear everywhere in nature.

In **information theory**, the Gaussian maximises entropy among all distributions with fixed mean and variance. This makes it the "least informative" distribution given those constraints.

In **machine learning**, Gaussians are the cornerstone of probabilistic models. GPs (Gaussian Processes) extend the Gaussian to functions; GMMs use mixtures of Gaussians for density estimation.

## Where it appears

Linear regression noise models, Kalman filters, Gaussian processes, natural language modelling, portfolio returns.

## Common confusions

Real-world data rarely follows a perfect Gaussian. Heavy tails (financial returns, network degrees) are systematically underestimated by Gaussian models — this has caused real financial losses.
