---
title: probability conditional probability
domain: probability
parent-domain: mathematics
source: Introduction to Probability, Ch. 2
prereqs: ["[[probability sample space]]"]
builds-into: ["[[probability bayes theorem]]", "[[probability independence]]"]
related: ["[[statistics covariance matrix]]"]
---

## Definition

The conditional probability of event $A$ given event $B$ is:

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0$$

## Intuition

Conditioning shrinks the sample space. When we know $B$ occurred, we restrict attention to outcomes inside $B$ and renormalize.

## Formal notation

The chain rule generalizes this:

$$P(A_1 \cap A_2 \cap \cdots \cap A_n) = P(A_1)\,P(A_2 \mid A_1)\,\cdots\,P(A_n \mid A_1,\ldots,A_{n-1})$$

## Bridge to other domains

In **machine learning**, conditional probability is the direct building block of generative models: $P(\text{data} \mid \text{model})$ is a likelihood, and $P(\text{model} \mid \text{data})$ is the posterior. The Naive Bayes classifier assumes conditional independence of features given the class label.

In **causal inference**, $P(Y \mid X)$ (observational) differs from $P(Y \mid do(X))$ (interventional) — conditioning on a variable is not the same as setting it.

## Where it appears

Bayesian inference, hidden Markov models, graphical models, decision trees.

## Common confusions

$P(A \mid B) \neq P(B \mid A)$. This asymmetry is exactly what Bayes' theorem corrects.
