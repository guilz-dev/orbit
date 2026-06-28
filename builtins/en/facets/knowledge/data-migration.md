# Data Migration Knowledge

Safe schema and data migrations, especially under zero-downtime deploys. Pair with `db-schema-design`, `indexing-query-tuning` and `existing-system`.

## Expand–Contract

The safe pattern for changing a schema that running code depends on:

1. **Expand** — add the new column/table/index (nullable/optional, backward compatible).
2. **Backfill** — populate the new shape in batches; keep writing both old and new.
3. **Migrate reads/writes** — switch the app to the new shape behind a deploy.
4. **Contract** — remove the old shape only after no code reads it.

| Criteria | Judgment |
|----------|----------|
| Rename/drop a column in the same deploy that changes the code | REJECT (breaks rolling deploy) |
| Adding a NOT NULL column with no default to a large table | REJECT (locks/blocks) |
| Backfilling a huge table in one transaction | REJECT (long lock; batch it) |
| Migration with no rollback / backward-compatible step | REJECT |

## Safety

| Criteria | Judgment |
|----------|----------|
| Destructive change without a verified backup / reversibility | REJECT |
| Index created without `CONCURRENTLY` on a busy table (locks) | Warning |
| Migration not idempotent / not re-runnable | Warning |
| No verification step (counts, checksums) after data move | Warning |

- Make migrations reversible or paired with a forward fix; back up before destructive steps.
- Batch large backfills; build indexes concurrently; verify with counts/checksums.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Big-bang rename/drop + code in one release | Errors during rolling deploy |
| Long-locking DDL on a live table | Outage |
| App and schema assuming different shapes mid-deploy | Runtime failures |
| No backfill plan for existing rows | NULLs / broken invariants |
