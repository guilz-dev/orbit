# SwiftUI Knowledge

SwiftUI (iOS) patterns. Pair with `mobile-platform` for lifecycle/permissions and `ux-ios-hig` when present.

## State & Data Flow

| Property wrapper | Use for |
|------------------|---------|
| `@State` | View-local, value-type, transient UI state |
| `@Binding` | Two-way reference to state owned by a parent |
| `@Observable` / `@StateObject` | Reference-type model owned by the view |
| `@ObservedObject` / `@Environment` | Model injected from outside |

| Criteria | Judgment |
|----------|----------|
| `@State` used for shared/source-of-truth model data | REJECT |
| Creating a model with `@ObservedObject` (recreated each update) instead of `@StateObject` | REJECT |
| Heavy work inside `body` | REJECT (body recomputes often) |
| Mutating state during view update | REJECT |

- Single source of truth: owner uses `@State`/`@StateObject`; children take `@Binding`/`@ObservedObject`.
- `body` must be a cheap, pure function of state.

## Layout & Navigation

| Criteria | Judgment |
|----------|----------|
| `NavigationView` (deprecated) instead of `NavigationStack` | Prefer `NavigationStack` |
| Hardcoded frames instead of layout system / `GeometryReader` where needed | Warning |
| Ignoring safe area / Dynamic Type | REJECT |
| Long `List` built from a non-identifiable collection | Provide `id`/`Identifiable` |

- Support Dynamic Type and safe areas; do not hardcode sizes that break accessibility scaling.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Massive `body` with nested logic | Split into subviews |
| Business logic in the View | Move to an `@Observable` model |
| `onAppear` doing work that reruns on every appearance | Guard / move to `task` |
| Forgetting `@MainActor` for UI-updating async | Threading bugs |
