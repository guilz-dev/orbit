# Kubernetes / Docker Knowledge

Container image and Kubernetes deployment patterns. Pair with `backend` and `reliability-slo`, `incident-response` knowledge.

## Images

| Criteria | Judgment |
|----------|----------|
| Building on a `:latest` base tag | REJECT (pin versions) |
| Running the container as root | REJECT (non-root user) |
| Secrets baked into the image / Dockerfile | REJECT |
| No multi-stage build; build tools shipped to prod | Warning (bloated, larger attack surface) |
| `.dockerignore` missing (context includes `node_modules`, `.git`) | Warning |

- Pin base image versions, build multi-stage, run as non-root, keep images minimal.
- Pass secrets at runtime (env/secret mounts), never bake them in.

## Kubernetes Workloads

| Criteria | Judgment |
|----------|----------|
| No resource `requests`/`limits` | REJECT (noisy-neighbor, OOM, eviction) |
| No liveness/readiness probes | REJECT |
| App not handling `SIGTERM` / no graceful shutdown | REJECT (dropped requests on rollout) |
| Secrets in plain ConfigMaps / committed manifests | REJECT (use Secrets / external secret store) |
| Mutable config requiring image rebuild | Use ConfigMap/env |

- Set requests/limits, liveness + readiness probes, and handle `SIGTERM` for graceful shutdown.
- Make pods stateless and horizontally scalable; externalize state.

## Reliability & Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| `latest` image tag in deployments | Non-reproducible rollouts |
| One replica for a stateless service | No availability during rollout/failure |
| Storing state on local pod disk | Lost on reschedule (use PV/external) |
| Readiness == liveness (same check) | Restart storms vs. traffic gating confused |
| No rollout strategy / PodDisruptionBudget | Downtime on updates |
