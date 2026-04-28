---
title: machine learning naive bayes classifier
domain: machine learning
parent-domain: computer science
source: "Pattern Recognition and Machine Learning, Ch. 4"
prereqs: ["[[probability bayes theorem]]", "[[probability independence]]"]
builds-into: []
related: ["[[machine learning bayesian network]]"]
---

# Machine Learning Naive Bayes Classifier

## Plain English

A classifier that predicts the most probable class for an input by multiplying together the individual probabilities of each feature, assuming all features are independent.

## Intuition

To decide if an email is spam, multiply the prior probability of spam by the probability of each word appearing in a spam email. "Free" and "winner" both have high spam probability; "conference" and "preprint" have low spam probability. Multiplying them all gives a score — whichever class scores highest wins. The "naive" part: we pretend the words are independent of each other given spam/not-spam, which is wrong but works surprisingly well.

## Formal Definition

> **Definition:**
> Given class $y$ and features $x_1, \ldots, x_n$, Naive Bayes applies Bayes' theorem with the conditional independence assumption:
> $$P(y \mid x_1,\ldots,x_n) \propto P(y)\prod_{i=1}^n P(x_i \mid y)$$
>
> The decision rule (using logs for numerical stability):
> $$\hat{y} = \arg\max_y \left[\log P(y) + \sum_i \log P(x_i \mid y)\right]$$

## Worked Example

Classify a message with features $x_1 = \text{"free"}$, $x_2 = \text{"meeting"}$ as spam or not-spam.

$$P(\text{spam}) = 0.4, \quad P(\neg\text{spam}) = 0.6$$

$$P(\text{"free"} \mid \text{spam}) = 0.8, \quad P(\text{"free"} \mid \neg\text{spam}) = 0.1$$

$$P(\text{"meeting"} \mid \text{spam}) = 0.1, \quad P(\text{"meeting"} \mid \neg\text{spam}) = 0.6$$

$$\text{Score(spam)} = 0.4 \times 0.8 \times 0.1 = 0.032$$

$$\text{Score(not-spam)} = 0.6 \times 0.1 \times 0.6 = 0.036$$

Classify as **not-spam** (0.036 > 0.032), despite "free" being spammy — because "meeting" is a strong not-spam signal.

## Key Properties

$$P(y \mid x_1,\ldots,x_n) \propto P(y)\prod_{i=1}^n P(x_i \mid y)$$

$$\hat{y} = \arg\max_y \left[\log P(y) + \sum_i \log P(x_i \mid y)\right]$$

$$\text{Independence assumption: } P(x_1,\ldots,x_n \mid y) = \prod_i P(x_i \mid y)$$

## Why It Works

By assuming conditional independence of features given the class, the joint probability $P(x_1,\ldots,x_n \mid y)$ factorises into a product of univariate probabilities — each easily estimated from training data. Even though the independence assumption is almost always false, the decision boundary is often correct because cancellation of errors is common in symmetric problems.

## Bridge to Other Domains

> **→ Probability Theory:** Naive Bayes is Bayes' theorem with the conditional independence assumption written directly into the likelihood. The classifier is a probabilistic model derived entirely from first-principles probability — the machine learning packaging adds nothing conceptually new.
> *Why it matters:* Understanding Naive Bayes as a direct application of Bayes' theorem (not as an ad-hoc classifier) reveals why it generalises and when it fails.

> **→ Graph Theory:** The conditional independence assumption corresponds to a Bayesian network with no edges among the features — a completely disconnected feature graph given the class label. Adding edges between features recovates more general Bayesian network classifiers.
> *Why it matters:* Naive Bayes is the simplest possible Bayesian network classifier; its assumptions are explicit in the graph structure.

## Where It Appears

- Text classification and spam filtering
- Medical diagnosis from symptom lists
- Real-time classification where computational efficiency matters
- Baseline model in NLP pipelines

## Common Confusions

> ⚠ You might think **Naive Bayes gives calibrated probabilities** — but the independence assumption causes overconfident posteriors. The argmax decision is reliable; the probability values themselves should not be taken literally.

## Guru's Note

The independence assumption is obviously wrong, but the classifier still works — understanding why is a deeper lesson about what matters for classification versus probability estimation.
