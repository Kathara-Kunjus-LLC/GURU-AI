---
title: probability bayes theorem
domain: probability
parent-domain: mathematics
source: Introduction to Probability, Ch. 2
prereqs: ["[[probability conditional probability]]", "[[probability sample space]]"]
builds-into: ["[[machine learning naive bayes classifier]]", "[[machine learning bayesian network]]"]
related: ["[[statistics gaussian distribution]]", "[[probability independence]]"]
---

## Definition

Bayes' theorem inverts a conditional probability:

$$P(H \mid E) = \frac{P(E \mid H)\,P(H)}{P(E)}$$

- $P(H)$: prior probability of hypothesis $H$
- $P(E \mid H)$: likelihood of evidence $E$ given $H$
- $P(H \mid E)$: posterior probability of $H$ after observing $E$

## Intuition

Start with a belief ($P(H)$). Observe evidence. Update the belief proportionally to how well the hypothesis predicts that evidence.

## Formal notation

The denominator $P(E) = \sum_h P(E \mid H{=}h)\,P(H{=}h)$ is the marginal likelihood, obtained by summing over all hypotheses.

$$P(H \mid E) \propto P(E \mid H)\,P(H)$$

"Posterior is proportional to likelihood times prior."

## Bridge to other domains

In **statistics**, Bayes' theorem underlies Bayesian inference — a complete alternative to frequentist methods. Where frequentists treat parameters as fixed unknowns, Bayesians treat them as random variables with prior distributions updated by data.

In **information theory**, the KL divergence $D_{KL}(P \| Q) = \sum P(x)\log\frac{P(x)}{Q(x)}$ measures how far a posterior is from a prior — it quantifies the information gained by observing the evidence.

In **machine learning**, the maximum a posteriori (MAP) estimate is exactly Bayes' theorem applied to parameter estimation: $\hat\theta_{MAP} = \arg\max_\theta P(\theta \mid \text{data})$.

## Where it appears

Bayesian neural networks, spam filtering, medical diagnosis, A/B testing, Kalman filters.

## Common confusions

The prior $P(H)$ must be specified before seeing data. In practice, the choice of prior is a modelling decision and can substantially affect the posterior when data is sparse.
