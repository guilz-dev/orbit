# Google Cloud (GCP) Knowledge

GCP service and IAM patterns. Pair with `kubernetes-docker`, `reliability-slo`, `incident-response`, `terraform-aws` (for IaC discipline).

## IAM & Security

| Criteria | Judgment |
|----------|----------|
| Using primitive roles (`Owner`/`Editor`) for workloads | REJECT (least privilege) |
| Service account keys exported as long-lived JSON files | REJECT (use Workload Identity / ADC) |
| Secrets in env/config instead of Secret Manager | REJECT |
| Public storage bucket / dataset by default | REJECT |

- Grant least-privilege predefined/custom roles to service accounts; avoid primitive roles.
- Use Workload Identity / Application Default Credentials instead of downloaded SA keys; store secrets in Secret Manager.

## Services & Architecture

| Concern | Guidance |
|---------|----------|
| Stateless HTTP/event services | Cloud Run (autoscale to zero, concurrency) |
| Async/decoupling | Pub/Sub with dead-letter topics |
| Managed SQL | Cloud SQL (private IP, automated backups) |
| Scheduled jobs | Cloud Scheduler + Cloud Run/Functions |

| Criteria | Judgment |
|----------|----------|
| No retry/dead-letter on Pub/Sub consumers | REJECT |
| Cloud SQL exposed on a public IP | REJECT |
| No autoscaling / resource limits set | Warning |
| Infra changed by hand in console (no IaC) | Warning |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Over-broad IAM | Blast radius on compromise |
| Long-lived SA keys | Credential leakage |
| Click-ops infrastructure | Non-reproducible, undocumented |
| No budget/quota alerts | Cost surprises |
