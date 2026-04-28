---
title: probability sample space
domain: probability
parent-domain: mathematics
source: "Introduction to Probability, Ch. 1"
prereqs: []
builds-into: ["[[probability conditional probability]]", "[[probability bayes theorem]]"]
related: ["[[statistics gaussian distribution]]"]
---

# Probability Sample Space

## Plain English

The complete list of everything that could possibly happen in a random experiment.

## Intuition

Before rolling a die, write down every face: {1, 2, 3, 4, 5, 6}. That list is the sample space — the universe of possibilities before any outcome is observed. An event is just a highlighted subset of that list.

## Formal Definition

> **Definition:**
> A sample space $\Omega$ is the set of all possible outcomes of a random experiment. An event $A$ is any subset $A \subseteq \Omega$.
>
> A probability measure $P: 2^\Omega \to [0,1]$ assigns a number to every event, satisfying:
> $$P(\Omega) = 1$$
> $$P(A \cup B) = P(A) + P(B) \quad \text{ when } A \cap B = \emptyset$$

## Worked Example

Roll a fair six-sided die. Define event $A$ = "roll an even number."

$$\Omega = \{1, 2, 3, 4, 5, 6\}$$

$$A = \{2, 4, 6\}$$

$$P(A) = \frac{|A|}{|\Omega|} = \frac{3}{6} = 0.5$$

## Key Properties

$$P(\Omega) = 1$$

$$P(\emptyset) = 0$$

$$P(A^c) = 1 - P(A)$$

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

## Why It Works

Probability is defined as a measure over a set. Requiring $P(\Omega) = 1$ means certainty that *something* happens. Additivity over disjoint events mirrors the intuition that non-overlapping possibilities should add up.

## Bridge to Other Domains

> **→ Information Theory:** The sample space maps directly to an alphabet — the set of symbols a source can emit. The probability measure over $\Omega$ becomes the source distribution $P(X)$, and entropy $H(X) = -\sum_x P(x)\log P(x)$ is defined over it.
> *Why it matters:* Every information-theoretic quantity is built on top of a sample space.

> **→ Measure Theory:** A sample space equipped with a $\sigma$-algebra and a probability measure forms a probability space — the rigorous foundation underlying all of modern statistics and stochastic analysis.
> *Why it matters:* Understanding measure theory explains why probability works for continuous outcomes, where listing individual elements is impossible.

## Where It Appears

- Probability — foundation of every probabilistic model
- Statistics — sample space defines what the data-generating process can produce
- Information theory — source alphabets and entropy
- Machine learning — the outcome space of any stochastic model

## Common Confusions

> ⚠ You might think **the sample space is just "all the likely outcomes"** — but actually it must include every possible outcome, including rare ones. Omitting low-probability events makes the model technically incorrect.

## Guru's Note

Always define your sample space explicitly before doing any probability calculation — ambiguous sample spaces are the root cause of most probability paradoxes.
