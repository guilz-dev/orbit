# Privacy Knowledge

Privacy work governs what personal data is collected, why it is needed, who can see it, how long it stays, and how it is deleted or exported.

## Data Minimization

| Principle | Guidance |
|-----------|----------|
| Purpose limitation | Collect data only for a stated product or operational purpose |
| Minimum necessary | Store the least sensitive / least granular form that still works |
| Default retention | Define retention and deletion behavior up front |
| Access scope | Limit personal data access by role and task need |

## Data Lifecycle

| Stage | Guidance |
|-------|----------|
| Collection | Explain what is collected and where it enters the system |
| Storage | Classify sensitive fields and protect them in transit and at rest |
| Use | Avoid reusing data for unrelated purposes without explicit basis |
| Deletion | Support deletion / retention expiry without orphaned copies |
| Export | Audit who can export data and in what scope |

## Sensitive Data Handling

| Concern | Guidance |
|---------|----------|
| Logs and analytics | Avoid raw personal data where aggregate or pseudonymous signals are enough |
| Testing | Use synthetic or anonymized data unless real data is strictly required and protected |
| Third parties | Share only what is required; record processor/vendor responsibility |
| Regional rules | Note residency or lawful-basis constraints when they matter to design |

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Collecting “nice to have” data with no use owner | Privacy debt and unnecessary exposure |
| Indefinite retention by default | Expanding breach impact |
| Admin/export paths broader than normal product scope | Silent data overexposure |
| Real personal data copied into fixtures, screenshots, or docs | Persistent leakage |
