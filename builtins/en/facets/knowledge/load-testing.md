# Load Testing Knowledge

Load testing evaluates how a system behaves under expected and stressed concurrency, throughput, and data volume.

## Workload Modeling

| Concern | Guidance |
|---------|----------|
| User mix | Model realistic read/write/background proportions |
| Traffic shape | Include steady state, bursts, ramps, and recovery |
| Data scale | Test with representative payload size and cardinality |
| SLO linkage | Tie the test to latency, error rate, and saturation objectives |

## What to Observe

| Signal | Why it matters |
|--------|----------------|
| Latency percentiles | Averages hide tail pain |
| Error rate | Reveals overload and dependency collapse |
| Saturation | CPU, memory, threads, DB connections, queue depth |
| Recovery | Whether the system returns to normal after load is removed |

## Experiment Discipline

- Change one main variable at a time when diagnosing bottlenecks.
- Keep the environment close enough to production to make the result meaningful.
- Record test profile, environment, limits, and observed bottleneck.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Load test only with tiny data and ideal cache state | Misses production bottlenecks |
| Report only average latency | Tail failures stay hidden |
| Stress a dependency with no rate limit or cleanup plan | Test damages the environment |
| No acceptance threshold before running the test | Results become non-actionable |
