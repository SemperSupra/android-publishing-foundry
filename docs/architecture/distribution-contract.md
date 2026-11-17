# Channel distribution and update contract

| Channel | Deliverable | Identity/signing | Production gate |
|---|---|---|---|
| Direct APK | installable signed APK + SHA256 and signature info | appId+developer app-signing cert | human |
| Self-hosted F-Droid | signed repository metadata/index and APK | qualified cert + signed index; client verifies repository key | human |
| Official F-Droid | reproducible upstream source/build recipe; APK signed according to accepted upstream policy | upstream sign cert or specifically verified reproducible developer-signature route | human submission + upstream review |
| Amazon Fire OS | device-compatible APK; AAB only when interface supports it | store-specific app signing under currently verified Amazon rules | human |
| Google Play | app bundle (.aab), signed with upload key | Play App Signing key distinct from upload key | human |

**Do not promise cross-channel in-place updates.** Android package ID, actual delivered signing cert, and monotonic version code must be compatible. Google Play App Signing may not yield the same delivered signing cert as a GitHub APK. Official F-Droid may apply its own signature. Maintain explicit pairwise transition matrix: direct↔self-hosted, direct↔official, direct↔Amazon, direct↔Play, official↔Play and others. Each entry is unknown until proven by install/update tests and current distributor signing terms; fallback is backup/export, uninstall, install and restore only with user consent.

F-Droid is the restrictive core: FLOSS dependencies, reproducible source, no mandatory proprietary SDKs, use documented anti-features where appropriate. Optional store billing, analytics, login and notification integrations must be compile-time isolated, not runtime hidden inside the official F-Droid build.

Release receipts bind exact artifact SHA256, source commit, appId, versionCode, channel, signing cert, approval ID and store result. Release tooling only may stage without production credentials; publish effects require an explicit approval predicate on that exact tuple.
