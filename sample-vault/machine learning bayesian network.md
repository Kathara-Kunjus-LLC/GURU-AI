---
title: machine learning bayesian network
domain: machine learning
parent-domain: computer science
source: Pattern Recognition and Machine Learning, Ch. 8
prereqs: ["[[probability bayes theorem]]", "[[probability conditional probability]]"]
builds-into: []
related: ["[[machine learning naive bayes classifier]]"]
---

## Definition

A Bayesian network is a directed acyclic graph (DAG) where nodes are random variables and edges encode conditional dependencies. The joint distribution factorises as:

$$P(X_1, \ldots, X_n) = \prod_{i=1}^n P(X_i \mid \text{parents}(X_i))$$

## Intuition

Draw a graph where an arrow from $A$ to $B$ means "$A$ directly influences $B$." The absence of an arrow encodes a conditional independence assumption. The graph turns a high-dimensional joint distribution into a product of manageable local factors.

## Formal notation

Three canonical structures (for nodes $A \to B \to C$, $A \leftarrow B \rightarrow C$, $A \rightarrow C \leftarrow B$):
- **Chain**: $A \perp C \mid B$
- **Fork**: $A \perp C \mid B$
- **Collider**: $A \not\perp C \mid B$ (conditioning on a collider *opens* the path)

## Bridge to other domains

Bayesian networks bridge **probability theory**, **graph theory**, and **machine learning**. The independence structure comes from probability; the graph representation from graph theory; inference algorithms (belief propagation, variational inference) from machine learning.

## Where it appears

Medical diagnosis systems, causal inference, natural language processing (early models), gene regulatory network modelling.

## Common confusions

Bayesian networks do not require "Bayesian" (prior/posterior) reasoning — the name refers to Bayes' theorem underpinning the conditional probabilities, not to the inference approach used.
