# Security Policy

REJECT / APPROVE criteria for security-sensitive changes. Reviewers enforce **only** what is listed here.

## Applicability

Applies when the change touches authentication, authorization, secrets, network/file/process boundaries, dependency supply chain, or sensitive data handling.

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| Missing authorization check on a newly exposed sensitive action or resource path | REJECT |
| User-controlled input reaches SQL, shell, file path, template, or HTML execution sink unsafely | REJECT |
| Secrets, tokens, signing keys, or sensitive headers are hardcoded, committed, or logged | REJECT |
| New dependency / build hook / base image is introduced with no trust or provenance review | REJECT |
| Sensitive data is exposed through error messages, exports, or overly broad admin path | REJECT |
| Security-relevant defaults become weaker without explicit rationale and compensating controls | REJECT |
| Security-sensitive code path changes with no regression test or verification evidence | REJECT |
| Additive defense-in-depth checks beyond the spec | OK |

## Review Procedure

1. Open the relevant Knowledge sources in full.
2. List every `##` section from those Knowledge sources and this Policy.
3. Match each section against the diff, the data flow, and the trust boundary.
4. APPROVE only when no REJECT criterion is hit.
