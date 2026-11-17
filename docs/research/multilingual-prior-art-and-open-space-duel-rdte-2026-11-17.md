# Global multilingual prior-art sweep and Open Space Duel Android RDTE
Date: 2026-11-17 | Status: **research/qualification plan**, not adoption or public release authority.

## Scope and evidence levels
Reviewed public upstream documentation/repos in English, German, French, Simplified Chinese and Japanese, with Thai-language query coverage attempted; sources are unevenly available by language. Cross-language results pointed to largely the **same upstream code** rather than independent regional implementations. Do not infer lack of prior art from empty Thai result. Candidate due diligence must check exact license, maintained branch, reproducible build, Android versions, API surfaces, offline behavior, store policies and any proprietary transitive deps. Source citations below; current descriptions do not prove implementation fitness.

## Decisions: adopt/reuse vs bespoke
| Proposed app | Primary prior art | Outcome | Differential only worth building |
|---|---|---|---|
| APK Lens | **LibChecker** (F-Droid, Android + local browser/WebUI analyzer), **MartinStyk/apk-analyzer** (GPLv3 offline APK/installed app), **App Manager**, **Androguard** (Apache 2.0 APK/parser); apktool/jadx for research | **HOLD bespoke analyzer**. Existing open-source apps already inspect package metadata, permissions, signatures, splits, components and generate reports. | Only build if a *demonstrable gap* remains for standard cross-device JSON/agent evidence contracts, structured diff/verification and integration with AAR; prefer upstream contribution or adapter. Never copy GPL code into Apache/MIT product without license review. |
| AgentWebCam Android | **Android IP Camera** (MIT, remote web controls, H264/MJPEG), **LensCast** (GPLv3+ RTSP/MJPEG/MQTT/object gates), **Husk** (GPLv3 phone-as-camera/control bridge), Open Camera | **HOLD standalone camera**. Reuse upstream or qualified interoperable protocol client first. | Specific consented agent scheduling/control contract, provenance, explicit on-device UI presence, permission-safe API, deterministic captures and secure no-default-listener mode. License/privacy/security bake-off mandatory. |
| Device Observatory | **Port Authority**, **PCAPdroid**, **Network Scanner**, platform mDNS/NSD APIs | **ADAPTER/INTEGRATION** before bespoke. These solve scanning/capture individually. | Consent-first cross-device typed inventory, fleet-enrollment overlay (read-only MVP), schema-level observations, human/CLI/agent parity, reproducible safe read-only tests. Do not default to scanning arbitrary networks. |
| Release Companion | **F-Droid/Droid-ify/Neo Store**, **Obtainium**, **ObtainX**, **AppShelf** | **OBVIATED for updater/installer**. Use F-Droid signed repo link/QR and GitHub release/Obtainium source. | Only create read-only portfolio status frontend if multi-app catalog demands beyond existing clients. No custom privileged updater. |
| Sovereign AI Client | Existing open source Android frontends for OpenAI-compatible local services to be inventoried in next sweep; SupraChat current code desktop/Avalonia | **DEFER**. Harder auth/credentials/privacy and not ideal first Foundry qualification. | Standards-based agent/automation structured contracts for user-owned local endpoints; reuse mature client before new UI. |
| **Open Space Duel (OSD)** | **Existing own TypeScript/Canvas/Vite/Playwright/Vitest/Trystero game**, browser PWA, **Bubblewrap/PWABuilder TWA**, **Capacitor**, **WebViewAssetLoader** | **PROMOTE as first *end-to-end release RDTE* candidate** from **existing authorized public 0.3.1**. Do not rewrite gameplay in Kotlin/Phaser or create a new game engine. | Native wrapper, install/update, offline SPA, input/Android lifecycle, three-audience interfaces, store compliance; qualifies F-Droid/Play/Amazon/direct channels with same web source; only after permission to promote an approved exact artifact. |

Sources:
- https://github.com/LibChecker/LibChecker
- https://github.com/MartinStyk/apk-analyzer
- https://github.com/androguard/androguard
- https://github.com/androguard/apk-parser
- https://f-droid.org/packages/com.github.digitallyrefined.androidipcamera/
- https://f-droid.org/packages/com.raulshma.lenscast/
- https://f-droid.org/packages/co.xplat.husk/
- https://f-droid.org/packages/com.aaronjwood.portauthority/
- https://f-droid.org/packages/com.emanuelef.remote_capture/
- https://f-droid.org/en/packages/dev.imranr.obtainium.fdroid/
- https://f-droid.org/en/categories/app-store-updater/
- https://github.com/pwa-builder/PWABuilder/blob/main/docs/builder/android.md
- https://github.com/GoogleChromeLabs/bubblewrap
- https://capacitorjs.com/docs/android
- https://developer.android.com/develop/ui/views/layout/webapps/load-local-content

