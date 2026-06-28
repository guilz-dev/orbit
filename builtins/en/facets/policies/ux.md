# UX Policy

REJECT / APPROVE criteria for user experience. Reviewers enforce **only** what is listed here.

## Principles

| Principle | Criteria |
|-----------|----------|
| State coverage | Every data-backed or async screen defines loading, empty, error, and no-permission states |
| Reachability | Every screen has a defined entry path (route / menu / action) |
| Flow completeness | Every user task has a defined start and a completion / exit |
| Design-system fidelity | Use existing tokens / components; no hardcoded colors or spacing for covered cases |
| Accessibility | Interactive elements have accessible names, a keyboard path, and sufficient contrast |
| Traceability | Every screen and element maps to a requirement |

## Applicability

Applies when the change includes user-facing UI. If there is no UI, this policy does not apply.

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| A screen omits loading / empty / error state where data or async exists | REJECT |
| A new screen has no defined entry path | REJECT |
| A user flow has a dead-end (no completion, exit, or return) | REJECT |
| Hardcoded color / spacing where a design token exists | REJECT |
| Interactive element without an accessible name | REJECT |
| Information conveyed by color alone | REJECT |
| Focus not managed on modal / dialog open and close | REJECT |
| Element not traceable to any requirement | REJECT |
| Edge-case state added beyond the design reference (loading / error / empty) | OK |
| Reasonable interpretation of an ambiguous design, rationale recorded | OK |

## Review Procedure

1. Open UX Knowledge and this Policy in full.
2. List every `##` section and match it against `ui-design.md` and the implemented UI.
3. For each violation, name the screen / state and the policy criterion.
4. Report unintentional gaps as blocking. APPROVE only if no REJECT criterion is hit.
