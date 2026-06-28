# Angular Knowledge

Modern Angular (standalone components, signals) patterns. Pair with `frontend` knowledge.

## Components & Change Detection

| Criteria | Judgment |
|----------|----------|
| Heavy computation in the template / getters called each CD cycle | REJECT |
| Default change detection on a large tree where `OnPush` fits | Prefer `OnPush` |
| Subscriptions not unsubscribed (no `takeUntilDestroyed`/`async` pipe) | REJECT (leak) |
| Manual subscribe + manual DOM update instead of `async` pipe / signals | Warning |

- Prefer standalone components and `OnPush` change detection.
- Use the `async` pipe or signals; avoid manual subscribe/unsubscribe where possible. When you must subscribe, tear down with `takeUntilDestroyed`.

## State & RxJS

| Criteria | Judgment |
|----------|----------|
| Nested subscriptions (subscribe inside subscribe) | REJECT (use `switchMap`/`mergeMap`) |
| Business logic in components instead of services | Extract to services |
| Shared mutable state without a store/signal boundary | Warning |
| `any` types defeating Angular's typing | REJECT |

- Compose streams with operators; never nest `subscribe`.
- Keep logic in injectable services; components render and delegate.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| God components | Untestable, slow CD |
| Logic in templates | Re-evaluated every cycle |
| Memory leaks from open subscriptions | Performance degradation |
| Tight coupling to concrete services (no DI tokens/interfaces) | Hard to test |
