# API Design Knowledge

REST and GraphQL API contract patterns. Pair with `backend` and `existing-system` knowledge.

## REST Contracts

| Criteria | Judgment |
|----------|----------|
| Wrong status codes (200 for errors, 200 for "not found") | REJECT |
| Verbs in resource paths (`/getUser`, `/createOrder`) | REJECT (use nouns + HTTP methods) |
| Non-idempotent semantics on `PUT`/`DELETE` | REJECT |
| Breaking change shipped without versioning | REJECT |
| Unbounded list endpoint (no pagination) | REJECT |

- Resources are nouns; methods carry the verb. Return correct status codes and a consistent error shape.
- `GET` safe, `PUT`/`DELETE` idempotent, `POST` for creation/non-idempotent actions (support idempotency keys where retries matter).

## Payloads & Evolution

| Criteria | Judgment |
|----------|----------|
| Returning internal entities/columns directly | Use explicit response schemas |
| Removing/renaming a field without deprecation | REJECT (additive changes only) |
| Inconsistent casing/naming across endpoints | Warning |
| No pagination contract (cursor/offset) on collections | REJECT |

- Evolve additively; deprecate before removing. Keep response schemas explicit and stable.
- Define pagination (prefer cursor/keyset for large sets), filtering, and sorting consistently.

## GraphQL & Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Resolver N+1 (no DataLoader/batching) | DB hammering |
| Exposing the DB schema 1:1 as the graph | Leaks internals, no abstraction |
| Unbounded query depth / no cost limits | DoS risk |
| Errors hidden in 200 responses with no error contract | Clients can't react |
| Chatty endpoints requiring many round trips | Latency; design for the screen's needs |
