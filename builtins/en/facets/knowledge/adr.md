# ADR Knowledge

Architecture Decision Records (ADRs) capture durable technical decisions so future changes know what was chosen, why, and under what constraints.

## When to Write an ADR

| Situation | Guidance |
|-----------|----------|
| Decision changes architecture, dependency direction, or operating model | Write an ADR |
| Decision is costly to reverse | Write an ADR |
| Decision settles competing options | Record the options and why one won |
| Purely local implementation detail | Usually not an ADR |

## Good ADR Structure

| Section | Purpose |
|---------|---------|
| Context | What problem or pressure forced the decision |
| Decision | What was chosen |
| Alternatives | What was considered and rejected |
| Consequences | Trade-offs, follow-up work, operational impact |
| Status | Proposed / accepted / superseded |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| ADR says what but not why | Future teams cannot evaluate whether it still applies |
| Giant design doc used as an ADR with no decision summary | Hard to reference |
| No status / superseded path | Old decisions remain falsely authoritative |
| ADR written after everyone forgot the trade-offs | History becomes fiction |
