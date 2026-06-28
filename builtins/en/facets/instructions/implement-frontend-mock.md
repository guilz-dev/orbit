Implement a **frontend mock UI** according to the plan and any available design reference.

Procedure:
1. Open the Policy and Knowledge Source paths with the Read tool and obtain the full content.
2. List every `##` section in each of them (do not cherry-pick).
3. Declare change scope in `coder-scope.md` before editing files.
4. Build screens, navigation, and states using **stub data, fixtures, and placeholder handlers only**.
5. When `ui-design.md` exists, match layout, labels, and state coverage to the design (data may be fake).
6. Do **not** connect production APIs, real auth, or persistent domain logic — record gaps in `mock-ui-summary.md`.
7. Run build/typecheck when the project supports it; add or update tests only when the plan explicitly requires them.

**Handoff report (`mock-ui-summary.md`) must include:**
- Screens and flows implemented in this mock pass
- Stub/fixture sources used
- Unconnected APIs, auth, persistence, and domain rules (explicit list)
- Recommended next owner (Core Coder / UI Coder) per gap

**Pre-completion self-check (required):**

Before finishing, audit your work against Policy with the following procedure.

1. Open the Policy Source path with the Read tool and obtain the full content
2. List every `##` section (do not cherry-pick)
3. Match the REJECT criteria in each listed section against your implementation

If any REJECT criterion matches, fix before completing the step.
