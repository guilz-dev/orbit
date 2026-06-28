```markdown
# UX Review

## Result: APPROVE / REJECT

## Summary
{Summarize the result in 1-2 sentences}

## Reviewed Aspects
| Aspect | Result | Notes |
|--------|--------|-------|
| State coverage (loading/empty/error/permission) | ✅ | - |
| Navigation & reachability | ✅ | - |
| Flow completeness | ✅ | - |
| Design-system fidelity | ✅ | - |
| Accessibility | ✅ | - |

## Current Iteration Findings (new)
| # | finding_id | family_tag | Location | Issue | Fix Suggestion |
|---|------------|------------|----------|-------|----------------|
| 1 | UX-NEW-OrderList-empty | state-coverage | `OrderList / empty` | No empty state defined | Add empty-state component with guidance copy |

## Carry-over Findings (persists)
| # | finding_id | family_tag | Previous Evidence | Current Evidence | Issue | Fix Suggestion |
|---|------------|------------|-------------------|------------------|-------|----------------|
| 1 | UX-PERSIST-Modal-focus | accessibility | `EditModal` | `EditModal` | Focus still not trapped | Manage focus on open/close |

## Resolved Findings (resolved)
| finding_id | Resolution Evidence |
|------------|---------------------|
| UX-RESOLVED-Nav-entry | `Settings` now reachable from main menu |

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
