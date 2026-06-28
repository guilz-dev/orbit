# Database Schema Design Knowledge

Schema design should reflect invariants, access patterns, and evolution strategy, not just present-day fields.

## Modeling Basics

| Concern | Guidance |
|---------|----------|
| Identity | Choose stable primary keys and explicit uniqueness constraints |
| Relationships | Model cardinality and optionality explicitly |
| Constraints | Push invariant checks into schema when the database can enforce them |
| Nullability | Use `NULL` intentionally, not as “unknown by default” |

## Evolution and Operations

| Topic | Guidance |
|-------|----------|
| Migrations | Prefer additive, backward-compatible steps |
| Large tables | Plan for online migration, backfill, and verification |
| Deletion | Define soft-delete, hard-delete, retention, and cascade behavior intentionally |
| Auditability | Decide which changes require history/event tables |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Business-critical uniqueness enforced only in application code | Race-condition data corruption |
| Many overloaded generic columns (`value1`, `value2`) | Meaning becomes untraceable |
| Enum-like strings with no validation path | Drift and inconsistent states |
| Schema changes designed only for the newest app version | Rollout breaks under version skew |
