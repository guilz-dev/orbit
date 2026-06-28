# Performance Knowledge

Cross-cutting performance patterns. Descriptive; measurement comes before optimization.

## Method

| Criteria | Judgment |
|----------|----------|
| Optimizing without a measurement / profile first | REJECT (premature) |
| No baseline metric before/after a perf change | Warning |
| Micro-optimizing cold paths while hot paths are ignored | Warning |
| Caching added without an invalidation strategy | REJECT |

- Measure first (profiler, traces, query logs). Optimize the proven hot path, then re-measure.
- Every cache needs a defined TTL and invalidation rule; stale data is a correctness bug.

## Common Hot Spots

| Area | Pattern |
|------|---------|
| Data access | N+1 queries → batch/join; missing index → add; `SELECT *` → narrow |
| I/O | Sequential awaits that could be parallel; chatty network round trips |
| CPU | Repeated work that could be memoized; work in a loop that could be hoisted |
| Payload | Over-fetching; no pagination; uncompressed responses |
| Memory | Unbounded caches/collections; leaks from un-removed listeners |

| Criteria | Judgment |
|----------|----------|
| N+1 query pattern on a hot path | REJECT |
| Blocking call on a latency-critical async path | REJECT |
| Loading an entire dataset to compute an aggregate | REJECT (push down to the store) |
| Unbounded in-memory cache (no eviction) | REJECT |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Premature optimization | Complexity with no measured gain |
| Cache without invalidation | Stale/incorrect data |
| Fixing perf by adding hardware only | Masks the real cost |
| Optimizing readability away for unproven speed | Maintainability loss |
