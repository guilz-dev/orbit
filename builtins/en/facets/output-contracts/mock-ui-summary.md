```markdown
# Mock UI Summary

## Purpose
{One-line: what this mock validates}

## Screens & Flows Implemented
| Screen / flow | States shown | Notes |
|---------------|--------------|-------|
| Order list | loading, empty, sample rows | Uses `fixtures/orders.sample.json` |

## Stub & Fixture Sources
| Data / behavior | Source | Production replacement |
|-----------------|--------|------------------------|
| Order rows | `fixtures/orders.sample.json` | `GET /api/orders` |

## Unconnected Integration Points
| Area | Current mock behavior | Needed for production | Suggested owner |
|------|----------------------|------------------------|-----------------|
| Auth | Hardcoded user chip | Real session | Core Coder |
| Submit | `console.log` | `POST /api/orders` | Core Coder |

## Known Limitations
- {Explicit throwaway or demo-only behaviors}

## Handoff Checklist
- [ ] All unconnected points listed above
- [ ] No hidden production API calls in diff
- [ ] Design states represented (when `ui-design.md` exists)
```
