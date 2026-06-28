Focus on reviewing **reliability and operational safety**.

Procedure:
1. Open the Reliability-related Knowledge and Policy Source paths with the Read tool and obtain the full content.
2. List every `##` section in each of them (do not cherry-pick).
3. Match the criteria in each listed section against the diff, runtime path, release plan, and rollback path, and detect any issues.

## Step-Specific Notes

- Check timeout, retry, idempotency, degradation, and recovery behavior on every new critical path.
- Verify mixed-version, migration, and rollback compatibility when schemas, jobs, events, or deploy sequencing change.
- Look for missing observability on critical behavior: success/failure signals, saturation, and verification checkpoints.
