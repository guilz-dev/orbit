```markdown
# Mock UI Summary

## Purpose
{一行: この mock が検証すること}

## Screens & Flows Implemented
| Screen / flow | States shown | Notes |
|---------------|--------------|-------|
| Order list | loading, empty, sample rows | `fixtures/orders.sample.json` 使用 |

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
- {明示的な throwaway / デモ専用の挙動}

## Handoff Checklist
- [ ] 上記の未接続点をすべて列挙した
- [ ] diff に隠れた本番 API 呼び出しがない
- [ ] 設計状態を表現した（`ui-design.md` がある場合）
```
