# Authentication & Authorization Knowledge

Identity proof (authentication) and permission decision (authorization) are separate concerns and must be designed separately.

## Authentication Basics

| Concern | Guidance |
|---------|----------|
| Identity proof | Choose an explicit mechanism: password, SSO/OIDC, token, mTLS, signed request |
| Session | Define token/session lifetime, rotation, revocation, and storage |
| Recovery | Password reset / account recovery must not bypass the main trust model |
| Service auth | Separate human auth from service-to-service credentials |

## Authorization Design

| Model | Guidance |
|-------|----------|
| RBAC | Useful when permissions map cleanly to roles |
| ABAC / policy checks | Useful when access depends on resource attributes or tenancy |
| Ownership checks | Define who can access “their own” resources and admin override |
| Least privilege | Default deny, grant the minimum needed capability |

- Authentication answers “who are you?”
- Authorization answers “can you do this, on this resource, in this context?”

## Boundary Cases

| Failure mode | Problem |
|--------------|---------|
| Endpoint trusts client-provided role/tenant/user id | Privilege escalation |
| Auth check exists but object-level access check is missing | IDOR / data leak |
| Admin path reuses standard user flow with hidden UI only | Security by obscurity |
| Long-lived tokens with no revocation path | Persistent compromise window |

## Review Focus

- Verify session invalidation on logout, password change, and credential rotation where required.
- Check multi-tenant boundaries explicitly: query scope, cache key, background job context, export path.
- Distinguish “authenticated” from “authorized”; both must be proven.
