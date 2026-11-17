# First-app portfolio assessment — 2026-11-17
Status: proposed ranking / planning evidence, **not implementation authority or a release approval**. Review before merging public DLE.

## Decision
Recommended distinction:
- **Foundry qualification fixture:** tiny original Hello Distribution Kotlin app. This is *test infrastructure*, not an Appstore product.
- **First publicly valuable app:** **APK Lens**, a *new* clean-source Android app inspired by `SemperSupra/android-artifact-recovery`, initially local/offline APK metadata, cert and permissions inspection, report export. Do **not** represent AAR's experimental Ghidra/native holdouts as production-qualified.
- **Second app:** **AgentWebCam Android**, separate Kotlin/CameraX implementation of camera/mobile capture experience derived from `SemperSupra/AgentWebCam`, local-first, opt-in sharing/API; permissions and camera HIL gate.
- **Third app:** **Device Observatory** (read-only authorized connected-device diagnostics), from `SemperSupra/connected-device-recovery` / Wyse/device work; device permissions, authenticated access and network privacy make it later.
- **Fourth:** SemperSupra Release Companion, optionally site/PWA first, because F-Droid itself already updates installed apps; don't build redundant installer for MVP.
- **Fifth:** Sovereign AI Client / SupraChat mobile, only after supported auth/model API, network and account handling qualified.
Deferred: AU Companion mobile (Windows-first private AU/SPARK provider access and public airlock), Stable Character viewer (backend/artifact availability and large media dependencies), AgentKVM2USB control (hardware HID forwarding unproven), general Fire TV apps (touch UI unsuitable; device-specific D-pad qualification), passive LAN scanning without consent.

## Ranking rubric (0–5, estimated, NOT empirical qualification)
Axes: user utility (U), existing validated reusable foundation (R), ease/safety of open-source offline publication (S), Foundry pipeline coverage (P), near-term effort fit (E). Equal weights; total /25. Scores are *planning assumptions* that should be falsified by spike.
| Candidate | U | R | S | P | E | Total | Rationale |
| APK Lens metadata-first | 4 | 4 | 5 | 5 | 5 | 23 | AAR parser and Android knowledge; no backend/account; exercises Android content access, signing, permissions and report schema |
| AgentWebCam Mobile | 4 | 3 | 3 | 5 | 3 | 18 | existing desktop Python features; native rewrite, camera/privacy and real-device requirements |
| Device Observatory | 4 | 3 | 3 | 4 | 3 | 17 | connected device and fleet expertise; network permissions and multi-hardware qualification |
| SemperSupra Release Companion | 3 | 2 | 5 | 3 | 3 | 16 | strong dogfood/catalog; risk of duplicating F-Droid client; better after >=2 apps |
| Sovereign AI Client | 5 | 3 | 2 | 4 | 1 | 15 | SupraChat desktop core exists; Android supported auth, credentials, backend and privacy complex |
| AU Companion Android | 4 | 2 | 1 | 3 | 1 | 11 | currently Windows-first; specialized private AU/credential data and provider-airlock |
| AgentKVM2USB mobile controller | 3 | 2 | 2 | 4 | 1 | 12 | platform/USB role and target-side HID behavior not yet qualified |

## Actual repository evidence
- `android-artifact-recovery`: public source/recovery tools and qualification; recent draft PR #47 says heldout JNI x86_64 native semantic validation **FAILED**, AArch64 NOT_RUN. Candidate uses only proven deterministic safe APK metadata—not proprietary APK corpora or unqualified native code.
- `AgentWebCam`: Python CLI camera list, snap, record, timelapse, motion/overlay; Android camera app requires new CameraX Kotlin code, permissions and hardware HIL.
- `AgentKVM2USB`: README states target-side HID forwarding not demonstrated end-to-end; PR #39 notes black video, target receipt unproven. Do not advertise remote-control app.
- `au-companion`: public README release-airlock with Windows-first private authority; not an Android-ready app.
- `suprachat`: Windows-first desktop parity NativeWebView, .NET/Avalonia, supported auth flows. Mobile platform approach requires separate design, not web/cookie scraping.
- `BrowserParity`: browser/userscript focus, not native Android application; future integration/qualification.
- `stable-character-pipeline`: large media/render pipeline; Android viewer should wait for qualified portable output and privacy/media playback baseline.

