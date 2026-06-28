# Bundled facets and workflows

Source of truth for builtin facets (`builtins/{en,ja}/facets/`) and workflows (`builtins/{en,ja}/workflows/`).

## Contribution rules

- Do not write to the same submodule tree from multiple parallel sessions. Use one branch per effort.
- Land changes in orbit first, then bump the planetz submodule pointer and run `pnpm prepare:bundled-orbit`.
- New bundled facets are **default OFF** — wire them into workflows explicitly (on-demand).
- Prefer fine-grained knowledge keys over coarse umbrella keys.

## Single-reviewer review workflow shape

When adding a focused review workflow (UX, domain, etc.), use this canonical shape:

```
gather (planner + gather-review)
  → {name}-review (single reviewer step)
  → supervise (supervisor + supervise)
  → COMPLETE
```

- Do not route `needs_fix` directly to `COMPLETE`; follow existing review workflows (`needs_fix` → `supervise`).
- Fix-loop variants: `gather → review ↔ fix → supervise → COMPLETE` with `loop_monitors` on the review/fix cycle.

Copy an existing review workflow and replace persona, instruction, policy, knowledge, and output contract only.
