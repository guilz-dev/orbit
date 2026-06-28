# React Native Knowledge

React Native patterns. Pair with `react` knowledge (hooks/state) and `mobile-platform` (lifecycle/permissions).

## Lists & Rendering

| Criteria | Judgment |
|----------|----------|
| `.map()` over a large array instead of `FlatList`/`FlashList` | REJECT |
| `FlatList` without stable `keyExtractor` | REJECT |
| Inline arrow functions / objects in `renderItem` causing re-renders | Warning |
| Heavy work on the JS thread blocking scroll | Move to `InteractionManager`/native |

- Use `FlatList`/`SectionList` (or FlashList) for any non-trivial list; never render large lists eagerly.
- Memoize `renderItem` and item components; provide `keyExtractor`.

## Platform & Layout

| Criteria | Judgment |
|----------|----------|
| Hardcoded pixel sizes ignoring screen scale / safe area | REJECT |
| No `SafeAreaView` / insets on notched devices | REJECT |
| Platform-specific code branched inline everywhere | Use `Platform.select` or `.ios./.android.` files |
| Touchable without feedback (`activeOpacity`/ripple) | Warning |

- Respect safe-area insets and different screen densities.
- Isolate platform differences with `Platform.select` or platform file extensions.

## Bridging & Performance

| Anti-pattern | Problem |
|--------------|---------|
| Frequent JS↔native bridge calls in a loop | Serialization overhead; batch them |
| Animations driven on JS thread | Use `useNativeDriver: true` / Reanimated |
| Large images without resizing | Memory pressure; resize/cache |
| Storing secrets in AsyncStorage | Not secure; use Keychain/Keystore |
| Memory leaks from un-removed listeners/timers | Clean up in effect teardown |

- Prefer the native driver / Reanimated for animations.
- Store secrets in secure storage (Keychain / Keystore), not AsyncStorage.
