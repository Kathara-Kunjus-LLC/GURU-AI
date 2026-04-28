---
title: machine learning naive bayes classifier
domain: machine learning
parent-domain: computer science
source: Pattern Recognition and Machine Learning, Ch. 4
prereqs: ["[[probability bayes theorem]]", "[[probability independence]]"]
builds-into: []
related: ["[[machine learning bayesian network]]"]
---

## Definition

Naive Bayes classifies by applying Bayes' theorem with the "naive" assumption that features are conditionally independent given the class label:

$$P(y \mid x_1,\ldots,x_n) \propto P(y)\prod_{i=1}^n P(x_i \mid y)$$

## Intuition

To classify a document as spam, multiply the prior probability of spam by the probability of each word appearing in spam messages. The "naive" part: assume word probabilities are independent of each other given the class.

## Formal notation

The decision rule is:

$$\hat y = \arg\max_y \left[\log P(y) + \sum_i \log P(x_i \mid y)\right]$$

Using log-probabilities avoids numerical underflow when multiplying many small probabilities.

## Bridge to other domains

Naive Bayes bridges **probability theory** and **machine learning**. It is a probabilistic model derived directly from Bayes' theorem and conditional independence — both probability concepts — packaged as a classification algorithm. The conditional independence assumption corresponds to a fully disconnected graphical model (Bayesian network with no edges among features).

## Where it appears

Text classification, spam filtering, medical diagnosis, real-time classification where computational efficiency matters.

## Common confusions

Despite the "naive" independence assumption being almost always wrong, Naive Bayes performs surprisingly well in practice — especially when the goal is classification (not probability estimation) and the decision boundary is what matters.
