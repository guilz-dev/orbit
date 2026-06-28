# Incident Response Knowledge

Responding to production incidents: detect, stabilize, communicate, recover, and learn. Pair with `reliability-slo` and `release-rollback`.

## Lifecycle

| Phase | Guidance |
|------|----------|
| Detect | Confirm symptoms, affected surface, start time, and blast radius |
| Contain | Stop the spread first: disable, isolate, rate limit, or roll back |
| Recover | Restore the service safely with the smallest reversible action |
| Communicate | Keep stakeholders updated with facts, impact, and next checkpoint |
| Learn | Produce a blameless postmortem with follow-up actions |

- Optimize for time-to-stabilize, not perfect diagnosis on the first pass.
- Track decisions with timestamps: what changed, who approved it, and observed effect.

## Severity and Ownership

| Concern | Good practice |
|---------|---------------|
| Severity | Use a clear severity model tied to user impact and business impact |
| Incident lead | One person coordinates; many people contribute |
| Escalation | Escalate early when data loss, security exposure, or sustained outage is possible |
| Handover | Keep a written timeline so responders can rotate without losing context |

## Evidence and Recovery

| Topic | Guidance |
|-------|----------|
| Evidence | Preserve logs, traces, metrics, deploy/version info, and user reports |
| Mitigation | Prefer reversible actions: feature flag off, traffic shift, rollback, queue pause |
| Data safety | If data integrity is uncertain, stop writes before broad recovery attempts |
| Verification | Define what “recovered” means: error rate, latency, backlog, user path health |

## Postmortem Quality

| Anti-pattern | Problem |
|--------------|---------|
| Root cause guessed before evidence is collected | Misdiagnosis and repeated incidents |
| Fixing only the immediate bug | Latent detection, tooling, or process gaps remain |
| No owner / due date for follow-up | Learnings never become system changes |
| Timeline reconstructed from memory only | Important facts get lost or distorted |
