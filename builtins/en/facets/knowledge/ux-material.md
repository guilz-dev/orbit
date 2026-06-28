# UX Knowledge — Android (Material Design)

Android / Material Design UX conventions. Pair with the generic `ux` knowledge and `jetpack-compose` / `react-native`.

## Material Structure

| Criteria | Judgment |
|----------|----------|
| Custom navigation instead of Material patterns (top app bar, navigation bar/rail, drawer) | Warning |
| Ignoring the system back button / predictive back | REJECT |
| Hardcoded colors instead of Material theme (`MaterialTheme`/tokens) | REJECT |
| Elevation/surface used inconsistently with Material hierarchy | Warning |

- Use Material components and theming tokens; let dark/dynamic color flow from the theme.
- Respect the Android system back (and predictive back); don't trap the user.

## Controls & Touch

| Criteria | Judgment |
|----------|----------|
| Touch target smaller than 48×48 dp | REJECT |
| FAB used for a non-primary action (or multiple FABs) | Warning |
| Destructive action without confirmation | REJECT |
| No support for text scaling / font size settings | REJECT |

- Minimum 48dp touch targets. Reserve the FAB for the single primary action of a screen.
- Support font scaling and configuration changes (rotation, locale) without losing state.

## Accessibility & Feedback

| Criteria | Judgment |
|----------|----------|
| Missing content descriptions for TalkBack | REJECT |
| Insufficient contrast against Material surfaces | REJECT |
| No ripple / state feedback on touch | Warning |
| Snackbar/dialog used inconsistently with guidance | Warning |

- Provide `contentDescription` for TalkBack, sufficient contrast, and standard touch feedback (ripple).
