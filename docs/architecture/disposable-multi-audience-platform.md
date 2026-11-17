# Disposable, stateless, GHCR-first, three-audience architecture
Owner requirements: 2026-11-17. Status: mandatory DLE **design contract**, not yet implemented or qualified.

## Non-negotiable invariants
1. Development, testing, compilation, packaging, signing adapters and deployment tooling run on **ephemeral isolated runners/containers/VMs**. No permanent JDK, Gradle, Android SDK, Python, fdroidserver, Node.js, Vega SDK or deployment CLI installs on development/build/deploy hosts. Use pre-existing runner/virtualization substrate only, with no ordinary workload mutations. Prefer GitHub-hosted public standard Linux runners; local Windows PS 5.1 is a dispatch client, not a build host.
2. GHCR (`ghcr.io/SemperSupra/...`) is preferred for **all images we build and consume**: toolchains, validators, emulators when supported, signing-service tooling and stateless deployable services. OCI image builds originate from pinned Dockerfiles, reviewed base digests and locked dependencies; publish only through separate authorized workflow. Use digest-pinned references `@sha256:...`, never trust floating tags as identity. Record image digest, SBOM, attestations, OCI source label, toolchain compatibility and vulnerability evidence. Public images are preferred to preserve independent public CI; privileged/private images must not leak private sources or keys.
3. GHCR is **not** the canonical publishing surface for user APK/AAB/VPKG binaries or F-Droid indexes. Those go to approved GitHub Releases, Pages or store channels with separate signed evidence. GHCR can carry OCI test fixtures or wrapped artifacts only where justified.
4. Execution workers stateless: ephemeral HOME/XDG/TMP and workspace; no writable host HOME, Docker socket or shared device mounts; nonroot where possible, resource/time/network budget and explicit teardown. A GHCR-hosted container alone is not a full security boundary; qualify runner VM, mounts, kernel, permissions and execution trust. For emulators/KVM/USB hardware incompatible with containers use disposable VM jobs or explicitly qualified ephemeral HIL. No assumptions about free hosted hardware acceleration.
5. Durable state lives **outside** workers: Git source/DLE; GHCR immutable image digest; external released artifacts; approval receipts; owner-controlled offline/approved secret custody; durable DB or user-device app storage. Android device app sandbox is stateful by design; a disposable deployment artifact does not erase user data. Services use immutable OCI image + external persistent state, safe migrations/backups and redeploy/recovery.
6. Separate unprivileged build from authorized production signing/publication; no production keys or store tokens in public PRs, images, layer history, caches, provenance, logs, Dockerfile build args or public artifacts. No privileged `pull_request_target` checkout of untrusted source. Manual approval **per exact source SHA, candidate artifact hash, signing identity, app/version and destination**.
7. Toolchain image promotion state: source declaration → build → scan/license/SBOM → verify/digest → qualify on clean runner → owner-approved image catalog → digest-pinned consumer. New image tag or base release cannot silently replace approved digest. Refresh as bounded separate PR with rollback and compatibility report. Reuse lifecycle principles from Model Artifact Foundry without placing Android OCI images under its existing model/checkpoint authority.
8. Zero additional cloud expense: free standard public GHA runners, public GHCR packages, bounded jobs, image retention and storage. GitHub docs currently say GHCR container image storage/bandwidth is free; verify terms before rollout and fail closed on paid capacity. Avoid private-runner overage; no automatic cloud resource purchase.