## App 1 — APK Lens v0.1 acceptance
- user selects a locally accessible APK via Android Storage Access Framework (no blanket filesystem access), inspect metadata with supported Android APIs + deterministic archive parser; report package name, version code/name, min/target SDK, requested permissions, activities/services/receivers, signing cert digest when supported/verified; distinguish verified/not available/unsupported rather than inventing conclusions.
- No APK execution, privilege escalation, decompilation, network upload or malware verdict. Input bounds and ZIP-bomb defenses; synthetic benign APKs only in public CI. User-owned input and Android permission model respected.
- Touch UI phone/tablet with EN/DE/TH accessible strings. CLI equivalent implemented as Go core inspection for desktop/CI where applicable, native Android intent/share/structured export path for on-device automation; agent may consume JSON evidence through explicit local-user consent. No silent remotely exposed Android agent server.
- Reproducibly build from pinned GHCR image on disposable public GHA runner; publish *candidate* direct APK + self-hosted F-Droid metadata; real-device install, upgrade data preservation, signing fingerprint and F-Droid update detection qualified; owner manual approval for production.
- Fire OS tablet: compatibility optional after touch testing; Fire TV: don't claim support unless file-picker and D-pad usability independently validated. Google Play targetSdk, storage-policy and privacy declarations separately checked; official F-Droid inclusion after external acceptance.
- Native languages: Kotlin/Compose Android, Go release validation; Java interop as necessary. No mandatory proprietary SDK, cloud auth, analytics or app server.

## Other products v0.1 cut lines
- **AgentWebCam Android:** camera list, photo, bounded recording, local share; explicit camera/mic permission and visible recording state; defer remote live feed, always-on recording, background streaming, agent headless camera activation until consent/auth/security reviewed. CameraX licensing/dependencies reviewed for F-Droid.
- **Device Observatory:** local own-device diagnostics and explicitly authorized network service checks; consent-first LAN discovery; read-only, no credential collection or arbitrary network scanning as default; defer enroll/reconfigure.
- **Release Companion:** read-only signed catalog, app availability, changelog, link/QR, no privileged installer or competing auto updater.
- **Sovereign AI Client:** user-configured OIDC/API providers over TLS, local credential custody and privacy controls; platform-compatible SDK/protocol only; no undocumented ChatGPT endpoints.

## First execution sequence
1. W0: formal scorecard, first app scope manifest, critical path and app-centric threat model; qualify GHCR pinned Kotlin/Android toolchain without host taint.
2. W1: standalone original Hello Distribution CI fixture with 3 audiences (human EN/DE/TH, deterministic JSON, agent schemas), no production publishing.
3. W2: APK Lens app repo (create only when necessary/authorized; independent source and DLE), scoped v0.1, synthetic fixture qualification on disposable runners; implement direct APK and signed self-hosted F-Droid index with owner-controlled signing.
4. W3: publish only after per-artifact human review; perform true install/update/rollback-as-forward-fix on actual device; get external user feedback. Start CameraX spike in separate independent workset.
5. W4: official F-Droid review and optional Amazon Fire tablet/Google Play adapters in parallel. Fire TV and Vega target adapters depend on suitable app capabilities, not universal promise.

## Candid trade-offs
Ranking is not evidence of implementation readiness. "First app" should be judged by end-user utility AND controlled release qualification. Public repositories are not automatically sanitized for mobile reuse; inspect licenses, assets, history, specialized private oracles and current PR authority before promotion.

## Sources
Repo: https://github.com/SemperSupra/android-artifact-recovery/pull/47
Repo: https://github.com/SemperSupra/AgentKVM2USB/pull/39
F-Droid inclusion: https://f-droid.org/en/docs/Inclusion_Policy/
Android PackageManager: https://developer.android.com/reference/android/content/pm/PackageManager
Amazon Fire TV input criteria: https://developer.amazon.com/docs/app-testing/test-criteria.html
