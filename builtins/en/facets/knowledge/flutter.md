# Flutter Knowledge

Flutter / Dart widget patterns. Pair with `mobile-platform` for lifecycle/permissions.

## Widgets & build()

| Criteria | Judgment |
|----------|----------|
| Side effects (network, navigation) inside `build()` | REJECT |
| Deep widget tree in one giant `build()` method | Split into widgets |
| `StatefulWidget` where `StatelessWidget` + state mgmt suffices | Prefer stateless |
| Missing `const` constructors on static subtrees | Warning (rebuild cost) |

- `build()` must be pure and cheap; it can run every frame. No side effects.
- Extract subtrees into widgets (not helper methods) so Flutter can skip rebuilds.
- Use `const` constructors wherever the subtree is static.

## State Management

| Criteria | Judgment |
|----------|----------|
| `setState` in a huge widget rebuilding the whole screen | Scope state down |
| Business logic mixed into widgets | Move to a notifier/bloc/provider |
| Disposing controllers (Animation/TextEditing) not done | REJECT (leak) |
| Reading inherited state without listening correctly | REJECT |

- Pick one state approach (Provider/Riverpod/Bloc) and keep boundaries clear.
- Always `dispose()` controllers, streams, and listeners.

## Lists & Performance

| Anti-pattern | Problem |
|--------------|---------|
| `Column`/`ListView(children: [...])` for long lists | Builds all at once; use `ListView.builder` |
| Rebuilding entire tree on small change | Scope rebuilds with const + targeted notifiers |
| Large images without `cacheWidth`/resizing | Memory pressure |
| Blocking the UI isolate with heavy compute | Use `compute()` / isolates |

- Use `.builder` constructors for lists/grids of unknown length.
- Offload heavy CPU work to isolates.
