---
title: probability conditional probability
domain: probability
parent-domain: mathematics
source: "Introduction to Probability, Ch. 2"
prereqs: ["[[probability sample space]]"]
builds-into: ["[[probability bayes theorem]]", "[[probability independence]]"]
related: ["[[statistics covariance matrix]]"]
---

# Probability Conditional Probability

## Plain English

The probability of one event happening, given that you already know another event has occurred.

## Intuition

Conditioning shrinks the sample space. If you know a rolled die showed an even number, you now only care about {2, 4, 6} — you've thrown out the other half of the universe and renormalized what remains.

## Formal Definition

> **Definition:**
> The conditional probability of event $A$ given event $B$ (with $P(B) > 0$) is:
> $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$
>
> The chain rule generalizes this to many events:
> $$P(A_1 \cap \cdots \cap A_n) = P(A_1)\,P(A_2 \mid A_1)\,\cdots\,P(A_n \mid A_1,\ldots,A_{n-1})$$

## Worked Example

Roll a fair die. $A$ = "result is greater than 3", $B$ = "result is even."

$$P(B) = \frac{3}{6} = 0.5, \quad A \cap B = \{4, 6\}, \quad P(A \cap B) = \frac{2}{6}$$

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)} = \frac{2/6}{3/6} = \frac{2}{3} \approx 0.667$$

Knowing the die is even raises the probability of "greater than 3" from $0.5$ to $0.667$.

## Key Properties

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

$$P(A \cap B) = P(A \mid B)\,P(B) = P(B \mid A)\,P(A)$$

$$\sum_i P(A_i \mid B) = 1 \quad \text{ when } \{A_i\} \text{ partition } \Omega$$

## Why It Works

Dividing by $P(B)$ renormalizes so that the probabilities of all outcomes inside $B$ sum to 1. The numerator $P(A \cap B)$ picks out the outcomes that satisfy both conditions. The formula is the minimal change to the probability model that reflects knowing $B$ occurred.

## Bridge to Other Domains

> **→ Machine Learning:** Conditional probability is the direct building block of generative models. $P(\text{data} \mid \text{model})$ is the likelihood; $P(\text{model} \mid \text{data})$ is the posterior. Naive Bayes assumes $P(x_1,\ldots,x_n \mid y) = \prod_i P(x_i \mid y)$.
> *Why it matters:* Almost every learning algorithm is optimizing a conditional probability in some form.

> **→ Causal Inference:** $P(Y \mid X)$ (observational conditioning) differs from $P(Y \mid do(X))$ (intervention). Conditioning on a variable is not the same as setting it — a critical distinction when making policy decisions from observational data.
> *Why it matters:* Confusing conditioning with causation leads to Simpson's paradox and flawed policy recommendations.

## Where It Appears

- Bayesian inference — posterior as updated conditional
- Hidden Markov models — emission and transition probabilities
- Decision trees — splits maximize conditional purity
- Causal inference — interventional vs observational distributions

## Common Confusions

> ⚠ You might think **$P(A \mid B) = P(B \mid A)$** — but they are almost never equal. The asymmetry is exactly what Bayes' theorem corrects: $P(A \mid B) = P(B \mid A)\,P(A)/P(B)$.

## Guru's Note

Conditional probability is where probability becomes useful — almost every real question is about what happens given what you already know.
