# Jetpack Compose Knowledge

Jetpack Compose (Android) patterns. Pair with `mobile-platform` and `ux-material` when present.

## State & Recomposition

| Criteria | Judgment |
|----------|----------|
| Mutable state read in a composable without `remember` (lost on recomposition) | REJECT |
| State owned inside a leaf composable that parents need | Hoist the state |
| Non-`@Stable`/unstable params causing needless recomposition | Warning |
| Side effects called directly in composition (not in an effect) | REJECT |

- **State hoisting:** stateless composables take `value` + `onValueChange`; state lives in the caller / ViewModel.
- Use `remember` / `rememberSaveable` for state that must survive recomposition / config change.
- Side effects go in `LaunchedEffect` / `DisposableEffect` / `SideEffect`, never inline.

```kotlin
// ✅ stateless + hoisted
@Composable
fun NameField(value: String, onValueChange: (String) -> Unit) {
  TextField(value = value, onValueChange = onValueChange)
}
```

## Lists & Performance

| Criteria | Judgment |
|----------|----------|
| `Column { items.forEach { ... } }` for long lists | REJECT (use `LazyColumn`) |
| `LazyColumn` items without stable `key` | Warning |
| Reading a frequently-changing state high in the tree | Scope reads to defer recomposition |
| Heavy work in composition instead of `remember`/ViewModel | REJECT |

- Use `LazyColumn`/`LazyRow` with `key` for lists.
- Keep business logic in the ViewModel; composables render state and emit events.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| ViewModel logic leaking into composables | Untestable UI |
| Mutating shared state during composition | Undefined behavior |
| Ignoring lifecycle (`collectAsStateWithLifecycle`) | Wasted work / leaks |
| Hardcoded dp/colors instead of MaterialTheme tokens | Theme/dark-mode breakage |
