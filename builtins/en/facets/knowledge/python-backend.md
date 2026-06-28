# Python Backend Knowledge

FastAPI / Django backend patterns. Pair with `backend`, `api-design`, and `sql-rdb`.

## Async & Blocking

| Criteria | Judgment |
|----------|----------|
| Blocking I/O (sync DB driver, `requests`) inside an `async def` handler | REJECT |
| CPU-bound work on the event loop | Move to a worker / `run_in_executor` |
| Mixing sync and async DB sessions | REJECT |
| `time.sleep` in async code | REJECT (use `asyncio.sleep`) |

- In async frameworks, every awaited call must be non-blocking; use async drivers (asyncpg, httpx) end to end.
- Offload CPU-bound work to a task queue (Celery/RQ/arq) or executor.

## Structure & Validation

| Criteria | Judgment |
|----------|----------|
| Business logic in route handlers / views | Extract to a service layer |
| Trusting request data without a schema (Pydantic / serializer) | REJECT |
| Returning ORM models directly as API output | Use response schemas/DTOs |
| Fat models with cross-cutting concerns | Split responsibilities |

- Validate input at the boundary with Pydantic models / DRF serializers; never trust raw dicts.
- Keep handlers thin: parse → call service → map to response schema.

## Data & Settings

| Criteria | Judgment |
|----------|----------|
| ORM query in a loop (N+1) | Use `select_related`/`selectinload`/joins |
| Secrets / config hardcoded instead of env / settings | REJECT |
| DB session not scoped per request (leak) | REJECT |
| Migrations not used for schema changes | REJECT |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Bare `except:` swallowing errors | Hidden failures |
| Mutable default arguments (`def f(x=[])`) | Shared state bug |
| Global DB connection across requests | Concurrency issues |
| Returning 200 with an error body | Misleading clients (use proper status) |
