# Model Evaluation Knowledge

Model evaluation must reflect the real decision context. Metric quality without decision quality is not enough.

## Metric and Objective Alignment

| Criteria | Judgment |
|----------|----------|
| Metric does not map to the business objective | REJECT |
| Single metric used where trade-offs matter (e.g. precision vs recall) | Warning |
| No threshold selection rationale | Warning |
| No segment-level evaluation for critical cohorts | REJECT |

- Define primary metric, guardrail metrics, and operating threshold together.
- Evaluate by segment (region, device, user type, risk tier) where harm can differ.

## Validation Strategy

| Check | Guidance |
|-------|----------|
| Holdout design | Preserve temporal and group leakage boundaries |
| Cross-validation use | Use when data size/variance requires robustness checks |
| Statistical confidence | Report interval, not only point estimate |
| Baseline comparison | Show deltas against baseline and previous production model |

## Failure Analysis

| Anti-pattern | Problem |
|--------------|---------|
| Shipping from offline score only | Offline/online gap ignored |
| No false-positive/false-negative review | Unknown error costs |
| Ignoring calibration and ranking quality | Poor downstream decision quality |
| No post-release shadow or canary check | Risky rollout |
