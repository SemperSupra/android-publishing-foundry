# Open Space Duel — GitHub hosted-runner census RDTE execution plan
Date: 2026-11-17. Status: **workflow/fixture staged, no independently verified job completion**. DLE ownership: public Android Publishing Foundry PR #2, private OSD #279/#277/#278, runner census `SemperSupra/agent-dispatch-private#223`.

## Source and authority
Census: `SemperSupra/agent-dispatch-private/evidence/github-runner-census/placement-catalog-v1.json`, runner-specific observed vs exercised semantics. This document cannot grant new runtime capabilities.
OSD: already-public 0.3.1 deployment commit `ed917796a6f1bdf50a802143c68be4beff246929`, verified public `version.json`. No private source, private evaluator, telemetry, credentials, publication, signing or store effects. Do not confuse public installed UI smoke with private next-release qualification.

## Execution artifacts staged in this branch
- `.github/workflows/osd-public-browser-rdte.yml`: 12 bounded matrix cells (8 active desktop/engine/device-profile smokes; 4 explicit SKIPPED_GUARDRAIL). Push on this exact experiment branch or workflow_dispatch, max-parallel 2, 16m/job, 3-day evidence retention.
- `tests/osd-public-browser-smoke.cjs`: exact public source clone, local built-in static server, browser engine launch, #game-canvas visible, screenshot SHA256 and JSON receipt; distinguishes browser capability from actual crossplay.
- `.github/workflows/osd-public-android-emulator-rdte.yml`: Android API35 AVD boot on Ubuntu24/26 x64, pinned Android emulator action, max-parallel 1, 28m/job, browser presence/navigation attempt and sanitized screenshot. This does **not** build or install an Android wrapper.
- `tests/osd-android-emulator-probe.sh`: boot/API/ABI and browser availability, no privileged app or private OSD.
- `.github/workflows/osd-public-ios-simulator-rdte.yml`: macOS26 Intel iPhoneSimulator (real simctl boot, openurl, screenshot); 12m. No iOS native app, WebRTC game proof, or Apple device HIL.
- `tests/osd-ios-simulator-probe.cjs`: exact status classification, timed subprocesses, simulator shutdown.

## Runner and browser matrix
| Runner | Active RDTE | Admitted claim |
|---|---|---|
| ubuntu-24.04 x64 | Playwright Chromium desktop, Firefox desktop, WebKit iPhone emulation; Android API35 KVM emulator | desktop browser engine, simulated iPhone viewport, real Android emulator **browser launch only** |
| ubuntu-26.04 x64 | Chromium Pixel emulation; Android API35 emulator | browser profile emulation, real Android emulator **boot/browser attempt** |
| windows-2025 x64 | installed Microsoft Edge desktop via Playwright channel | desktop browser only, not Hyper-V app guest |
| macos-26 ARM64 | Playwright WebKit iPhone emulation | **not real Safari/iOS Simulator** |
| macos-26-intel x64 | Playwright WebKit desktop; genuine iPhoneSimulator boot/openurl | WebKit and real Simulator **navigation attempt**, not gameplay acceptance |
| xcode-27 ARM64 | Playwright WebKit desktop | not proven Simulator lifecycle |
| ubuntu-24.04-arm | census class retained, browser NOT_RUN | no browser runtime qualification under this harness |
| ubuntu-26.04-arm | census class retained, browser NOT_RUN | same |
| windows-11-arm | census class retained, browser NOT_RUN | no Playwright/Edge claim; Windows host GUI evidence remains separate |
| ubuntu-slim | census class retained, browser NOT_RUN | docker/browser known limited; only contract runner admitted |

Playwright's iPhone/Pixel device descriptors emulate viewports, user agent and some APIs; neither is a genuine mobile browser or physical sensor test. Native Android emulator browser package may be absent in Google APIs image and must report `NO_BROWSER_PACKAGE` rather than fake a PASS. iOS Simulator openurl + screenshot also does not prove Safari rendered gameplay.

## Resource, lifecycle and cost
Only public hosted standard GitHub Actions runner classes from census, no private Actions minutes. Each job uses fresh VM, temporary work directory and publicly fetchable exact source. Pre-GHCR-bootstrap exception: public Playwright package version `1.59.1` installs under `RUNNER_TEMP`, not developer host; production/reusable toolchains must migrate to vetted GHCR images by immutable digest. No caches, privileged tokens, private sources, always-on services or paid resources. Use pinned upstream action SHAs, read-only contents permission, failure evidence for max 3 days. No stdout-sensitive data.

## Acceptance evidence ladder
1. Verify actual Actions run ID, runner image ID, commit SHA and downloaded JSON receipt. Workflow status alone is insufficient.
2. Resolve `ENVIRONMENT_FAILURE` vs `HARNESS_FAILURE` vs `ORACLE_FAILURE` vs `SUPPORTED_SMOKE_ONLY` vs `SKIPPED_GUARDRAIL` from native receipts.
3. Re-run only failing/unknown cells with one discriminating change; retain first failure.
4. W1 build a **public-source** bundled Capacitor/WebView APK on GHCR-pinned Android toolchain; real emulator install, launch, airplane-mode and upgrade. No signing keys beyond test key in public jobs.
5. W2 actual **Android WebView/emulator ↔ browser** peer DataChannel P2P in both arcade and inertial models, 2 roles reversed, version/seed/tick agreement; browser↔browser existing product tests do not substitute for app crossplay.
6. W3 physical Android phone + desktop browser, Fire tablet/TV and iPhone browser hardware HIL. No hosted runner availability implies physical Fire OS/Vega/iPhone hardware; keep explicit NOT_RUN.
7. W4 gate exact artifact/signing/App Store release under separate private OSD V4 public promotion approval + Foundry manual owner permission.

## Important known limitations
Runner census supports Android API35 AVD boot but not automatic application/browser/game success. macOS ARM/xcode27 have iOS Simulator SDK compile qualification but no reliable device service. Windows 2025 Hyper-V guests are not necessary to test real browsers. WebKit on headless Linux previously failed ICE in independent OSD P2P tests; preserve as RED until actual WebRTC rep qualifies. Cross-runner artifacts are not a real-time gameplay transport. GHA test browsers cannot prove arbitrary WAN P2P or TURN availability for zero dollars.

## Agent baton
1. Read census #223's current placement catalog, private OSD #279 latest and Foundry PR #2.
2. Inspect branch and workflow validation, including pinned action digests and public source SHA.
3. Trigger/observe one accepted, budget-limited public workflow (if permitted by execution tools). **This chat's GitHub connector can create workflow files but lacks a fresh workflow-dispatch action**; a push event may trigger a workflow on this branch, but treat it as NOT_RUN until exact run ID/receipts are observed.
4. File a compact result per lane, with native classification and saved image/JSON artifact fingerprints; no automatic PR merge or production release.
5. Next batch only after analyzing first failures; no blind expansion.
