# Open Space Duel cross-platform multiplayer interoperability contract
Date: 2026-11-17. Status: **target requirement and RDTE plan; not qualified implementation**.
Owner request: Android sideload/F-Droid/Amazon/Play users must be able to play existing browser/PWA players and future supported platforms. No new public gameplay source, store submission, production key, server or deployed app authorized by this document.

## Product invariants
- Distribution channel is not a multiplayer partition. Browser/PWA, signed direct APK, F-Droid official/self-hosted, Google Play and Fire OS app can join one match when all parties support an explicitly negotiated protocol and game mode.
- Reuse Open Space Duel's **existing public, approved gameplay TypeScript/Canvas and Trystero/WebRTC data transport**. No duplicate Kotlin game engine or separate Android game-state rules. Android TWA, Capacitor, and WebViewAssetLoader package adapters are independent experiments against *same immutable public revision*.
- Enforce version/capability negotiation for protocol schema, matchId, app/build version, seeded flight model (arcade/inertial), entity schema, control mapping, fixed-step rate and rollback/replay/window policies; reject incompatible peers with actionable UI/typed failure codes, not silent gameplay divergence. Transport room matching appId/roomId/signaling strategy is necessary but insufficient.
- Compatible app packages have consistent game protocol even if Android appId, publisher cert, store app signing and APK versions differ. App update/distribution identity must not leak into gameplay handshake except an explicitly supported gameplay build/protocol version.
- No assumption that true peer-to-peer always works behind carrier NAT, enterprise firewalls, restrictive Wi-Fi or headless WebKit. Distinguish signaling found / ICE failed / data channel failed / handshake rejected / simulation divergent. STUN/TURN may help but TURN relay has bandwidth/hosting cost; do not claim universal cross-NAT connectivity for $0 infrastructure. No paid relay/service without authorization; explicit fallback/manual-room-code or supported self-hosted relay, testing on heterogeneous networks.
- Internet game traffic is not necessary for local offline solo/two-human same-device modes. No unnecessary backend dependency. A supported bundled WebView must expose WebRTC DataChannels and relevant Web Audio/touch/gamepad APIs; Fire OS AWV is not identical to Chrome or Android WebView; physical/actual-browser qualification needed.
- Security: authenticated room admission/peer-specific authorization as qualified, bounded inputs and message sizes, replay protections, monotonic ticks, rate limits, protocol schema validation, controlled state transitions and user opt-in for network connections. Browser security/consent and Android permissions cannot be bypassed. No hidden remote control port.
- Manual production approval and OSD V0-V4 release classification membrane retain independent authority. OSD private issues #279/#277/#278 remain authoritative for underlying product; public source projection must be approved first. Cross-project Foundry CI consumes only already-approved public artifacts.

## One semantic game across three audiences
### Human (English/German/Thai)
Phone touch/tilt, desktop keyboard/gamepad, Fire TV D-pad where separately qualified; invitation URL/QR/room code, match version compatibility notice, offline mode, join/reconnect status, explicit permissions and accessibility with 2-player labels and pause/resume.
### Automation
Versioned JSON Schema `GameCommand`, `GameObservation`, `Handshake`, `MatchEvent` and machine-readable errors; deterministic seeded replay, headless local match and real two-browser tests, idempotent scenario IDs, run correlation, exact artifact versions; test doubles never counted as network HIL.
### Agent
Capability discovery, read-only observations, scoped bounded moves for explicitly assigned bot/test player, resource budgets, critic/falsifier findings, steering receipts; separate actor identity from human player. No implicit release authority or game ownership takeover.

## Adapter layers
- Shared TypeScript game simulation/protocol, stable versioned schema and input/event dispatcher.
- Browser adapter: original browser/PWA, service worker and origin/CSP checks.
- Android adapter: TWA or Capacitor or minimal WebView, input/UI lifecycle/audio/network connectivity only; no semantic rules rewritten.
- Future standalone native: adapt to same wire schemas, tested against reference canonical TypeScript gameplay. Refuse uncertain numerical divergence, especially float rounding/tick order/seed.
- Network: Trystero signaling strategy (exact configured appId/room), WebRTC DataChannel, application-level deterministic handshake, error taxonomy, optional **authorized** TURN when required.

## Executable free-tier RDTE worksets
A. Read current OSD DLE #279, product #277, membrane #278, and accepted public SHA. Capture already public release only. Formalize handshake version/state schemas and negative fixtures in a no-effects branch.
B. Native browser-browser baseline: Chromium↔Firefox, Chromium↔WebKit if environment supports ICE, 2 browsers/2 actual contexts, local and peer mode with both arcade/inertial. Preserve known WebKit ICE failure as RED/environment blocker, not PASS.
C. Android emulator ↔ desktop browser: first in same GHA job LAN, then separate isolated hosted jobs/network if legally and technically available; test TWA, Capacitor, WebView using exact same dist SHA. Report unavailable emulator network as NOT_RUN.
D. Android ↔ Android (different store *candidate* builds) same protocol: package certificate/store signing differences must not change peer discovery; test upgrade N→N+1 with a live old browser client; check protocol migration and backward compatibility.
E. Simulate adverse conditions via tc/network namespaces when allowed: 100–500ms latency, jitter, drops, duplicates/reordering, disconnect/reconnect, mobile foreground/background transitions, ICE refusal, room replay, wrong seed/mode/version; assert graceful failures, no invented network success.
F. Human/automation/agent tests: translated strings EN/DE/TH, touch/keyboard/gamepad, link/QR, machine JSON transcripts, bounded bot actions, screenreader labels and critique receipts.
G. Fire OS tablet and Fire TV real device HIL separate; Vega OS later separately. Record no physical evidence on generic cloud emulator.
H. Bounded metrics: join time, median/p95 RTT, data channel packet delivery, state hash divergence at tick boundaries, dropped/late inputs, reconnect success, CPU/memory/battery by platform and traffic relay cost. Reproducibility+source/artifact hashes, GHCR digest, error evidence stored as sanitized DLE receipts.

## Acceptance and promotion
MVP crossplay acceptance: actual browser↔Android emulator peer connection with **real** WebRTC data channel, shared protocol version negotiation, deterministic same-seed scenario under both flight models, 2 roles reversed, cross-client state agreement at checkpoint ticks, teardown and reconnect; no private source/keys/paid services. A second physical Android + desktop/browser acceptance is a separate publication gate where product claims require it.
Do not claim cross-platform multiplayer complete from synthetic protocol tests, screenshot tests, generic browser-browser WebRTC or merely successful APK compilation. New app package production still needs Foundry manual artifact+channel approval AND OSD V4 source projection release gate.
