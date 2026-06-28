# Release & Rollback Knowledge

Shipping safely is part of design, not just operations. Every risky release needs a rollback or roll-forward story before execution.

## Release Safety

| Concern | Guidance |
|---------|----------|
| Blast radius | Stage risky changes behind flags, dark reads, partial rollout, or canaries |
| Reversibility | Prefer changes that can be disabled or reverted without data surgery |
| Version skew | Expect old and new app instances to coexist during rollout |
| Verification | Define checkpoints: logs, metrics, dashboards, smoke path, and abort threshold |

## Rollback vs Roll-forward

| Situation | Prefer |
|-----------|--------|
| Code-only regression, no irreversible side effects | Rollback is usually fastest |
| Irreversible schema/data step already applied | Roll-forward with mitigation may be safer |
| Security exposure in new code | Disable / roll back immediately |
| Migration mid-flight | Pause, assess compatibility, then choose rollback or compensating fix |

## Data and Schema Compatibility

| Topic | Guidance |
|-------|----------|
| Database schema | Use expand/migrate/contract, not instant destructive swaps |
| Events/messages | New producers should not break old consumers; keep additive changes first |
| Queues/jobs | Define how in-flight work behaves across deployment boundaries |
| Config | Keep safe defaults and a known-good configuration snapshot |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| “Rollback later if needed” with no actual procedure | Response delay during incidents |
| Destructive migration before verifying the new code path | Traps the system in a bad state |
| No owner for release go/no-go | Slow, ambiguous decision making |
| No explicit success / abort threshold | Teams keep shipping into a deteriorating state |
