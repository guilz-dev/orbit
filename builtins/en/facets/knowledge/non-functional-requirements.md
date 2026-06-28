# Non-Functional Requirements Knowledge

Non-functional requirements (NFRs) define the quality attributes and operating constraints that shape the design even when core features are unchanged.

## Common NFR Categories

| Category | Examples |
|----------|----------|
| Performance | latency, throughput, startup, memory budget |
| Reliability | availability, durability, recovery time, backlog freshness |
| Security / Privacy | access control, data handling, auditability, retention |
| Operability | monitoring, alerting, runbooks, rollback, supportability |
| Accessibility / Usability | keyboard path, contrast, localization, comprehension |

## Good NFR Practice

| Concern | Guidance |
|---------|----------|
| Measurability | State numbers, thresholds, or binary obligations where possible |
| Scope | Tie each NFR to the affected flow, platform, or component |
| Traceability | Link NFRs to tests, dashboards, or review gates |
| Trade-offs | Record conflicts, such as stronger durability vs higher latency |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| NFRs hidden only in people's heads | Designs optimize for the wrong thing |
| “Fast”, “secure”, “scalable” with no target | Unreviewable |
| No operational owner for an NFR | Gaps appear after launch |
| NFRs added after implementation only | Costly redesign |
