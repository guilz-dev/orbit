# Reliability Policy

REJECT / APPROVE criteria for runtime reliability and operational safety. Reviewers enforce **only** what is listed here.

## Applicability

Applies when the change affects user-facing availability/latency, background processing, deployment safety, data consistency under failure, or operational recovery.

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| New critical dependency or path has no explicit timeout / failure behavior | REJECT |
| Retries are added to non-idempotent work without dedupe or compensation | REJECT |
| A risky release / migration has no rollback, roll-forward, or compatibility story | REJECT |
| Change can overload shared resources with no backpressure, limit, or queueing strategy | REJECT |
| Critical path change adds no monitoring / alerting / verification signal | REJECT |
| Failure state can corrupt data or leave partial state with no recovery procedure | REJECT |
| Reliability-sensitive behavior change has no regression test or verification evidence | REJECT |
| Extra observability or safer degradation beyond explicit requirements | OK |

## Review Procedure

1. Open the relevant Knowledge sources in full.
2. List every `##` section from those Knowledge sources and this Policy.
3. Match each section against the diff, runtime path, and release/rollback story.
4. APPROVE only when no REJECT criterion is hit.
