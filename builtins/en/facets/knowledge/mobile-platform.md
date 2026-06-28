# Mobile Platform Knowledge

Cross-cutting mobile concerns (iOS & Android), independent of UI framework. Pair with the framework knowledge (`react-native` / `flutter` / `swiftui` / `jetpack-compose`).

## App Lifecycle & Background

| Criteria | Judgment |
|----------|----------|
| Assuming the app stays foregrounded (no background/restore handling) | REJECT |
| Long work on the main thread (jank / ANR) | REJECT |
| Not persisting/restoring transient UI state across process death | Warning |
| Network/timers not paused on background | Warning |

- Handle foreground/background transitions; save and restore in-progress state.
- Never block the main/UI thread; offload to background threads/isolates.

## Permissions

| Criteria | Judgment |
|----------|----------|
| Requesting a permission with no in-context rationale | REJECT |
| No graceful path when permission is denied / "ask every time" | REJECT |
| Requesting permissions up front before they are needed | Warning |
| Not handling permanently-denied state (deep link to Settings) | Warning |

- Request permissions just-in-time, with rationale, and degrade gracefully when denied.

## Offline & Data

| Criteria | Judgment |
|----------|----------|
| Assuming connectivity; no offline / failure handling | REJECT |
| No retry / queue for failed mutations on flaky networks | Warning |
| Secrets/tokens in plain storage (Prefs/UserDefaults/AsyncStorage) | REJECT |
| Unbounded local cache growth | Warning |

- Design for intermittent connectivity: cache reads, queue writes, show sync state.
- Store credentials in Keychain (iOS) / Keystore (Android).

## Navigation & Integration

| Concern | Guidance |
|---------|----------|
| Deep links / universal links | Define and handle entry routes; validate params |
| Push notifications | Handle foreground vs background delivery + tap routing |
| Back behavior (Android) | Respect system back; don't trap the user |
| Battery / location | Use coarse where fine isn't needed; stop when backgrounded |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Ignoring safe areas / notches / gesture bars | Clipped or unreachable UI |
| Blocking UI thread on I/O | Jank, ANR, watchdog kills |
| No state restoration | Lost work after OS reclaims the process |
| Over-requesting permissions | Store rejection, user distrust |
