# UX Knowledge — Web

Web-specific UX conventions. Pair with the generic `ux` knowledge and `frontend`.

## Responsive & Input

| Criteria | Judgment |
|----------|----------|
| Layout breaks at common breakpoints / not responsive | REJECT |
| Mouse-only interactions (no keyboard equivalent) | REJECT |
| Hover-only affordance with no touch/focus equivalent | REJECT |
| Fixed pixel layouts that ignore zoom / text scaling | Warning |

- Design responsive layouts that work across viewport sizes and support both pointer and keyboard.
- Every hover affordance needs a focus/touch equivalent.

## Navigation & Forms

| Criteria | Judgment |
|----------|----------|
| Breaking browser back / history (SPA without proper routing) | REJECT |
| Form without inline validation and clear error messaging | REJECT |
| Submitting with no loading/disabled state (double submit) | REJECT |
| Loss of entered data on navigation/refresh without warning | Warning |

- Respect browser back/forward and deep-linkable URLs.
- Forms: label every field, validate inline, show errors near the field, prevent double submit.

## Accessibility & Performance (perceived)

| Criteria | Judgment |
|----------|----------|
| Not keyboard navigable / focus order broken | REJECT |
| WCAG contrast failures | REJECT |
| Missing focus management on route change / modal | REJECT |
| No skeleton/optimistic feedback on slow loads | Warning |
| Layout shift (CLS) as content loads | Warning |

- Meet WCAG AA: keyboard operability, focus management, contrast, semantic landmarks.
- Reduce perceived latency with skeletons/optimistic UI; avoid layout shift.
