# MLOps Knowledge

MLOps keeps ML systems reliable across data, model, and infrastructure changes.

## Delivery and Operations

| Criteria | Judgment |
|----------|----------|
| No reproducible training artifact (code, data version, config) | REJECT |
| Manual deployment with no promotion criteria | REJECT |
| No monitoring for data drift / prediction quality | REJECT |
| No rollback or fallback path to previous model | Warning |

- Version code, data snapshot, features, model artifact, and runtime config together.
- Define release stages (offline validation, shadow, canary, full rollout) with explicit gates.

## Monitoring Scope

| Signal | Guidance |
|--------|----------|
| Data drift | Track distribution shift on critical features |
| Concept drift | Track target/outcome relationship changes |
| Prediction quality | Monitor proxy and delayed ground-truth metrics |
| System health | Latency, throughput, error rate, resource use |

## Governance and Risk

| Anti-pattern | Problem |
|--------------|---------|
| Treating model versioning as optional | No auditability or rollback confidence |
| Ignoring lineage from data to model output | Root-cause analysis becomes slow |
| No access control on model/data pipelines | Security and compliance exposure |
| No runbook for degraded quality incident | Slow incident response |
