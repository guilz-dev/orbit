# CI/CD Knowledge

Pipeline patterns for build, test, and deploy. Pair with `kubernetes-docker` and `observability`.

## Pipeline Discipline

| Criteria | Judgment |
|----------|----------|
| No automated tests / quality gate before deploy | REJECT |
| Non-reproducible build (unpinned deps, no lockfile) | REJECT |
| Secrets hardcoded in pipeline config | REJECT (use secret store / OIDC) |
| Pipeline that can't be re-run deterministically | Warning |

- Gate every deploy on build + lint + tests. Builds must be reproducible (pinned deps, lockfiles, pinned action/image versions).
- Inject secrets from a secret store or OIDC federation; never commit them to pipeline YAML.

## Deploy Safety

| Criteria | Judgment |
|----------|----------|
| Deploy with no rollback path | REJECT |
| No staging / pre-prod verification before prod | Warning |
| Manual, unscripted deploy steps | REJECT (automate) |
| No artifact versioning / traceability (commit → artifact → env) | Warning |

- Provide a rollback (previous artifact / blue-green / canary). Trace each deploy to a commit and artifact.
- Promote the same artifact across environments; don't rebuild per environment.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Deploying from a developer machine | Non-reproducible, unaudited |
| Tests disabled "to unblock" | Regressions ship |
| Building separately per environment | Drift between envs |
| Long, monolithic pipeline with no caching | Slow feedback |
| Secrets echoed into logs | Credential leak |
