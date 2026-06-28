# Integration Testing Knowledge

Integration tests verify real behavior across module or service boundaries where unit tests alone cannot prove the contract.

## When to Use Integration Tests

| Situation | Guidance |
|-----------|----------|
| Data flow across multiple modules | Verify the whole transition, not only leaf functions |
| Persistence or messaging boundary | Include the real repository/serializer/transport shape |
| External adapter contract | Use stable test doubles at the edge, but keep the integration path realistic |
| Bug caused by wiring, config, or sequencing | Reproduce it through the real collaboration path |

## Test Design

| Concern | Guidance |
|---------|----------|
| Scope | Keep the boundary narrow enough to diagnose failures |
| Fixtures | Prefer scenario-driven setup over giant shared fixtures |
| Determinism | Control time, randomness, and network variability |
| Assertions | Assert business outcomes and observable side effects |

## Common Failure Modes

| Anti-pattern | Problem |
|--------------|---------|
| Mocking away the boundary under test | No longer an integration test |
| One giant “system test” for many concerns | Slow, hard to debug failures |
| Shared mutable fixture state across tests | Order-dependent flakiness |
| Ignoring error paths and rollback behavior | Happy-path-only confidence |
