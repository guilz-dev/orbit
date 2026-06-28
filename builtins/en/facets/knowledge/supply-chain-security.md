# Supply Chain Security Knowledge

Software risk includes what you build, what you download, and what your tooling executes on your behalf.

## Dependency and Provenance Controls

| Concern | Guidance |
|---------|----------|
| Version pinning | Use lockfiles and deterministic install paths |
| Source trust | Prefer maintained packages from known registries or reviewed internal mirrors |
| Provenance | Record where critical binaries/images come from and how they are verified |
| Update policy | Regularly patch vulnerable dependencies; know the upgrade owner |

## Build and CI Safety

| Topic | Guidance |
|-------|----------|
| Build scripts | Treat postinstall / codegen / plugin hooks as executable code |
| CI secrets | Do not expose high-privilege credentials to untrusted pull requests |
| Artifact publishing | Protect release pipelines, signing keys, and registry tokens |
| Review | Changes to dependency graph, container base image, or build hooks deserve explicit review |

## Distribution and Runtime

| Concern | Guidance |
|---------|----------|
| SBOM | Be able to answer what dependencies and versions shipped |
| Image/base OS | Keep base images small, current, and scanned |
| Integrity | Verify checksums or signatures for downloaded critical artifacts |
| Vendor code | Track local patches and upgrade path if vendoring is necessary |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Adding dependencies without ownership or patch plan | Vulnerabilities accumulate silently |
| Blindly trusting generated lockfile diffs | Malicious or accidental dependency drift |
| Running arbitrary installer scripts from unknown sources | Code execution at build time |
| Shared publish credentials across many repos or humans | Large compromise blast radius |
