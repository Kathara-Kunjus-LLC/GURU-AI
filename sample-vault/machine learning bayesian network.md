---
title: machine learning bayesian network
domain: machine learning
parent-domain: computer science
source: "Pattern Recognition and Machine Learning, Ch. 8"
prereqs: ["[[probability bayes theorem]]", "[[probability conditional probability]]"]
builds-into: []
related: ["[[machine learning naive bayes classifier]]"]
---

# Machine Learning Bayesian Network

## Plain English

A graph where nodes are random variables and arrows encode direct causal or conditional dependencies, allowing a complex joint distribution to be represented compactly.

## Intuition

Draw a graph where an arrow from $A$ to $B$ means "$A$ directly influences $B$." The absence of an arrow encodes an independence assumption — not just a correlation near zero, but a structural claim that $A$ and $B$ are conditionally independent given their parents. The graph turns a high-dimensional joint distribution into a product of manageable local factors.

## Formal Definition

> **Definition:**
> A Bayesian network is a directed acyclic graph (DAG) where nodes are random variables $X_1,\ldots,X_n$. The joint distribution factorises as:
> $$P(X_1, \ldots, X_n) = \prod_{i=1}^n P(X_i \mid \text{parents}(X_i))$$
>
> Three canonical structures for nodes $A, B, C$:
> - **Chain** $A \to B \to C$: $A \perp C \mid B$
> - **Fork** $A \leftarrow B \rightarrow C$: $A \perp C \mid B$
> - **Collider** $A \to C \leftarrow B$: $A \perp B$ marginally, but $A \not\perp B \mid C$

## Worked Example

Simple medical network: $\text{Disease} \to \text{Test}, \text{Disease} \to \text{Symptom}$.

$$P(\text{Disease}, \text{Test}, \text{Symptom}) = P(\text{Disease})\,P(\text{Test} \mid \text{Disease})\,P(\text{Symptom} \mid \text{Disease})$$

Given disease status, test result and symptom are conditionally independent — knowing both provides no more information than knowing either alone (once disease is known).

Number of parameters: $1 + 2 + 2 = 5$ instead of $2^3 - 1 = 7$ for the full joint table.

## Key Properties

$$P(X_1,\ldots,X_n) = \prod_{i=1}^n P(X_i \mid \text{parents}(X_i))$$

$$A \to B \to C \implies A \perp C \mid B \quad \text{(d-separation: chain)}$$

$$A \to C \leftarrow B \implies A \not\perp B \mid C \quad \text{(collider opens on conditioning)}$$

## Why It Works

The factorisation follows from the chain rule of probability applied iteratively with the Markov condition: each variable is independent of its non-descendants given its parents. The DAG structure makes the conditional independence structure explicit and checkable — d-separation provides a graphical criterion for reading off independencies directly from the graph.

## Bridge to Other Domains

> **→ Probability Theory + Graph Theory:** Bayesian networks sit at the intersection of probability theory (conditional independence, Bayes' theorem) and graph theory (DAG structure, d-separation). The independences are probabilistic facts; the graph is the data structure for representing and querying them efficiently.
> *Why it matters:* Neither probability nor graph theory alone can express the structure a Bayesian network encodes — the combination is the point.

> **→ Causal Inference:** A Bayesian network with a causal interpretation (arrows represent causal mechanisms) supports interventional reasoning via the do-calculus. Observational conditioning $P(Y \mid X)$ differs from interventional $P(Y \mid do(X))$ — the latter requires the causal graph.
> *Why it matters:* The same mathematical object (a DAG with probabilities) supports both purely associational and causal reasoning depending on interpretation.

## Where It Appears

- Medical diagnosis — reasoning about diseases, tests, and symptoms
- Causal inference — estimating treatment effects from observational data
- Natural language processing — early generative models
- Gene regulatory networks — modeling gene expression dependencies

## Common Confusions

> ⚠ You might think **"Bayesian network" means it uses Bayesian inference** — but the "Bayesian" refers to Bayes' theorem underpinning the conditional probabilities. A Bayesian network can be used with frequentist parameter estimation.

## Guru's Note

The collider structure is the one that surprises everyone: conditioning on a common effect creates dependence between otherwise independent causes — this is why controlling for a collider in regression creates spurious correlations.
