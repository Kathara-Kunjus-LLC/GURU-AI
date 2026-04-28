---
title: probability sample space
domain: probability
parent-domain: mathematics
source: Introduction to Probability, Ch. 1
prereqs: []
builds-into: ["[[probability conditional probability]]", "[[probability bayes theorem]]"]
related: ["[[statistics gaussian distribution]]"]
---

## Definition

A sample space $\Omega$ is the set of all possible outcomes of a random experiment. An event $A$ is any subset of $\Omega$.

## Intuition

Roll a die: the sample space is $\{1, 2, 3, 4, 5, 6\}$. The event "roll an even number" is the subset $\{2, 4, 6\}$.

## Formal notation

$$P: 2^\Omega \to [0,1]$$

A probability measure assigns a number in $[0,1]$ to every event, satisfying:
- $P(\Omega) = 1$
- $P(A \cup B) = P(A) + P(B)$ when $A \cap B = \emptyset$

## Bridge to other domains

In **information theory**, sample spaces map directly to alphabets — the set of symbols a source can emit. The probability measure over the sample space becomes the source distribution $P(X)$, and entropy $H(X) = -\sum P(x)\log P(x)$ is defined over it.

In **measure theory**, a sample space with a $\sigma$-algebra and probability measure is a probability space — the rigorous foundation underlying all of statistics.

## Where it appears

Everywhere in probability and statistics. Every probabilistic model begins with a sample space.

## Common confusions

The sample space must contain every possible outcome. Forgetting rare events (e.g., "the die lands on edge") technically makes the model wrong, even if practically negligible.
