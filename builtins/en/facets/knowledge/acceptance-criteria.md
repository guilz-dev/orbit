# Acceptance Criteria Knowledge

Acceptance criteria define the observable conditions under which a change is considered complete and correct.

## Qualities of Good Criteria

| Quality | Guidance |
|---------|----------|
| Observable | A reviewer or tester can tell pass/fail from evidence |
| Specific | Avoid vague words like “better” or “easy” without measurement |
| Scoped | Tie criteria to one user outcome or system behavior |
| Edge-aware | Include important failure, empty, permission, or boundary cases |

## Writing Patterns

| Pattern | Use |
|---------|-----|
| Scenario form | “Given / When / Then” for behavioral expectations |
| Rule list | When several independent conditions must hold |
| Trace IDs | Link criteria to requirement IDs or design sections |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Criteria that restate implementation details only | Does not prove user value |
| One giant acceptance bullet with many hidden subcases | Hard to validate |
| No negative / error case for risky flows | False confidence |
| “Works as expected” | Unverifiable |
