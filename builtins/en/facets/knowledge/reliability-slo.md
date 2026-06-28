# Reliability & SLO Knowledge

Reliability work turns vague “stable enough” goals into measurable service objectives. Use this when changes affect latency, availability, background processing, or error recovery.

## SLI / SLO / Error Budget

| Concept | Guidance |
|---------|----------|
| SLI | Choose a user-meaningful indicator: success rate, latency percentile, freshness, backlog age |
| SLO | Define the target numerically and over a clear window |
| Error budget | Treat it as the allowed unreliability used to balance delivery speed and stability work |

- A metric is useful only if a team can act on it.
- Prefer indicators tied to actual user journeys over internal component-only metrics.

## Design Implications

| Reliability concern | Design guidance |
|---------------------|-----------------|
| Timeouts | Every network or storage dependency should have explicit timeouts |
| Retries | Retry only idempotent or safely deduplicated operations |
| Degradation | Define a safe fallback path instead of full outage when possible |
| Backpressure | Protect shared resources with queueing, shedding, or concurrency limits |
| Observability | Add logs, metrics, and traces that show success, failure, and saturation |

## Change Management

| Concern | Guidance |
|---------|----------|
| Release risk | Prefer small, reversible releases with monitoring checkpoints |
| Migrations | Keep schema/data changes compatible across mixed-version rollout windows |
| On-call load | Avoid designs that push hidden manual work onto operators |
| Dependencies | Understand the upstream/downstream failure mode before adding coupling |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| “It probably won't fail” instead of explicit timeout/retry policy | Hidden failure amplification |
| Retrying non-idempotent writes blindly | Duplicate side effects and data corruption |
| No success criteria for recovery | Service looks “up” while user flows are still broken |
| Monitoring only CPU / memory with no user-path signal | Misses functional outages |
