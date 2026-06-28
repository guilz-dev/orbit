# Feature Engineering Knowledge

Feature engineering defines what the model can learn. Correctness and serving consistency are more important than raw feature count.

## Design Principles

| Criteria | Judgment |
|----------|----------|
| Feature definition differs between training and serving | REJECT |
| Feature has unclear semantic meaning or unit | Warning |
| High-cardinality feature added without regularization strategy | Warning |
| Feature created from unavailable future information | REJECT |

- Keep feature definitions explicit (source, transformation, unit, freshness).
- Prefer robust, stable features over many fragile proxy features.

## Practical Checks

| Check | Guidance |
|-------|----------|
| Missing handling | Define default/imputation policy per feature |
| Encoding strategy | Match data type and cardinality (target, one-hot, embeddings, etc.) |
| Temporal correctness | Use event time, not processing time, for historical features |
| Drift sensitivity | Flag features known to drift quickly for stronger monitoring |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Blindly adding correlated variants of the same signal | Complexity without signal gain |
| Heavy preprocessing only in notebooks | Non-reproducible training/serving mismatch |
| Feature store bypass for production features | Inconsistent online/offline values |
