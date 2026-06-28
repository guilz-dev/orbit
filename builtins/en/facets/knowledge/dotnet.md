# .NET / ASP.NET Core Knowledge

ASP.NET Core + EF Core service patterns. Pair with `backend`, `api-design`, `sql-rdb`.

## Async & DI

| Criteria | Judgment |
|----------|----------|
| `async void` (except event handlers) | REJECT |
| `.Result` / `.Wait()` on a Task (deadlock risk) | REJECT |
| `CancellationToken` not flowed to async/EF calls | Warning |
| Injecting a scoped service into a singleton | REJECT (captive dependency) |

- Async all the way: return `Task`, await, pass `CancellationToken`. Never block on async.
- Respect DI lifetimes: don't capture scoped/transient inside singletons.

## EF Core & Data

| Criteria | Judgment |
|----------|----------|
| Query in a loop / lazy loading causing N+1 | Use `Include`/projection |
| Returning entities as API output | Project to DTOs |
| Tracking queries for read-only data | Use `AsNoTracking()` |
| Missing migrations for schema change | REJECT |

- Project to DTOs with `Select`; use `AsNoTracking()` for reads; batch with a single round trip.

## Structure & Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Business logic in controllers | Move to services/handlers |
| Swallowing exceptions / generic `catch` | Hidden failures |
| Static mutable state | Concurrency bugs |
| `DbContext` shared across threads/requests | Not thread-safe |
| Returning 200 for errors | Use proper status codes + ProblemDetails |
