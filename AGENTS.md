# Repository Guidelines

## Project Structure & Module Organization

- `src/`: main TypeScript source. CLI entrypoints live in `src/app/cli/`, core workflow execution in `src/core/`, shared helpers in `src/shared/`, and feature modules in `src/features/`.
- `src/__tests__/`: Vitest unit and integration tests, typically named `*.test.ts`.
- `e2e/`: end-to-end specs, helpers, fixtures, mock workflows, and provider scenarios.
- `builtins/`: builtin workflows, facets, templates, prompts, and runtime config assets shipped with the CLI.
- `docs/`: user and design documentation. `bin/` contains executable wrappers. `dist/` is generated output and should not be edited by hand.

## Build, Test, and Development Commands

- `npm install`: install project dependencies.
- `npm run build`: compile TypeScript and copy runtime prompts, i18n files, and presets into `dist/`.
- `npm run watch`: run the TypeScript compiler in incremental watch mode.
- `npm run lint`: run ESLint on `src/`.
- `npm test`: run the main Vitest suite.
- `npm run test:e2e:mock`: run E2E tests against the mock provider.
- `npm run check:release`: run the full release verification path: build, lint, unit tests, and all E2E suites.

## Coding Style & Naming Conventions

This project uses TypeScript ESM on Node `>=18.19.0`. Use 2-space indentation and follow nearby file style. Prefer simple, readable code over clever abstractions. Avoid `any`; prefix intentionally unused parameters with `_`. File names follow existing conventions, mostly focused `kebab-case` or established module names such as `workflowLoader.ts`. Use ESLint and TypeScript compiler feedback before submitting changes.

## Testing Guidelines

Use Vitest for unit, integration, and E2E coverage. Add or update tests for behavior changes. Keep test names explicit, for example `should reject removed legacy workflow alias`. Run `npm test` for normal changes. Run `npm run test:e2e:mock` when touching CLI behavior, workflow execution, provider selection, config loading, or sandbox/runtime flows.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style messages such as `fix: ...`, `docs: ...`, and scoped variants like `chore(ci): ...`; PR merge commits may include issue numbers like `(#726)`. Keep commits small and focused. PRs should describe purpose, major changes, test results, and linked issues. Before submitting, run `npm run build`, `npm run lint`, and `npm test`, then include the TAKT review summary when required by `CONTRIBUTING.md`.

## Security & Configuration Tips

Never commit API keys or tokens. Use `~/.takt/config.yaml`, project `.takt/config.yaml`, or environment variables for configuration. Review docs before changing provider, sandbox, credential, or runtime behavior.

## Cursor Cloud specific instructions

Dependencies (`npm install`) are refreshed automatically by the Cloud Agent update script. Standard commands above still apply; notes below are only the non-obvious bits for this environment.

- **Runtime:** the VM default `node` is v22 (`/exec-daemon/node`), which satisfies `engines.node >=18.19.0`, so this repo's `npm` commands work as-is with no Node switching. (Node 24 is also installed via nvm for the sibling `planetz` repo.)
- **Build before running the CLI/dist:** `dist/` is generated. Run `npm run build` before exercising `bin/takt` or anything that loads `dist/`.
- **Run the engine end-to-end with no API keys:** use the built-in `mock` provider. `npm run test:e2e:mock` covers CLI/workflow flows. For a one-shot manual run, drive the mock with a scenario file via `TAKT_MOCK_SCENARIO` (see `e2e/fixtures/scenarios/*.json` and `e2e/fixtures/workflows/*.yaml`). Example hello-world that completes a workflow:

  ```bash
  TAKT_MOCK_SCENARIO=e2e/fixtures/scenarios/execute-done.json \
    bin/takt --task "demo" \
    --workflow e2e/fixtures/workflows/mock-single-step.yaml \
    --provider mock --pipeline --skip-git
  ```

  Built-in workflows like `default-mini` use tag-based routing and will abort under the generic mock unless the scenario emits the matching `[STEP:N]` tag.
- **Real providers** (claude/codex/opencode/cursor/copilot) need their own API keys/CLIs and are not configured here; `test:e2e:provider:*` will not run without them.
