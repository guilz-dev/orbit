# RFC / Design Doc Knowledge

RFCs and design docs align stakeholders before implementation on goals, architecture, trade-offs, rollout, and open questions.

## What a Good RFC Covers

| Section | Guidance |
|---------|----------|
| Problem and goals | Why this work exists and what success means |
| Non-goals | What is explicitly out of scope |
| Proposed design | Main architecture, flows, contracts, and data shape |
| Alternatives | Serious alternatives and why they lost |
| Rollout / migration | Flags, compatibility, rollback, operational checkpoints |
| Open questions | What still needs evidence or a decision |

## Review Quality

| Concern | Guidance |
|---------|----------|
| Audience | Write for reviewers making a decision, not only for the author |
| Traceability | Link requirements, prior ADRs, incidents, or benchmarks when relevant |
| Decision readiness | Highlight the actual choices to be approved |
| Maintenance | Record outcome or final decision, not just proposal text |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Long document with no explicit decision points | Reviewers cannot converge |
| Only ideal-state architecture, no rollout path | High implementation risk |
| No rejected alternatives | Trade-offs stay hidden |
| Doc becomes stale immediately after acceptance | Team stops trusting docs |