## Toolchain roster / qualification
| Capability | Preferred technology | Image/workflow proposal |
|---|---|---|
| Android source | Kotlin, Java interop, Jetpack Compose, AndroidX | source in consumer repo; ephemeral Android build container |
| SDK/build | pinned JDK, Gradle wrapper + checksum, AGP, Android SDK CLI/build-tools (optional NDK) | `ghcr.io/sempersupra/android-build-toolchain@sha256:<approved>` |
| Test | JUnit, lint, Robolectric as justified, Android emulator/ADB + actual devices | toolchain + disposable emulator VM; `ghcr.io/sempersupra/android-test-toolchain` if supportable |
| Orchestrator | Go stdlib-first manifest/receipt validator, store API adapters, JSON Schema | `ghcr.io/sempersupra/android-publisher-cli` and standalone statically linked binary |
| F-Droid | isolated fdroidserver/Python, lint/build/update/sign | `ghcr.io/sempersupra/fdroid-toolchain` |
| Play | Play Developer Publishing API, upload-key-signed AAB, Play App Signing | CLI container, credential-less mock in PR |
| Amazon Fire OS | Android build/ADB + Amazon App Submission API | Android CLI with Fire OS variant and isolated API mock |
| Vega (P2) | Node.js/TypeScript, React Native, Vega SDK/VPKG CLI | separately qualified Ubuntu/macOS ephemeral VM; container feasibility unknown |
| Security | SHA256, SPDX SBOM, Syft, OSV-Scanner, CodeQL/Semgrep, signed provenance/cosign if approved | scanned, versioned standalone or tooling image |
| Service delivery | immutable OCI services, GHCR registry, stateless frontends | digest-pinned compute; databases/objects persist externally |

Build and consume exact pinned images. `ghcr.io/sempersupra/...:vX` is a human-friendly locator, `@sha256:...` is the actual runtime identity. Tags for proposed images above are examples, not published products.

## Three audiences — mandatory feature parity
- **Human:** keyboard/touch/TV remote accessibility, internationalization English/German/Thai, documentation, GUI and release/installation guidance, privacy/errors/consent; explain features unavailable by device family.
- **Deterministic automation:** stable and documented CLI/HTTP API, JSON/JSON Schema contract, exit statuses, `plan`/`validate`/`apply`/`status`, idempotency keys, retries with side-effect boundaries, version negotiation, auditable machine-readable release receipts.
- **Agent/reasoning:** structured capability/tool discovery, schemas and examples, AGENTS.md + DLE, constrained permissions and budgets, dry-run, falsifier/critic findings, exact model/runtime provenance, human steering capture, resumable cross-wake execution. Agent approvals cannot replace human publication authorization.
All human-facing UI and error catalog targets English, German, Thai; automated APIs use stable language-neutral codes.

## Pipeline trust diagram
human / CLI / agent request → validated manifest → ephemeral public GHA VM → digest-pinned GHCR toolchain → isolated build+test → signed candidate *or unsigned candidate* + hash/SBOM/provenance → external evidence store → job destruction → separate manual owner gate → ephemeral trusted publish job → verify digest/approval → store API/GitHub Release/signed F-Droid index → external immutable receipt → job destruction.

## Qualification hard gates
1. Re-run two builds on distinct fresh workers, compare APK/content digests or document exact nondeterminism; verify identical pinned GHCR toolchain digest.
2. Host non-taint: compare package inventory/workspace/credential state before/after, no host home or Docker socket mounted; dispose worker; destroy mid-task then resume solely from Git SHA + external artifact digest.
3. GHCR negative cases: tag moved, registry 404/401, digest mismatch, poisoned dependency cache, revoked image, malicious upstream base, image missing SBOM/attestation, package visibility mismatch: fail closed.
4. Store signing/update identity + versionCode and Android installed-data persistence across upgrade, as established in distribution contract.
5. Three audience tests per capability: human accessible localized walkthrough (EN/DE/TH), scripted CLI/API schema/exit-code conformance and agent-driven dry-run with policy constraint.
6. Service recreation from digest with independent external persistent database, controlled schema migration and rollback/forward-fix plan; prove application data survives worker deletion.
7. Zero-fee budget/resource ledger, no paid runner/hosting path.

## Sequencing
W0: implement GHCR OCI image declaration/schema, audience contract, isolation and trust model, negative tests. W1: produce and qualify pinned GHCR Android build and Go validator images on public CI. W2: split candidate from privileged signing and GHCR-pinned publish tooling with owner approval; direct APK + self-hosted F-Droid MVP. W3/W4: official F-Droid and store API adapters from GHCR images. W5: multi-app services, models/critics and Vega P2.
