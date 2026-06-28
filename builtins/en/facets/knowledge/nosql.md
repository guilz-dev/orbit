# NoSQL Knowledge

Document / key-value store modeling (MongoDB, DynamoDB, etc.). Pair with `backend` knowledge.

## Modeling by Access Pattern

| Criteria | Judgment |
|----------|----------|
| Modeling like a relational schema then joining in app code | REJECT |
| Designing the schema before knowing the access patterns | REJECT |
| Unbounded array growth inside a document | REJECT (16MB/item limits, hot docs) |
| Normalizing data that is always read together | Prefer embedding |

- Model around queries, not entities: design for how data is read/written, then shape documents/keys to serve those patterns in one lookup.
- Embed data read together; reference data that grows unboundedly or is shared.

## Consistency & Keys

| Criteria | Judgment |
|----------|----------|
| Assuming multi-document transactions / strong consistency by default | Verify the store's guarantees |
| Partition/hash key with low cardinality (hot partitions) | REJECT |
| Scans/`find` without an index on a large collection | REJECT |
| Duplicated data with no update strategy (drift) | Define the update path |

- Choose partition keys for even distribution; index query predicates; avoid full scans.
- Denormalization is a trade: duplicated data needs an explicit update/repair strategy.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Relational modeling in a document store | App-side joins, N+1 |
| Hot partition / hot document | Throttling, contention |
| Unbounded embedded arrays | Document size limits, slow writes |
| Treating eventual consistency as strong | Stale reads / lost updates |
