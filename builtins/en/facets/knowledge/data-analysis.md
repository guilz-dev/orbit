# Data Analysis Knowledge

Data analysis turns raw data into decisions. Focus on decision-oriented questions, reproducibility, and clear communication.

## Analysis Workflow

| Criteria | Judgment |
|----------|----------|
| No explicit analysis question or decision target | REJECT |
| Conclusion written before defining methodology | REJECT |
| Manual ad-hoc spreadsheet steps without reproducible query/script | Warning |
| Insight based on one snapshot without trend or cohort context | Warning |

- Start with a decision question, then define metric, population, time window, and comparison group.
- Keep the analysis path reproducible (SQL/query notebook/script) so results can be re-run.

## Data Quality and Bias Checks

| Check | Guidance |
|-------|----------|
| Missing values / null handling | State treatment rules explicitly |
| Duplicate records | De-duplicate before aggregation |
| Time alignment | Use consistent timezone and event-time boundaries |
| Sampling bias | Verify representativeness before generalization |

## Communication

| Anti-pattern | Problem |
|--------------|---------|
| Reporting only averages with no distribution | Hides skew and outliers |
| Correlation presented as causation | Invalid decision rationale |
| No uncertainty statement | Overconfidence in noisy data |

- Report key assumptions, limitations, and confidence level with each conclusion.