## OSD current source/governance boundary (observed directly)
- Private authority: `mark-e-deyoung/open-space-duel-private`, DLE #279, Track A #277 and release membrane Track B #278. Public approved publish/execution plane: `mark-e-deyoung/open-space-duel` (default `gh-pages`).
- Private README package version `0.3.0`; public deployed `0.3.1` is the last confirmed release in source status. Do not confuse with private work or latest candidates.
- Existing game: TypeScript + Canvas 2D, Vite, Trystero/WebRTC, Web Audio, Playwright/Vitest, local 2-player/gamepad, touch/tilt. Optional Go/Node services are separate and must never be assumed online.
- Latest private #279 (2026-11-16): product/release holds remain; owner-authorized public-only automated local two-human + genuine two-browser P2P evidence for both arcade/inertial modes, owner hands-on play after release subject to V0–V4 membrane and exact artifact acceptance. A later public candidate source manifest `private-required` deliberately STOPs deployment; never package it in a public Foundry workflow without specific V4 clean verdict. Latest issue must be re-read at execution time.
- RDTE packaging experiment must use only verified **already-public 0.3.1** source/artifact initially, with no private repo token, branch, evaluator corpus, secrets or privileged test hook; source and asset licensing must be independently checked. **Public build ≠ approval to publish Android store app.**

## OSD Android packaging bake-off
Three alternatives, tested against *same immutable public source SHA*:
A. **TWA / Bubblewrap (baseline)**: tiny Android app points at HTTPS PWA origin, Digital Asset Links association, browser engine dependency. Pros minimal native work, Play publishing path; cons depends on browser/runtime, offline lifecycle depends on installed PWA service worker/caching and verified asset links, poor path for entirely bundled offline game, F-Droid dependency/policy needs explicit review.
B. **Capacitor (primary cross-store offline candidate)**: package pinned `dist/` web assets in APK; use system WebView, plugins only when absolutely needed. Pros standalone offline and Android lifecycle, compatible APK/AAB output, native bridge for gamepad/tilt/permissions; cons WebRTC and Web Audio behavior in embedded WebView must be measured, plugin licenses/dependencies and security boundary verified, no arbitrary filesystem bridge.
C. **Minimal Kotlin WebView + WebViewAssetLoader (fallback)**: bundle same dist, secure https-like local asset origin with controlled navigation, no broad JavaScript bridge. Pros minimal dependencies and full offline control; cons more custom packaging code, OS media/permissions and store compliance work.

**Decision gate:** Select simplest solution satisfying *offline cold-start airplane-mode*, touch/tilt/gamepad/Web Audio, two-human local, Android 12+ compatibility, P2P over genuine second device/browser if network enabled, privacy/no required account, accessibility and no backend. TWA is a valid Play option, but if offline-after-first-launch/reliance on Chrome violates product requirement, prefer Capacitor/WebView. Do **not** assume TWA app is F-Droid acceptable or Fire OS compatible without specific build/device review.

## Borrow, not rewrite
- Canvas game simulation: prefer own existing 60 Hz fixed-step deterministic game core, seed/replay and per-tick input log; borrow independent physics/seed ideas from Phaser only if a controlled bake-off shows benefit, **do not migrate engine**. Distinguish deterministic fixed-step from proven bitwise cross-browser determinism.
- Net: use existing Trystero/WebRTC DataChannel plus bounded HELLO/ACK, monotonic tick, match version/seed/flight model negotiation, explicitly logged ICE/STUN/TURN failures; no automatic paid backend/relay.
- UI/DX: reuse PWA manifest, accessible controls, gamepad/touch/keyboard mapping, CSS safe-area/fullscreen and browser accessibility patterns; introduce headless gameplay API *as internal typed input abstraction*, not a privileged remote command server.
- Browser tests: Playwright Chromium/Firefox/WebKit desktop; separate Android Chrome/WebView instrumented tests where free runner supports emulator; fake media/controller tests are not physical-device acceptance. Take screenshot/video under per-run caps and automated VLM critic only on privacy-safe public fixtures; human/adjudicator evaluates critic false positives.

## Three-audience contract for OSD and every app
1. **Humans:** phone/tablet touch/tilt and accessible UI; keyboard/gamepad for desktop/TV where qualified; large tap targets, pause/resume, focus management, screen-reader menus/status and reduced motion, explicit connection/permission/consent. EN/DE/TH localization incl RTL-safe layout architecture though RTL not required now. Fire TV D-pad is independent future qualification.
2. **Automation:** canonical `GameCommand` (thrust, rotate, fire, shield, pause, connect etc.), `GameObservation` (tick, ship pose, health/energy, match peer state, timeouts) and versioned JSON schema + deterministic replay; Playwright fixtures, CLI/headless runner, stable error codes, control arbitration, seeded simulator tests.
3. **Agents:** read-only semantic observation + validated scoped bounded commands via an explicit local-user-approved capability; discovery schema, rate limits, budgets, dry-run, injected test doubles, critics and human steering. Separate pilot/bot players from human controls. No exposed local network control port, arbitrary JavaScript injection, private match discovery or remote personal data by default. All consequential actions require user/owner authority.
Single state machine and typed command/observation contract across three adapters; no UI coordinate-only bots as primary API. Android/WebView bridge is minimal allowlisted messages, origin checked; prefer in-process integration until justified.

