```markdown
# Domain Review

## Result: APPROVE / REJECT

## Summary
{Summarize the result in 1-2 sentences}

## Reviewed Aspects
| Aspect | Result | Notes |
|--------|--------|-------|
| Domain conventions | ✅ | - |
| Anti-patterns | ✅ | - |
| Design / API alignment | ✅ | - |
| Test coverage (domain norms) | ✅ | - |

## Current Iteration Findings (new)
| # | finding_id | family_tag | Location | Issue | Fix Suggestion |
|---|------------|------------|----------|-------|----------------|
| 1 | DOM-NEW-Example | convention | `path:line` | {Issue} | {Fix} |

## Carry-over Findings (persists)
| # | finding_id | family_tag | Previous Evidence | Current Evidence | Issue | Fix Suggestion |
|---|------------|------------|-------------------|------------------|-------|----------------|
| 1 | DOM-PERSIST-Example | anti-pattern | `path` | `path` | {Issue} | {Fix} |

## Resolved Findings (resolved)
| finding_id | Resolution Evidence |
|------------|---------------------|
| DOM-RESOLVED-Example | {Evidence} |

## Reopened Findings (reopened)
| # | finding_id | family_tag | Prior Resolution Evidence | Recurrence Evidence | Issue | Fix Suggestion |
|---|------------|------------|--------------------------|---------------------|-------|----------------|

## Rejection Gate
- REJECT is valid only when at least one finding exists in `new`, `persists`, or `reopened`
- Findings without `finding_id` are invalid
```

**Cognitive load reduction rules:**
- APPROVE → Summary only (5 lines or fewer)
- REJECT → Include only relevant finding rows (30 lines or fewer)
