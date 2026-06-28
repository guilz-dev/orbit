Focus on reviewing **data design and data-flow correctness**.

Procedure:
1. Open the Data-related Knowledge Source paths with the Read tool and obtain the full content.
2. List every `##` section in each of them (do not cherry-pick).
3. Match the criteria in each listed section against the schema, queries, events, migrations, and test coverage in the diff, and detect any issues.

## Step-Specific Notes

- Check schema invariants, nullability, uniqueness, deletion semantics, and migration compatibility.
- Review index and query choices against actual access patterns, not intuition alone.
- For event-driven changes, verify idempotency, ordering assumptions, replay/rebuild path, and projection lag handling.
