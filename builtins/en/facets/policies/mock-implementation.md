# Mock Implementation Policy

Mock UI work validates experience and alignment. It must not silently become production integration.

## Principles

| Principle | Criteria |
|-----------|----------|
| Stubs over real integration | Data and side effects use fixtures, fakes, or local placeholders |
| Explicit boundaries | Every unconnected API, auth, or persistence path is documented |
| Design-first | When `ui-design.md` exists, visible structure and states match it |
| Throwaway-safe | Mock code may be replaced; do not entangle core domain modules |

## Applicability

Applies to steps using persona `front-mock-coder` or instruction `implement-frontend-mock`.

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| Production API endpoint called from mock UI | REJECT |
| Real authentication or session persistence wired | REJECT |
| Domain/business rules implemented as if production-ready | REJECT |
| Database or server mutations beyond local fake state | REJECT |
| Stub/fixture data with documented unconnected points | OK |
| Placeholder handlers (log, noop, local toggle only) | OK |
| Hardcoded sample rows for layout and flow demos | OK |
| Loading/empty/error states using fake data | OK |

## Implementation Procedure

1. Open Policy and Knowledge sources; list every `##` section before implementing
2. Prefer fixtures and inline sample data over network calls
3. Record each unconnected integration in `mock-ui-summary.md`
4. Run project build/typecheck when applicable; tests are optional unless the plan requires smoke checks

## Review Procedure

1. Scan for real API clients, auth flows, or domain services introduced by the mock step
2. Cross-check `mock-ui-summary.md` against the diff — hidden stubs are REJECT
3. When `ui-design.md` exists, verify screens and states are represented (not necessarily production-correct data)