## Execution worksets, strict zero-spend
P0 workset 0 (Foundry) — read live OSD #279/#277/#278, verify authoritative public SHA/license and release classification; pin GHCR Node/Playwright/Bubblewrap/Capacitor/Android tool images by approved digest; create fixtures and threat model; no private GHA minutes.
P0 A (independent) — reproduce public 0.3.1 browser build and native input/replay tests on disposable public GHA; compare SHA and artifact, package PWA static only.
P0 B — TWA from public source, qualify DAL/origin and cold-offline behavior, launch/terminate/upgrade.
P0 C — Capacitor bundled-dist APK, independent airplane-mode, WebAudio/touch/tilt and network WebRTC tests.
P0 D — minimal WebViewAssetLoader fallback, same exact source and test contract.
P0 E — human/CLI/agent schemas, deterministic fake replay, accessibility EN/DE/TH, mobile screenshots/automated critic with falsifiers.
P0 F — run Android emulator if free hosted runner capacity admits; separate physical Android/FireOS HIL not proven available. Tests must report NOT_RUN when unavailable.
Join: evaluate weighted result on same source and policies; reject contaminated or unsigned candidates for release. No public Android APK/Pages/F-Droid/Play/Amazon publication without **separate per-artifact Foundry owner release approval plus OSD V4 authority**. Existing OSD website deployment owner decision is not a blanket store permission.
P1: self-hosted signed F-Droid + direct APK release, Play test track, Amazon Fire OS tablet qualification; official F-Droid submission only after source/build/license policy acceptance.
P2: Fire TV D-pad/play experience, Vega separate build, multiplayer hosted services as separately isolated stateless OCI image + external data plane.

## Bake-off acceptance matrix
| Test | TWA | Capacitor | WebView |
|---|---|---|---|
| clean Android build on fresh GHCR-pinned disposable runner | REQUIRED | REQUIRED | REQUIRED |
| first launch in airplane mode with all game assets | MEASURE | REQUIRED | REQUIRED |
| install → update preserves scores/settings and app data | REQUIRED | REQUIRED | REQUIRED |
| local two-human arcade and inertial dual mode via real input | REQUIRED | REQUIRED | REQUIRED |
| WebRTC genuine two-browser P2P host↔guest & disconnect | REQUIRED if network feature enabled | REQUIRED | REQUIRED |
| touch/tilt/gamepad, audio focus/pause and orientation | REQUIRED | REQUIRED | REQUIRED |
| human EN/DE/TH + accessible flows | REQUIRED | REQUIRED | REQUIRED |
| deterministic CLI/JSON replay + agent test-double interface | REQUIRED | REQUIRED | REQUIRED |
| F-Droid/FLOSS dependency policy and offline/SDK constraints | REVIEW | REVIEW | REVIEW |
| release key, versionCode, cert/update compatibility | REQUIRED | REQUIRED | REQUIRED |
| Fire OS tablet and TV real device | NOT_RUN until HIL | NOT_RUN until HIL | NOT_RUN until HIL |

## Recommendation and rankings (revised)
- **First infrastructure fixture:** Hello Distribution (still optimal for isolating Foundry defects).
- **First real multi-channel app qualification:** **Open Space Duel public 0.3.1** via competing wrapper methods, *do not publish until clean and approved*.
- **First new bespoke native Android app:** NONE yet justified. APK Lens and AgentWebCam were plausible but strong prior art means adopt/integrate or upstream contribution first.
- **Potential later differentiated native app:** consent-based Device Observatory for typed fleet/agent observations, after first release + integration gap proof.
This supersedes the earlier planning-only ranking in `first-app-portfolio-assessment-2026-11-17.md` while preserving its evidence for audit.

## Evidence sources (multilingual, 2026-11-17)
English: LibChecker https://github.com/LibChecker/LibChecker ; MartinStyk https://github.com/MartinStyk/apk-analyzer ; Androguard https://github.com/androguard/androguard
German: https://f-droid.org/de/packages/com.absinthe.libchecker/ ; https://play.google.com/store/apps/details?hl=de&id=sk.styk.martin.apkanalyzer
French methodology: https://www.zerodaycyberacademy.com/ressources/pentest/analyse-apk-android
Simplified Chinese: https://github.com/LibChecker/LibChecker ; https://fdroid.gitlab.io/jekyll-fdroid/zh_Hans/packages/io.github.muntashirakon.AppManager/
Japanese platform documentation: https://capacitorjs.jp/docs/v5/android
Thai search queries: no sufficiently corroborated distinct implementation to adopt; keep open evidence gap.
Other: https://github.com/GoogleChromeLabs/bubblewrap ; https://capacitorjs.com/docs/android ; https://developer.android.com/develop/ui/views/layout/webapps/load-local-content ; https://f-droid.org/en/docs/Inclusion_Policy/
