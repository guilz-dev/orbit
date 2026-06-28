# Microsoft Azure Knowledge

Azure service and identity patterns. Pair with `kubernetes-docker`, `reliability-slo`, `incident-response`.

## Identity & Security

| Criteria | Judgment |
|----------|----------|
| Connection strings / secrets in app settings instead of Key Vault | REJECT |
| Service principal secrets long-lived instead of Managed Identity | REJECT |
| Over-broad RBAC role (Owner/Contributor) on workloads | REJECT (least privilege) |
| Storage/Key Vault with public network access open | REJECT |

- Prefer Managed Identity over service-principal secrets; store secrets in Key Vault.
- Assign least-privilege RBAC at the narrowest scope; lock down network access (Private Endpoints).

## Services & Architecture

| Concern | Guidance |
|---------|----------|
| Web/API hosting | App Service / Container Apps (scale rules, health checks) |
| Async/messaging | Service Bus with dead-letter queues |
| Managed SQL | Azure SQL (private endpoint, geo-backup) |
| Functions | Consumption/premium plans; idempotent handlers |

| Criteria | Judgment |
|----------|----------|
| Messaging consumer without retry/dead-letter | REJECT |
| No health probes / scale rules | Warning |
| Infra changed via portal (no IaC: Bicep/Terraform) | Warning |
| No diagnostic settings / log export | Warning |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Secrets in App Settings plaintext | Leakage |
| Over-privileged RBAC | Large blast radius |
| Portal click-ops | Non-reproducible |
| No cost/budget alerts | Cost surprises |
