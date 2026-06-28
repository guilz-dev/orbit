# Observability Knowledge

Logging, metrics, and tracing patterns. Pair with `backend`, `kubernetes-docker`, `performance`.

## Logging

| Criteria | Judgment |
|----------|----------|
| Unstructured `print`/`console.log` in services | REJECT (structured logs) |
| Logging secrets / PII / full request bodies | REJECT |
| No correlation/request ID across a request's logs | REJECT |
| Logging at the wrong level (errors as info, noise as error) | Warning |

- Emit structured logs (JSON) with a correlation/trace ID so a request can be followed across services.
- Never log secrets or PII; redact at the boundary.

## Metrics & Traces

| Criteria | Judgment |
|----------|----------|
| No metrics on key paths (latency, error rate, throughput) | REJECT |
| Alerting on causes (CPU) instead of symptoms (SLO/latency/errors) | Warning |
| No distributed tracing across service boundaries | Warning |
| High-cardinality labels exploding metric series | REJECT |

- Track the golden signals (latency, traffic, errors, saturation). Alert on user-facing symptoms / SLO burn, not raw resource counters.
- Propagate trace context across services; keep metric label cardinality bounded.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Logs as the only telemetry | No aggregate view, expensive to query |
| Alert fatigue (too many noisy alerts) | Real incidents missed |
| No dashboards / SLOs | Can't tell healthy from broken |
| Telemetry added only after an incident | Blind during the incident |
