---
title: probability independence
domain: probability
parent-domain: mathematics
source: "Introduction to Probability, Ch. 2"
prereqs: ["[[probability conditional probability]]"]
builds-into: ["[[machine learning naive bayes classifier]]"]
related: ["[[statistics covariance matrix]]"]
---

# Probability Independence

## Plain English

Two events are independent when knowing one happened tells you nothing about whether the other happened.

## Intuition

Flip a coin twice. The first flip landing heads gives you zero information about the second flip. The coin has no memory. Contrast this with drawing cards without replacement — knowing the first card was an ace changes the probability of the second being an ace.

## Formal Definition

> **Definition:**
> Events $A$ and $B$ are **independent** if:
> $$P(A \cap B) = P(A)\,P(B)$$
>
> Equivalently, $P(A \mid B) = P(A)$ — conditioning on $B$ does not change the probability of $A$.
>
> Random variables $X$ and $Y$ are independent if their joint distribution factorises:
> $$P(X = x,\, Y = y) = P(X = x)\,P(Y = y) \quad \forall x, y$$

## Worked Example

Roll two fair dice. $A$ = "first die shows 3", $B$ = "second die shows 5."

$$P(A) = \frac{1}{6}, \quad P(B) = \frac{1}{6}$$

$$P(A \cap B) = \frac{1}{36}$$

$$P(A) \cdot P(B) = \frac{1}{6} \cdot \frac{1}{6} = \frac{1}{36} \checkmark$$

The product rule holds — the dice are independent.

## Key Properties

$$P(A \cap B) = P(A)\,P(B)$$

$$P(A \mid B) = P(A)$$

$$P(A_1 \cap \cdots \cap A_n) = \prod_{i=1}^n P(A_i) \quad \text{(mutual independence)}$$

## Why It Works

If knowing $B$ occurred genuinely provides no information about $A$, then $P(A \mid B) = P(A)$. Substituting the definition of conditional probability gives $P(A \cap B)/P(B) = P(A)$, which rearranges to $P(A \cap B) = P(A)P(B)$. The joint probability factorising is the direct mathematical statement of "no shared information."

## Bridge to Other Domains

> **→ Linear Algebra:** Independence of random variables is related to but distinct from linear independence of vectors. Two random variables can be linearly dependent (correlated) yet statistically independent, and vectors can be linearly independent while the corresponding random variables are dependent.
> *Why it matters:* Conflating the two types of independence is a common error when moving between probability and linear algebra.

> **→ Statistics:** Covariance measures linear dependence; zero covariance does not imply independence. However, for jointly Gaussian variables, zero covariance *does* imply independence — because the Gaussian is fully characterized by its first and second moments.
> *Why it matters:* The Gaussian is special; techniques that work for Gaussians often fail for other distributions.

## Where It Appears

- Naive Bayes — conditional independence assumption over features
- Graphical models — missing edges encode independence
- Independent component analysis — finds statistically independent sources
- Probability calculations — simplifies joint probabilities enormously

## Common Confusions

> ⚠ You might think **uncorrelated means independent** — but actually zero correlation only means no *linear* relationship. $X$ and $X^2$ are uncorrelated (for symmetric distributions around 0) but clearly dependent.

## Guru's Note

Independence is the assumption that makes probability tractable — always ask whether it's actually justified before using it.
