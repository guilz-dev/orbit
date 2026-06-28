# Privacy Policy

REJECT / APPROVE criteria for privacy-sensitive changes. Reviewers enforce **only** what is listed here.

## Applicability

Applies when the change collects, stores, exports, logs, analyzes, or broadens access to personal or otherwise sensitive user data.

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| New personal/sensitive data is collected with no clear product or operational purpose | REJECT |
| Sensitive data is logged, copied into fixtures/docs, or exposed in screenshots/test output | REJECT |
| Data export, search, or admin access becomes broader than the stated need | REJECT |
| Retention/deletion behavior for newly stored sensitive data is undefined | REJECT |
| Third-party sharing is added with no minimization or responsibility boundary | REJECT |
| Privacy-sensitive path changes with no verification evidence or regression test where needed | REJECT |
| Additional masking, deletion support, or minimization beyond the spec | OK |

## Review Procedure

1. Open the relevant Knowledge sources in full.
2. List every `##` section from those Knowledge sources and this Policy.
3. Match each section against the diff, data lifecycle, and access path.
4. APPROVE only when no REJECT criterion is hit.
