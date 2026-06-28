# Indexing & Query Tuning Knowledge

Indexing and tuning start from real access patterns, not from adding indexes blindly.

## Index Design

| Concern | Guidance |
|---------|----------|
| Query pattern | Index for actual `WHERE`, join, sort, and pagination paths |
| Selectivity | High-selectivity leading columns help most |
| Composite order | Match the query prefix and sort order intentionally |
| Write cost | Every index speeds reads but slows writes and increases storage |

## Query Review

| Topic | Guidance |
|-------|----------|
| Explain plan | Inspect scans, filters, join strategy, sort, and row estimates |
| Pagination | Prefer stable keyset pagination for large datasets |
| Projection | Select only needed columns, especially on hot paths |
| N+1 | Watch ORM-generated query storms and hidden lazy loads |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Adding indexes after the fact with no workload reasoning | Index bloat and little real gain |
| Offset pagination on huge tables | Slow scans and unstable performance |
| Filtering on computed or mismatched types unnecessarily | Index bypass |
| Tuning from one local sample only | Wrong conclusions at production scale |
