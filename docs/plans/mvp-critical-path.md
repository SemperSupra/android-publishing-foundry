# Android Publishing Foundry — DLE execution roadmap
Date: 2026-11-17. **Proposed** waves; see exact running CI/PR evidence before claiming completion.

## Durable rules
Targets: direct APK, self-hosted F-Droid, official F-Droid, Amazon Fire OS Appstore, Google Play. Manual owner gate for each production publication; optional proprietary APIs must not contaminate F-Droid FLOSS baseline. Free-tier hosted cloud execution only. Google Play developer fee ($25 if no existing account) is external paid blocker, not included in the free CI promise. Amazon identity verification is an owner-only step. Vega OS is separate post-MVP frontend.

## Critical path
W0 contracts → W1 original FLOSS Android pilot + unprivileged CI → W2 secure signing / reproducibility / provenance / install & upgrade tests → G1 human approval → **MVP: verified direct APK + signed self-hosted F-Droid repo publication**.

## Parallel but off critical path
- W3 (P1): official fdroiddata inclusion, build and lint proof, external acceptance. Owner approves request.
- W4 (P1): Amazon and Google Play mock adapters, dry-run/read-only checks, credentials/access via owner-only gates, authorized test tracks, then separate manual public-production approval.
- W5 (P2): multiple consumer apps, policy drift, notification/recovery, bounded critics, optional Vega OS.
External store reviews never block W2 MVP.

## W0 (P0) — durable contract, no production effects
Deliver channel matrix, schema+semantic validation, >=20 negative tests, actor/run evidence, threat model, F-Droid license/anti-feature rules, signing compatibility and account-blocker ledger. Exit: PR checks pass, missing facts fail closed. Parallel reps: A schema, B store policy, C threat model, D fixture corpus.

## W1 (P0) — independent build
Kotlin, pinned Gradle wrapper checksum, AGP/JDK/SDK dependencies and verification; build variants only when actual divergence. On standard GitHub-hosted Ubuntu CI run lint/unit/build, license scan, SBOM, secret scan, emulator smoke test (bounded capacity). Exit: independently rebuilt known commit, no forbidden dependencies, evidence logs and no privileged PR secrets.

## W2 (P0) — signed distribution
Separate test and owner-held production signing; owner-controlled backup/restore. Compare independent clean build outputs, record nondeterminism. Make candidate APK, checksum, SBOM, provenance, signed F-Droid metadata/repo index, GitHub Release and Pages publication **only after G1**. Verify Android versionCode monotonicity, matching applicationId/cert and update N→N+1 on eligible device; emulator evidence is not physical-device evidence. Exit: human-approved real installation/update with receipt.

## W3 (P1) — official F-Droid
Generate fdroiddata recipe, apply inclusion rules, lint/build, submit owner-approved MR. Track submitted/in-review/live/rejected states separately; upstream signing path may differ and reproducible signature verification needs specific proof. Exit: actual live listing or explicit external blocker.

## W4 (P1) — store adapters
Amazon initial console app creation and identity verification are not assumed API-automatable; supported app updates via App Submission API. Google Play paid registration, identity/testing prerequisites, Play App Signing, upload-key-signed AAB and developer API. Dry-run tests for auth failure, 429, conflicts, duplicate submissions, bad versions and failed approvals. Production stays blocked until owner approves exact candidate.

## W5 (P2) — multi-app operations
Maintain app manifests, release state machine, notifications, updates, issue/PR evidence and model critic reports. All critics advisory; release approval remains manual.

## Evidence and state machine
States: source → built → qualified → candidate → approved(channel,sha,cert,version) → submitted → in_review → live|rejected; statuses and receipts are immutable by version. Log exact commit SHA, Gradle/Android toolchain, binaries SHA256, signing certificate SHA256, license/asset attestations, tests, release actor, reviewer decision, external receipts and free resource usage. Fail closed if candidate identity changes or approval expires.

## Owner gates
G0 initial app/applicationId/license and intended test project; G1 release-key custody and per-candidate production publication; G2 official F-Droid inclusion approval; G3 Amazon identity/API access; G4 Play account fee and verification; G5 per-channel per-version production approval. Publishing is not equivalent to packaging, and there is no autonomous production authorization.

## Sources for actors to reverify at implementation
F-Droid: https://fdroid.gitlab.io/jekyll-fdroid/en/docs/Inclusion_Policy/
Amazon: https://developer.amazon.com/docs/app-submission-api/overview.html
Play: https://developer.android.com/studio/publish/app-signing
GitHub billing: https://docs.github.com/en/billing/concepts/product-billing/github-actions
