---
title: probability independence
domain: probability
parent-domain: mathematics
source: Introduction to Probability, Ch. 2
prereqs: ["[[probability conditional probability]]"]
builds-into: ["[[machine learning naive bayes classifier]]"]
related: ["[[statistics covariance matrix]]"]
---

## Definition

Events $A$ and $B$ are independent if:

$$P(A \cap B) = P(A)\,P(B)$$

Equivalently, $P(A \mid B) = P(A)$ — knowing $B$ occurred gives no information about $A$.

## Intuition

Two coin flips are independent. Knowing the first came up heads tells you nothing about the second.

## Formal notation

Random variables $X$ and $Y$ are independent if their joint distribution factorises:

$$P(X = x,\, Y = y) = P(X = x)\,P(Y = y) \quad \forall x, y$$

## Bridge to other domains

In **linear algebra**, independence of random variables is related to but distinct from linear independence of vectors. Two vectors can be linearly independent while the corresponding random variables are dependent, and vice versa.

In **statistics**, covariance measures linear dependence. Zero covariance implies no linear relationship but not independence — unless the variables are jointly Gaussian.

## Where it appears

Naive Bayes, graphical model factorisation, independent component analysis.

## Common confusions

Uncorrelated $\neq$ independent. Correlation captures only linear dependence. $X$ and $X^2$ are uncorrelated (for symmetric distributions) but clearly dependent.
