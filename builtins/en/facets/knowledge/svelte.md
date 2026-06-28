# Svelte Knowledge

Svelte / SvelteKit patterns. Pair with `frontend` knowledge.

## Reactivity

| Criteria | Judgment |
|----------|----------|
| Mutating an array/object without reassignment (no reactivity, legacy mode) | REJECT |
| Heavy work in a reactive statement that reruns too often | Scope dependencies |
| Derived value stored as separate state instead of reactive/`$derived` | REJECT |
| Side effects mixed into reactive declarations | Separate effect from derivation |

- Reactivity triggers on assignment (or runes in Svelte 5). Reassign (`arr = [...arr, x]`) rather than mutate in legacy mode.
- Keep derived values reactive/`$derived`; keep effects (`$effect`) separate from pure derivations.

## Components & Stores

| Criteria | Judgment |
|----------|----------|
| Prop mutated directly in child | REJECT (dispatch event / bind) |
| Global writable store used for local component state | Prefer local state |
| Logic duplicated across components | Extract to a store/module |
| Store subscription not auto-managed (manual subscribe leaks) | Use `$store` auto-subscription |

- Use `$store` auto-subscription; avoid manual subscribe/unsubscribe.
- Keep shared state in stores with clear ownership; keep local state local.

## SvelteKit & Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Fetching in components instead of `load` functions | Misses SSR/streaming benefits |
| Leaking server-only secrets into client code | Security (use `$env/static/private`) |
| Large reactive blocks doing everything | Hard to reason about |
| Ignoring `+error`/`+layout` boundaries | Poor error/loading UX |
