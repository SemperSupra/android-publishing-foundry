# Android Side Quests — portfolio feasibility and executable RDTE gates
Status: 2026-11-17 architectural **proposal**, not implementation, qualification, license clearance, asset promotion or production approval.
Applies Foundry DLE: ephemeral stateless build/deploy jobs, approved immutable GHCR toolchain images, public/private boundaries, free public hosted GHA, three audience interfaces (human EN/DE/TH, deterministic automation, scoped agent). Cross-project owners retain source and release authority.

## Portfolio sequencing
P0 reuse primitive: Android Device Capability Contract (Kotlin/Compose UI, Android SDK, typed device capability/schema and Go host receiver/controller adapters), **not** a monolithic universal device permissions app.
P1 first standalone differentiated Android app: SupraCraft Companion **read-only server health + world map + explicit player controller**; do not promise remote stock-client camera/inventory mutation before qualifying real implementation.
P1 independent USB/IP R&D: Android phone sensors/touch/camera/mic -> authenticated network stream/typed observations -> host receiver virtual HID/UVC/UAC where supported; physical OTG USB/IP passthrough separate.
P2 BioPunk private Atlas prototype using only explicitly approved sanitized export contracts; no protected assets/canon or project source into public CI.
P3 native BioPunk E-37 playable only after existing owner dual-track native acceptance + content release gate.

## Separation of concerns
- **Phone internal peripherals** accessible to app via CameraX/Camera2, AudioRecord, SensorManager and own-view touch input are *not* raw USB endpoints. No-root app may export a **consented IP application protocol**; Linux host can use uinput/v4l2loopback/PipeWire, Windows a signed permitted virtual HID/audio/camera driver (install/setup rights not presumed) or user-mode OBS camera bridge, macOS approved virtual camera/audio API adapters. Physical USB gadget VID/PID/descriptors and USB UVC/HID device-mode functions are OS HAL/kernel controlled and cannot be generally configured by an unprivileged Android app. Native Android system webcam function may exist on supported phones, but is not our app's arbitrary USB gadget function.
- **Physical external USB device plugged into Android USB host/OTG** can be opened with Android USB host permission and may be tunneled over network by user-space USB/IP implementations, with interface/transfer-type and host VHCI compatibility limits; iso USB audio/video harder, composite and endpoint access may be restricted. Reuse iotower/zerowire/USBIPServerForAndroid/VIIPER, do not duplicate USB/IP kernel or invent broad no-root capabilities.
- Do not confuse existing AgentKVM2USB HID/UVC standards research with proven remote HID target forwarding; current public README says target-side HID remains NOT PROVEN. OpenKVM2USB clean-room excludes restricted materials.
- Receiver runtime can be ephemeral, **but installed host virtual drivers/kernel modules may be inherently persistent and privileged**. Requirement for zero host taint is *incompatible with arbitrary OS-global virtual USB installation* on normal desktop. Use disposable VMs containing the driver/module and qualified ephemeral gateways; or choose unprivileged host apps/protocol adapters instead of systemwide virtual device. Report residual host modifications and cleanup/rollback.
- Authenticated opt-in pairing, local-visible active camera/mic state, foreground-service limits, independent consent to sensors/location, zero remote activation before owner action, source-IP/network policy, session expiry, rate limits, non-inference secrets and encrypted transport; screen sharing requires platform MediaProjection consent.
- Versioned JSON/Protobuf/CBOR contracts with monotonic timestamps, sensor coordinate frames, units (m/s², rad/s, heading frame), sample-rate negotiation, quaternion calibration, clock sync, latency/jitter, drop accounting and capability/permission-state discovery. WebRTC for media and optionally data, QUIC/TLS for structured streams; never claim all hosts are USB/IP-capable.

## Prior art (source/license/security audit required)
- Android no-root USB/IP: https://github.com/suhridgupta/iotower ; https://github.com/builtbyzero/zerowire
- Userspace virtual HID over USB/IP: https://github.com/Alia5/VIIPER
- Android webcam no-root: https://github.com/devkos1/droidvideo ; https://github.com/Ruddle/RemoteCam ; https://github.com/filonux/PhoneCam
- Android UVC device-as-webcam system function: https://source.android.com/docs/core/camera/webcam
- Android permissions/foreground: https://developer.android.com/develop/background-work/services/fgs/service-types
- Sensors: https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview
- Android host USB: https://developer.android.com/develop/connectivity/usb/host
- Minecraft remote semantic inputs: https://github.com/lucasoyen/MCCTP ; https://github.com/nahakiole/minecraft-remote
- Minecraft Geyser player connectivity is **not** control/HUD/inventory adapter: https://geysermc.org/wiki/geyser/setup/

## Side quest 1 — BioPunk mobile
Private controlling authority: `mark-e-deyoung/biopunk-solar-system-private#1`, draft #2. Source-level ATLAS custody and E-37 source planning exist; native dual-track cinematic/playable, editable source SHA, rights and canon/public projection are **held**.
W0: owner-approved export *schema only*, private-safe sanitized fixtures, provenance/licensing consent, source projection membrane. Verify on-device KTX2/glTF assets and viewer after exact exported content approval.
W1: Atlas read-only mobile navigation + semantic graph + local asset viewer. Support offline and accessible EN/DE/TH, time scrubber/3D scene, machine JSON lookups, agent read-only queries. No source leakage or public APK.
W2: optional director console for already-authorized simulation instance: controlled camera, timeline, approved scenes, observable actor/asset telemetry; no arbitrary private source/assets.
W3: native E-37 scene only after owner's distinct cinematic and real playable acceptance, asset/rig/force/motion/canon/right gates. Mobile renderer feasibility does not satisfy native production acceptance.

