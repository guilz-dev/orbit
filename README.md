# Orbit

**Orbit** is a maintained fork of [TAKT](https://github.com/nrslib/takt) (TAKT Agent Koordination Topology). It ships as the bundled AI workflow engine for [Planetz Agent Deck](https://github.com/guilz-dev/planetz).

Upstream TAKT documentation, quick start, and CLI reference live in [`README.takt.md`](./README.takt.md). Use that file when you need the full product guide for the engine itself.

## Relationship to TAKT

| | **Orbit** (this repo) | **TAKT** (upstream) |
|---|------------------------|---------------------|
| Maintainer | [guilz-dev](https://github.com/guilz-dev) | [nrslib](https://github.com/nrslib) |
| Primary use | Bundled engine for Planetz Agent Deck | Standalone CLI and ecosystem |
| CLI binary | `takt` (unchanged) | `takt` |
| License | MIT (see [LICENSE](./LICENSE)) | MIT |

Orbit tracks upstream TAKT and adds Guilz-specific builtins, fixes, and release cadence required for Planetz. The runtime package name and CLI remain `takt` for compatibility with upstream workflows and configuration.

## Build

Requires Node.js 24.x.

```bash
npm ci
npm run build
npm test
```

Entry point used by Planetz bundling: `dist/app/cli/index.js`.

## Documentation

| Document | Description |
|----------|-------------|
| [README.takt.md](./README.takt.md) | Upstream TAKT README (preserved) |
| [docs/](./docs/) | TAKT guides (CLI, workflows, configuration) |
| [CHANGELOG.md](./CHANGELOG.md) | Release history |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |

## Third-party and attribution

Orbit is derived from TAKT. Copyright and license terms from upstream are preserved in [LICENSE](./LICENSE). When redistributing Orbit inside another product, keep upstream copyright notices as required by the MIT License.

## Links

- Upstream TAKT: https://github.com/nrslib/takt
- Planetz Agent Deck: https://github.com/guilz-dev/planetz
