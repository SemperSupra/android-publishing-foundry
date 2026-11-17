# Agent Operating Contract — Android Publishing Foundry

Read `README.md`, `CURRENT_TASK.md`, and current DLE/PR state before any work. Source-of-truth order: live repo/branch/issues/PRs; this contract and CURRENT_TASK; architecture/schema; upstream dated evidence; historic chat.

## Execution loop
Observe/Discover → Plan → Act → Verify, bounded independent reps. Prefer Go stdlib for release orchestration and Kotlin/Gradle for Android pilot. Record actor identity, model/effort, OS, cwd, repo/ref, resource limits, exact SHA and test evidence in every baton. Preserve idempotence, reversibility, and reproducibility.

## Trust and financial rules
- No paid cloud resources or services; prefer standard public GitHub-hosted Linux runners, bounded timeouts and concurrency.
- No credentials in commits, test fixtures, PR artifacts, issue comments or logs. Public CI must never read the private companion.
- No release signing keys, API credentials, or privileged publishing access on untrusted PRs. Do not execute untrusted checkout under privileged pull_request_target. Pin third-party Actions to reviewed full SHA.
- No autonomous production uploads, store submissions, F-Droid public index changes, or public GitHub release publication. **Each production target requires owner approval tied to exact hash, source revision, signing fingerprint, channel, and versionCode.**
- Never merge unreviewed PRs; preserve public/private airlock.
- Preserve open-source license and provenance, ensure F-Droid baseline has no incompatible proprietary SDKs.
- Reasoning and VLM critics may object and collect evidence but cannot approve releases.

## Do now
Implement W0 manifest/schema validation with deterministic negative fixtures and no network effects; follow `CURRENT_TASK.md`. Do not silently treat proposed future store integration as verified functionality.
