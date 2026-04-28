---
title: statistics gaussian distribution
domain: statistics
parent-domain: mathematics
source: "Pattern Recognition and Machine Learning, Ch. 2"
prereqs: ["[[probability sample space]]"]
builds-into: ["[[statistics covariance matrix]]"]
related: ["[[probability bayes theorem]]"]
---

# Statistics Gaussian Distribution

## Plain English

A symmetric bell-shaped probability distribution fully described by its center and its spread.

## Intuition

Picture a bell. The peak sits at the mean — the most probable value. The width of the bell is controlled by the standard deviation. Narrow bell = measurements cluster tightly; wide bell = measurements spread out. The shape is always symmetric: values equally far above and below the mean are equally likely.

## Formal Definition

> **Definition:**
> The Gaussian (normal) distribution with mean $\mu$ and variance $\sigma^2$:
> $$p(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$
>
> Written $X \sim \mathcal{N}(\mu, \sigma^2)$.
>
> Multivariate Gaussian for $\mathbf{x} \in \mathbb{R}^d$:
> $$p(\mathbf{x}) = \frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}} \exp\!\left(-\tfrac{1}{2}(\mathbf{x}-\boldsymbol\mu)^\top\Sigma^{-1}(\mathbf{x}-\boldsymbol\mu)\right)$$

## Worked Example

$X \sim \mathcal{N}(2, 1)$. Compute the density at $x = 3$.

$$p(3) = \frac{1}{\sqrt{2\pi \cdot 1}} \exp\!\left(-\frac{(3-2)^2}{2 \cdot 1}\right) = \frac{1}{\sqrt{2\pi}} e^{-1/2} \approx \frac{1}{2.507} \times 0.607 \approx 0.242$$

The density at one standard deviation above the mean is approximately $0.242$.

## Key Properties

$$\mathbb{E}[X] = \mu, \quad \text{Var}(X) = \sigma^2$$

$$\mathcal{N}(0,1) \text{ is the standard normal; any Gaussian: } Z = \frac{X-\mu}{\sigma} \sim \mathcal{N}(0,1)$$

$$\text{68-95-99.7 rule: } P(\mu - k\sigma \leq X \leq \mu + k\sigma) \approx \{68\%, 95\%, 99.7\%\} \text{ for } k = \{1,2,3\}$$

## Why It Works

The Central Limit Theorem guarantees that the sum of many independent, finite-variance random variables converges in distribution to a Gaussian — regardless of the original distribution. This is why Gaussians are ubiquitous: many real-world quantities are sums of many small independent effects.

## Bridge to Other Domains

> **→ Information Theory:** The Gaussian maximises entropy among all distributions with fixed mean and variance: $H(\mathcal{N}(\mu,\sigma^2)) = \frac{1}{2}\ln(2\pi e \sigma^2)$. It is the "least informative" distribution given those constraints.
> *Why it matters:* When you model noise as Gaussian, you are implicitly assuming maximum entropy — the weakest possible assumption about the noise structure.

> **→ Machine Learning:** Gaussian Processes extend the Gaussian to distributions over functions. Assuming Gaussian noise in regression leads directly to closed-form posterior inference. GMMs (Gaussian Mixture Models) use superpositions of Gaussians for density estimation.
> *Why it matters:* The Gaussian is the cornerstone of probabilistic machine learning because it admits closed-form calculations that other distributions do not.

## Where It Appears

- Linear regression — Gaussian noise assumption
- Kalman filters — state and observation noise
- Natural language modelling — word embedding distributions
- Portfolio theory — returns modelled as Gaussian (with known limitations)

## Common Confusions

> ⚠ You might think **Gaussian tails are negligible** — but actually many real-world phenomena (financial returns, earthquake magnitudes, network node degrees) have heavy tails. Gaussian models systematically underestimate the probability of extreme events.

## Guru's Note

The Gaussian is not nature's distribution — it is the distribution of ignorance when you only know the mean and variance.
