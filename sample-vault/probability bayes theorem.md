---
title: probability bayes theorem
domain: probability
parent-domain: mathematics
source: "Introduction to Probability, Ch. 2"
prereqs: ["[[probability conditional probability]]", "[[probability sample space]]"]
builds-into: ["[[machine learning naive bayes classifier]]", "[[machine learning bayesian network]]"]
related: ["[[statistics gaussian distribution]]", "[[probability independence]]"]
---

# Probability Bayes Theorem

## Plain English

A rule for updating your belief about something after seeing new evidence.

## Intuition

Start with a belief about how likely something is. Observe evidence. Multiply your belief by how well that hypothesis predicted the evidence, then normalize. The result is your updated belief. It's a machine for converting "how likely was this evidence if my theory is true?" into "how likely is my theory now that I've seen this evidence?"

## Formal Definition

> **Definition:**
> $$P(H \mid E) = \frac{P(E \mid H)\,P(H)}{P(E)}$$
>
> Where:
> - $P(H)$ is the **prior** — your belief before seeing evidence
> - $P(E \mid H)$ is the **likelihood** — how probable the evidence is if $H$ is true
> - $P(H \mid E)$ is the **posterior** — your updated belief
> - $P(E) = \sum_h P(E \mid H{=}h)\,P(H{=}h)$ is the **marginal likelihood** (normalizing constant)

## Worked Example

A disease affects 1% of the population. A test is 90% sensitive (true positive rate) and 95% specific (true negative rate). You test positive. What is the probability you have the disease?

$$P(D) = 0.01, \quad P(\text{pos} \mid D) = 0.90, \quad P(\text{pos} \mid \neg D) = 0.05$$

$$P(\text{pos}) = 0.90 \times 0.01 + 0.05 \times 0.99 = 0.009 + 0.0495 = 0.0585$$

$$P(D \mid \text{pos}) = \frac{0.90 \times 0.01}{0.0585} \approx 0.154$$

Despite testing positive, there is only a 15% chance you have the disease — because the base rate is so low.

## Key Properties

$$P(H \mid E) \propto P(E \mid H)\,P(H)$$

$$\sum_h P(H{=}h \mid E) = 1$$

$$P(E) = \sum_h P(E \mid H{=}h)\,P(H{=}h)$$

## Why It Works

The theorem follows directly from the definition of conditional probability applied twice: $P(H \mid E) = P(H \cap E)/P(E)$ and $P(E \mid H) = P(H \cap E)/P(H)$. Dividing one by the other and rearranging gives Bayes' theorem. The insight is that updating beliefs is just renormalization after incorporating new information.

## Bridge to Other Domains

> **→ Statistics:** Bayesian inference treats parameters as random variables with prior distributions updated by data. This is a complete alternative to frequentist statistics. The posterior $P(\theta \mid \text{data}) \propto P(\text{data} \mid \theta)\,P(\theta)$ is the central object.
> *Why it matters:* It provides a principled way to incorporate prior knowledge and quantify uncertainty in parameter estimates.

> **→ Machine Learning:** MAP (maximum a posteriori) estimation is Bayes' theorem applied to parameter learning: $\hat\theta = \arg\max_\theta P(\theta \mid \text{data}) = \arg\max_\theta [P(\text{data} \mid \theta)\,P(\theta)]$. L2 regularization corresponds to a Gaussian prior.
> *Why it matters:* Regularization has a probabilistic interpretation as imposing a prior on parameters.

> **→ Information Theory:** The KL divergence $D_{KL}(P \| Q) = \sum P(x)\log\frac{P(x)}{Q(x)}$ measures how much information is gained moving from prior $Q$ to posterior $P$.
> *Why it matters:* Bayesian updating is equivalent to minimizing KL divergence from the true distribution.

## Where It Appears

- Spam filtering — posterior probability of spam given word frequencies
- Medical diagnosis — posterior probability of disease given test results
- A/B testing — Bayesian hypothesis testing
- Kalman filters — recursive Bayesian estimation of state
- Neural networks — Bayesian neural networks with weight posteriors

## Common Confusions

> ⚠ You might think **the prior $P(H)$ is arbitrary and makes results subjective** — but actually the posterior converges to the true distribution as data grows regardless of the prior (as long as the prior has nonzero mass everywhere). Priors matter most when data is scarce.

## Guru's Note

The most important number in Bayes' theorem is usually the one people forget: the base rate $P(H)$.
