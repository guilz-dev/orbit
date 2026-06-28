Focus on reviewing **user experience (UX)** in standalone review workflows (post-implementation or when UI code exists).

Procedure:
1. Open the Knowledge and Policy Source paths with the Read tool and obtain the full content.
2. List every `##` section in each of them (do not cherry-pick).
3. Match the criteria in each listed section against `ui-design.md` (when present) and the implemented UI — screens, states, navigation, and interaction flow — and detect any issues.

**Note:** If this change has no user-facing UI, proceed as no issues found.

**SDD:** The spec-driven workflow uses the separate `review-ux-design` instruction at the design gate (ui-design.md only, before implementation).
