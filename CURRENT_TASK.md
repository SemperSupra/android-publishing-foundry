# CURRENT_TASK — W0 contracts and fail-closed qualification

Status: **ready for bounded execution**, not implemented. DLE PR on `SemperSupra/.github#5` is prior planning context.

## Priority order
1. Create/validate a canonical `schemas/app-manifest.schema.json` and example manifest for a fully open-source application. Include applicationId, versionName, integer versionCode, license SPDX id, source SHA, supported channels, min/target SDK, free-tier-only policy, manual release approval, and expected signing fingerprint when releasing.
2. Implement a Go stdlib manifest semantic validator (separate schema validation mechanism may be needed). Tests must reject at least 20 distinct fail-closed inputs, including invalid channel, missing license/provenance, invalid package, version regression, missing manual gate, signing mismatch, unavailable account or authorization.
3. Document per-channel artifact, signing and update compatibility in `docs/architecture/distribution-contract.md`; do not claim seamless cross-store APK updates.
4. Add unprivileged, read-only public CI contract checks; pin any third-party GitHub Actions by full SHA.
5. Record a machine-readable evidence receipt and exact green/negative test output. Prepare the next W1 sample app and toolchain pinning baton.

## Definition of Done
A reviewed PR has compilable validation tool, tests including >=20 negative fixtures, deterministic manifest/evidence schemas, safe dry-run; no secrets, payments, release API use or publication. Explicitly mark all external account/store steps blocked until actual approval.

## Mandatory disposable/GHCR/three-audience requirements (2026-11-17)
Read `docs/architecture/disposable-multi-audience-platform.md`. W0 must include a pinned GHCR OCI toolchain manifest and negative digest/registry cases, worker cleanup/host-non-taint criteria and human/automation/agent contracts (English/German/Thai UI). W1 builds run only on disposable isolated runners/containers; no permanent SDKs on host. Separate signed publishing stage consumes verified immutable candidate and explicit manual authorization. GHCR is preferred for all built/consumed toolchain and service containers. Do not claim images exist until pushed and digest-qualified.