## Side quest 2 — Device Fabric
W0: device-surface feature/permission census per Android API level and emulator vs HIL, real Android 14/15/16 hardware (when available), data type and trust contracts.
W1: no-root touchpad+tilt/compass/IMU on same LAN, explicit pairing, receiver as user-mode mouse/simulator; observable timing/accuracy and disconnection semantics. Android touchscreen app only, not injecting system-wide Android events.
W2: camera/mic encoded transport over authenticated WebRTC, no camera/mic remote start; host OS video/audio sink qualification. Reuse upstream camera streams where possible.
W3: USB/IP virtual HID gadget server on receiver using VIIPER, Linux VHCI in disposable VM; OS integration/human approval and driver privileges. Test failed/replayed URBs/latency/disconnect; never claim UVC/UAC without actual descriptor/isoc and OS acceptance.
W4: OTG attached physical USB forwarding as independent feature and licensing review; host/receiver controls distinguish from phone sensors.
Negative: denied permission, privacy revoke, background capture rejected, malicious peer, clock drift, bogus sensor values, USB descriptor and endpoint faults, encrypted transport downgrade, no USB kernel capability.

## Side quest 3 — SupraCraft companion
Authorities: MCWORLD `SupraCraft/mc-structure-foundry-private#17` (stock vanilla Java 26.3 named places), bot gym `SupraCraft/mc-bot-gym-private#21` (two-oracle stock client vs protocol), go worker `SupraCraft/mc-bot-worker-go-private#88` (protocol777 unqualified). Keep native world/client and replay authorities independent.
W0: discover actual server types, approved map provider and semantic action API; no private server credentials on public GHA. Map existing observability/inventory protocols and test supported stock-client extension envelope.
W1: PWA/Compose app read-only player/session/server status, latency/TPS, optional BlueMap/Dynmap/declarative MCWORLD named-place overlays and authenticated consent. This may be first viable feature with no player injection.
W2: 2D virtual controls and tilt calibrated => typed `PlayerInput` semantic intent -> existing authorized client-side bridge or bot/player proxy. RCON must **not** be exposed to ordinary player; a server bot is not the same thing as taking over their stock-client camera. Require explicit user-linked session authentication and rate budgets.
W3: contextual HUD/inventory with authoritative state/event feed; inventory mutation must validate server ownership, slot/action/tick and concurrency; if stock client cannot express it, optional mod/plugin adapter and capability disclosure.
W4: PTZ spectator camera where server allows, haptic effects and client-local audio, actions from actual in-world events; phone spatial sound does not imply world-wide sound injection. Android VibratorManager/audio focus/device support qualified.
W5: 2D+3D map, underground/cave layer viewer and administrator-only x-ray: expose only authorized loaded/generated world data and avoid unseen-chunk info leaks; no unqualified rendering state or client camera semantics. Consider BlueMap/Dynmap rather than own world renderer.
UI should dynamically reveal/hide actions based on actual server, role, version, client bridge capabilities, scene, tool/item, game mode, and safe policy. No deceptive controls.

## Three audience contract (all products)
Human: accessible touch/landscape portrait with EN/DE/TH localization, consent/permission state, device pairing, troubleshooting, no hidden agents, role-aware commands, screenreader labels, latency and battery/network status.
Automation: stable Go CLI + Kotlin client contract, JSON Schema/protobuf manifest and observations, read-only status, `discover -> plan -> apply -> verify`, explicit idempotency keys and error codes, exact fixture/runtime/trace hashes, sandbox control without UI-coordinate scripting.
Agents: typed capability registry, bounded approved commands, receipts, critics/falsifiers, resumable DLE, no silent camera/mic activation, server-admin or private-asset exfiltration, or bypass of player control authority. Agent action scope subordinate to active human authorization.

## Free-tier RDTE and non-taint
- Public sanitized independent contract tests on standard GHA Linux/Windows/macOS; GHCR digest-pinned Kotlin/Android toolchain/emulators when supported, Go receiver and JVM Minecraft test tooling, no permanent host installers. Record `NOT_RUN` where real sensors/game/USB/physical hardware unavailable.
- Android AVD can test UI, permissions, simulated sensors, ADB network, camera virtual input in part; *does not prove* real camera/mic latency, physical touch/tilt or OTG USB UVC gadget behavior.
- USB/IP receiver acceptance: disposable Linux VM with vhci-hcd or virtual gadget and synthetic HID; macOS/Windows VM driver testing separately, no signed driver bypass. Real phones and Minecraft real server/stock client as distinct HIL gates.
- SupraCraft tests: real disposable exact-version server with approved data pack, two independent clients if admitted, role-based ACL; gym's existing protocol and stock-client oracle rather than custom new scoring engine.
- BioPunk: non-sensitive synthetic atlas and mesh geometry in public CI; authorized original content tests only in private secure allowed execution with zero private runner spend (do not project without owner approval).

## Decision rule
No extra standalone repo until independent product needs warranted. Reusable Android `device-capabilities` library may live in Foundry as templates/contracts initially, then extracted into owned versioned repo on evidence. Three separate consumer apps can be maintained as individual repositories when started. Existing source authority remains in its project, not Foundry. No automatic store submission, signing or public-private projection.
