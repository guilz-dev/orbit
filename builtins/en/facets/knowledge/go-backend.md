# Go Backend Knowledge

Idiomatic Go service patterns. Pair with `backend`, `api-design`, `sql-rdb`.

## Errors

| Criteria | Judgment |
|----------|----------|
| Ignoring a returned `error` (`_ =` or unchecked) | REJECT |
| `panic` for ordinary/expected errors | REJECT (return error) |
| Losing context — not wrapping with `fmt.Errorf("...: %w", err)` | Warning |
| Comparing errors by string instead of `errors.Is`/`errors.As` | REJECT |

- Return errors, wrap with `%w` to preserve the chain, inspect with `errors.Is/As`.
- `panic` only for truly unrecoverable programmer errors.

## Concurrency & Context

| Criteria | Judgment |
|----------|----------|
| Goroutine with no way to stop / leaks on cancel | REJECT |
| `context.Context` not propagated to I/O calls | REJECT |
| Shared map/state across goroutines without sync | REJECT (race) |
| `context.Background()` deep in request handling | Pass the request ctx |

- Thread `context.Context` through all I/O for cancellation/deadlines.
- Protect shared state with mutexes or channels; run with `-race` in CI.

## Structure

| Criteria | Judgment |
|----------|----------|
| Interfaces defined by the producer instead of the consumer | Prefer consumer-side, small interfaces |
| Returning interfaces instead of concrete types | Usually return concrete, accept interfaces |
| Business logic in HTTP handlers | Extract to services |
| `interface{}`/`any` overuse | Prefer concrete/generic types |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Naked returns in long functions | Hard to read |
| Premature goroutines without need | Complexity, leaks |
| Global mutable singletons | Testability, races |
| Forgetting `defer rows.Close()` / resource leaks | Connection exhaustion |
