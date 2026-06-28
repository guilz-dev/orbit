Focus on reviewing **security in depth**.

Procedure:
1. Open the Security- and Privacy-related Knowledge and Policy Source paths with the Read tool and obtain the full content.
2. List every `##` section in each of them (do not cherry-pick).
3. Match the criteria in each listed section against the diff, the trust boundaries, the data flow, and the build/dependency path, and detect any issues.

## Step-Specific Notes

- Make exploit paths concrete: who controls what input, what asset is exposed, and what new capability becomes possible.
- Review authentication and authorization separately; “logged in” is not proof of access.
- Check secrets handling, dependency/provenance changes, admin/export paths, and privacy-sensitive data flow explicitly.
