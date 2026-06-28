# Secrets Management Knowledge

Secrets include API keys, signing keys, database passwords, client secrets, tokens, certificates, and any credential that grants access.

## Storage and Distribution

| Concern | Guidance |
|---------|----------|
| Source control | Never commit secrets; use secret stores and templates only |
| Runtime delivery | Inject secrets at runtime from a managed store, not from copied local files |
| Scope | Issue separate secrets per environment, service, and trust boundary |
| Rotation | Design for rotation without downtime where practical |

## Exposure Control

| Topic | Guidance |
|-------|----------|
| Logs | Never log raw secret values or headers that carry them |
| Client apps | Do not embed server secrets in mobile/web bundles |
| CI/CD | Minimize who/what can read deployment secrets; prefer short-lived credentials |
| Local dev | Use safe examples and `.env.example`, never real values in docs or fixtures |

## Operational Practices

| Practice | Why it matters |
|----------|----------------|
| Inventory secrets and owners | Prevent orphaned credentials |
| Rotation drills | Proves the recovery path works before an incident |
| Revocation plan | Required for leaked or over-scoped credentials |
| Access audit | Detect unexpected readers and privilege creep |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| One shared secret for every environment | Cross-environment blast radius |
| Long-lived human tokens used in automation | Hard to rotate, easy to leak |
| Secrets passed through many intermediate files | More exposure points |
| Base64/obfuscation treated as protection | Not actual security |
