# UX Knowledge — iOS (Human Interface Guidelines)

iOS-specific UX conventions. Pair with the generic `ux` knowledge and `swiftui` / `react-native`.

## Platform Conventions

| Criteria | Judgment |
|----------|----------|
| Reinventing standard navigation instead of native patterns (nav stack, tab bar, sheets) | REJECT |
| Breaking the system back-swipe gesture | REJECT |
| Non-standard control where a native one exists (date picker, switch, action sheet) | Warning |
| Ignoring safe areas / home indicator / Dynamic Island | REJECT |

- Follow native navigation: navigation stacks (back at top-left + swipe), tab bars for peer sections, sheets/popovers for modal tasks.
- Respect safe areas and the home indicator; never place controls under system affordances.

## Controls & Touch

| Criteria | Judgment |
|----------|----------|
| Tap target smaller than ~44×44 pt | REJECT |
| Destructive action without confirmation / not marked destructive (red) | REJECT |
| No support for Dynamic Type (text scaling) | REJECT |
| Dark mode not supported (hardcoded light colors) | Warning |

- Minimum 44pt touch targets. Mark destructive actions; confirm irreversible ones.
- Support Dynamic Type and dark mode via system colors/typography, not hardcoded values.

## Accessibility & Feel

| Criteria | Judgment |
|----------|----------|
| Missing VoiceOver labels on interactive elements | REJECT |
| Insufficient color contrast | REJECT |
| No haptic/visual feedback on key actions | Warning |
| Overusing custom animations against platform feel | Warning |

- Provide VoiceOver labels, sufficient contrast, and feedback consistent with platform expectations.
