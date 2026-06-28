# UX Knowledge

Descriptive UX patterns and anti-patterns. Enforcement lives in the UX Policy; this facet informs judgment.

## Screen States

Every data-backed or async screen has states beyond the happy path. Design all of them.

| State | When | Must show |
|-------|------|-----------|
| Loading | Data in flight | Skeleton or spinner scoped to the affected region, not the whole screen |
| Empty | Query returns nothing | Cause + a next action ("No results. Try clearing filters.") |
| Error | Request or action fails | What failed + a retry path; never a blank screen |
| No-permission | User lacks access | Why it is hidden + who to ask, not a dead 403 |
| Partial | Some data loaded, some failed | Show what loaded; mark the failed region |

| Criteria | Judgment |
|----------|----------|
| Async screen with only a happy-path layout | REJECT |
| Full-screen spinner blocking already-loaded content | Warning |
| Empty state with no next action | Warning |

## Navigation & Reachability

| Criteria | Judgment |
|----------|----------|
| A screen exists but no menu / route / action leads to it | REJECT |
| A flow ends with no completion, exit, or return path | REJECT |
| Back / cancel discards user input without warning | Warning |
| Primary action is not visually primary | Warning |

## Interaction & Feedback

- Every user action gets immediate feedback (state change, toast, inline result).
- Destructive actions are confirmed or undoable.
- Disabled controls explain why (tooltip / helper text), not silent.
- Loading on a button is local to that button, not the whole page.

## Information Design

- One primary action per screen; demote the rest.
- Progressive disclosure: hide advanced options until needed.
- Group related fields; match the user's mental model, not the database schema.
- Show only what the user needs to decide; defer the rest.

## Accessibility (design-time)

| Criteria | Judgment |
|----------|----------|
| Interactive element without an accessible name | REJECT |
| Meaning conveyed by color alone | REJECT |
| Focus not trapped / restored on modal open & close | REJECT |
| Tap/click target smaller than ~44px on touch | Warning |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Mystery meat navigation | Icons with no label; users guess |
| Dead-end error | Failure with no retry or way back |
| Silent failure | Action does nothing visible on error |
| Modal stacking | Dialogs on dialogs; no clear escape |
| Schema-shaped form | Fields ordered by table columns, not the task |
| Infinite spinner | Loading state with no timeout or error fallback |
