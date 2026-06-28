The ux-review ↔ fix loop has repeated {cycle_count} times.

Review the latest ux-review.md reports in the Report Directory and determine
whether this design-doc fix loop is healthy (converging) or unproductive.

**Judgment criteria:**
- Are the same finding_ids persisting across multiple cycles without ui-design.md updates?
  - Same finding_id repeatedly persists → unproductive (stuck)
  - Previous findings resolved and new findings appear as new → healthy (converging)
- Are fixes actually applied to ui-design.md or related design artifacts?
- Is the number of new / reopened UX findings decreasing overall?

For code or implementation fixes, route the operator to review-fix-frontend instead of continuing this loop.
