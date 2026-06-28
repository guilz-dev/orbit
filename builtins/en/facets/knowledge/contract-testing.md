# Contract Testing Knowledge

Contract tests verify that producers and consumers agree on structure, semantics, and compatible evolution of an interface.

## Contract Scope

| Interface | What to verify |
|-----------|----------------|
| HTTP / RPC | Fields, status codes, required/optional semantics, error shape |
| Events / messages | Event name, payload schema, delivery assumptions, version handling |
| File / config format | Required keys, defaults, parsing constraints, backward compatibility |

## Evolution Rules

| Change type | Guidance |
|-------------|----------|
| Additive field | Usually safe when consumers ignore unknown fields |
| Removed / renamed field | Breaking unless all consumers are updated together |
| Semantic change with same shape | Still breaking if old meaning is assumed downstream |
| Error contract change | Treat as breaking when callers branch on it |

## Good Practice

- Validate both producer output and consumer assumptions.
- Keep canonical examples or schemas close to code.
- Test compatibility before rollout when mixed versions can coexist.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Producer and consumer tested only against themselves | Shared bug passes unnoticed |
| Snapshot only, with no semantic assertions | Shape may match while meaning breaks |
| No explicit compatibility policy | Breaking changes slip into routine refactors |
| Contract examples drift from real runtime payloads | False confidence |
