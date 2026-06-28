# Vue Knowledge

Vue 3 + Composition API patterns. Descriptive; pair with frontend knowledge for shared UI concerns.

## Reactivity

| Criteria | Judgment |
|----------|----------|
| Destructuring a `reactive()` object (loses reactivity) | REJECT |
| Using `ref` value without `.value` in script | REJECT |
| Deeply nested `reactive` state with cross-field invariants | Consider normalizing |
| Derived value stored in a separate `ref` instead of `computed` | REJECT |

```ts
// ❌ loses reactivity
const { count } = reactive({ count: 0 })

// ✅ keep the reactive object, or use refs
const state = reactive({ count: 0 })
const count = ref(0)
```

- Use `computed` for derived state; never recompute into a separate `ref`.
- `watch` is for side effects on change, not for deriving values.
- Prefer `ref` for primitives, `reactive` for grouped object state.

## Component Design

| Criteria | Judgment |
|----------|----------|
| Props mutated directly inside child | REJECT (use `emit` + `v-model`) |
| Business logic inside template | Extract to composable |
| Composable named `useX` but uses no reactivity/lifecycle | Warning |
| `provide`/`inject` used for state shared by 2 close components | Prefer props |

- One-way data flow: props down, events up. Two-way via `v-model` / `defineModel`.
- Extract reusable stateful logic into composables (`useX`); keep pure helpers as functions.
- Use `<script setup>` for new components.

## Performance & Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| `v-for` without stable `:key` | Incorrect DOM reuse |
| `v-if` + `v-for` on same element | Ambiguous precedence; split them |
| Large list without virtualization | Render cost |
| Watcher cascade (watch triggers watch) | Hard to reason about; prefer `computed` |
| Global reactive singletons for everything | Use Pinia stores with clear boundaries |
