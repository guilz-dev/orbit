# Node.js Backend Knowledge

Express / NestJS service patterns. Pair with `backend`, `api-design`, `db-schema-design`, `indexing-query-tuning`. Use this for Node-specific concerns beyond generic backend.

## Async & Errors

| Criteria | Judgment |
|----------|----------|
| Unhandled promise rejection (no `await`/`.catch`, floating promise) | REJECT |
| Async route handler without error propagation to middleware | REJECT |
| Blocking the event loop (sync crypto/fs/JSON on large data) | REJECT |
| Swallowing errors with empty `catch` | REJECT |

- Never float a promise; `await` it or attach error handling. Route async errors to a central error middleware.
- Keep the event loop free: use async APIs; offload CPU work to worker threads / a queue.

## Structure & Security

| Criteria | Judgment |
|----------|----------|
| Business logic in controllers / route handlers | Extract to services |
| Request body trusted without validation (zod/class-validator/Joi) | REJECT |
| Secrets in code instead of env / secret store | REJECT |
| No input size / rate limits on public endpoints | Warning |

- Validate and type all input at the boundary; keep handlers thin.
- Centralize error handling and config; never hardcode secrets.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Callback + promise mixing | Confusing control flow |
| Global mutable state across requests | Concurrency bugs |
| `process.env` read deep in modules | Untraceable config |
| Logging full request/DTO with secrets | Data leak |
| Not handling `SIGTERM` for graceful shutdown | Dropped requests on deploy |
