# SQL / Relational DB Knowledge

Schema, query, and transaction patterns for relational databases (Postgres/MySQL). Pair with `backend` knowledge.

## Schema & Integrity

| Criteria | Judgment |
|----------|----------|
| Foreign keys / constraints omitted "for speed" | REJECT (let the DB enforce invariants) |
| Money/precise values stored as float | REJECT (use decimal/numeric) |
| Nullable columns where the value is always required | Add NOT NULL |
| Storing derived/duplicated values that can drift | REJECT unless deliberately denormalized |

- Enforce invariants in the schema (FK, UNIQUE, CHECK, NOT NULL), not only in app code.
- Use appropriate types: `numeric` for money, `timestamptz` for time, native enums/booleans.

## Indexing & Queries

| Criteria | Judgment |
|----------|----------|
| Query in a loop instead of a set-based join (N+1) | REJECT |
| Filtering/joining a large table on an unindexed column | REJECT |
| `SELECT *` across wide tables in hot paths | Select needed columns |
| Index added without checking it matches query predicates/order | Warning |

- Index columns used in WHERE / JOIN / ORDER BY; verify with `EXPLAIN`.
- Prefer set-based queries and joins over per-row round trips.

## Transactions & Migrations

| Criteria | Judgment |
|----------|----------|
| Multi-step invariant change not wrapped in a transaction | REJECT |
| Long-running transaction holding locks | Warning (contention) |
| Schema change applied outside a migration tool | REJECT |
| Destructive migration with no backward-compatible step / rollback plan | REJECT |

- Make schema changes via versioned migrations; design them to be safe under zero-downtime deploys (add column → backfill → switch → drop).

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| EAV / "god" key-value tables | Unqueryable, no integrity |
| Application-side joins of large tables | Slow, memory heavy |
| Offset pagination on huge tables | Slow deep pages; prefer keyset |
| Storing JSON blobs for relational data | Loses constraints/queryability |
