# Event-Driven Data Knowledge

Event-driven systems treat events as facts and must design for asynchronous delivery, duplicate processing, and read-model lag.

## Core Concepts

| Concept | Guidance |
|---------|----------|
| Fact event | Emit what happened, not what a consumer should do |
| Idempotency | Consumers must tolerate replay and duplicate delivery |
| Ordering | Be explicit about per-aggregate ordering guarantees and where none exist |
| Projection lag | Read models may be eventually consistent; design UX and workflows accordingly |

## Reliability Patterns

| Pattern | Guidance |
|---------|----------|
| Outbox | Persist data change and event publication intent together |
| Dead-letter / retry | Classify transient vs permanent failure and keep poison messages visible |
| Versioning | Add fields compatibly and evolve consumers gradually |
| Rebuild | Make projections replayable from source events when practical |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Events that depend on one exact consumer behavior | Tight coupling |
| Consumer side effects without idempotency key or dedupe | Duplicate work / corruption |
| Assuming synchronous consistency across services | Race conditions and user confusion |
| No recovery path for broken projections | Manual data repair crisis |
