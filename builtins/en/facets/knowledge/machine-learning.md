# Machine Learning Knowledge

Machine learning should optimize a real product objective, not only model metrics.

## Problem Framing

| Criteria | Judgment |
|----------|----------|
| No clear prediction target, label definition, or decision action | REJECT |
| Model selected before validating whether heuristics/baseline is enough | Warning |
| Training objective disconnected from business objective | REJECT |
| No rollback path when model quality drops | Warning |

- Define who uses the prediction, what decision it changes, and acceptable failure cost.
- Keep a simple baseline (rule model or historical mean) as a reference.

## Dataset and Split Strategy

| Check | Guidance |
|-------|----------|
| Label leakage | Remove future or proxy signals unavailable at inference time |
| Train/validation/test split | Match real production timing and grouping constraints |
| Class imbalance | Use appropriate sampling/weighting and metric selection |
| Feature availability | Ensure every feature exists at serving time |

## Common Failure Modes

| Anti-pattern | Problem |
|--------------|---------|
| Chasing benchmark numbers only | Local optimum, poor product impact |
| Repeated tuning on the same validation set | Overfitting to validation |
| Ignoring calibration | Wrong confidence interpretation |
| Skipping post-deploy monitoring | Silent quality regressions |
