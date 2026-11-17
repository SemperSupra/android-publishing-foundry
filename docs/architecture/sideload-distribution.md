# Sideloading contract — Android / Fire OS / Vega developer track
DLE status: **proposed requirements, no builds published**. Source review: 2026-11-17.

## Authorized targets and artifact types

| Family | Package | User installation | Update path | Minimum qualification |
|---|---|---|---|---|
| Android phone/tablet (incl. Play-capable) | signed, standalone **APK**, never AAB-only | OS unknown-app install permission or ADB | sideload another same-package same-signing-cert higher-versionCode APK; F-Droid repo can automate if matched | install, launch, persisted-data update, no downgrade |
| F-Droid clients | same signed APK when cert-compatible | self-hosted F-Droid repo QR/deep link, official F-Droid, or manual APK | F-Droid automatic discovery / eligible unattended install; cross-repo signing compatibility must be proven | app ID/cert/version and repo signature test |
| Amazon Fire tablet | signed compatible **APK** | permitted direct install or ADB, device-specific settings | manual repeated APK install or compatible package manager | device SDK/features/installer permission |
| Amazon Fire TV (Fire OS) | TV-compatible **APK** | ADB or permitted device installer | manual/ADB update or store where same cert | remote-control focus, TV manifest, install/update, Fire TV device qualification |
| Amazon Vega OS Fire TV | **VPKG**, *not* APK | Amazon Vega Developer Mode + CLI, subject to Amazon restrictions/cert provisioning | developer deployment; ordinary consumer sideload/update *not guaranteed* | separate Vega toolchain/device; defer to P2 |

## Artifact policy

On each approved release version generate when compatible:
- `app-<version>-android-universal.apk` (single installable APK; support ABI splits only as separate explicitly labeled files with install instructions).
- `app-<version>-fireos.apk` only if TV/device behavior or dependencies differ; otherwise reuse the certified universal APK and record the supported Fire OS matrix.
- `app-<version>-play.aab` for Play *submission*, not sideload use. Distinguish Play upload key from on-device Play App Signing certificate.
- `app-<version>-vega.vpkg` only in a separately qualified P2 Vega adapter; never rename APK to VPKG.
- SHA256SUMS, per-artifact signing cert fingerprint, versionCode, applicationId, SBOM/SPDX, SLSA-style provenance/evidence, install/uninstall/update documentation and supported device matrix. Release URL/index is locator; SHA digest is authority.

## Threat/security/update contract
- Human approval per channel, release candidate hash, exact source commit and signing identity before any production GitHub Release, Pages catalog or F-Droid metadata update. A build job may generate candidates but must never publish itself.
- Treat unknown-app install permission as a device-owner choice. Never encourage bypassing platform protections, developer verification, Play Protect or vendor security prompts.
- No automatic self-updater embedded in baseline app. For existing F-Droid users rely on signed repository index and F-Droid client; direct-APK users receive release notifications via opt-in RSS/website/GitHub and manually install updates unless a separate qualified updater is later approved.
- Signing cert incompatibilities across official F-Droid, Amazon, Play and sideload are explicit blockers for in-place updates, not warnings to ignore. Keep signature fingerprint + app ID + versionCode matrix and recovery/export path.
- Provision signing keys under offline owner control; never put app-signing key, Vega certificate, token or F-Droid repo-index key in Git or public CI artifacts. Public CI candidates use nonproduction key or unsigned builds.
- Official Google Android developer verification rollout began 2026-09-30 in Brazil, Indonesia, Singapore and **Thailand**, global expansion planned in 2027. Published Android sideload APKs on certified devices may require developer identity/package-name registration to avoid advanced-user flow, distinct from Amazon identity verification. Do not claim zero-account friction worldwide.
- Vega documentation permits developer-mode VPKG installation and may require Amazon-issued developer certificates. This does **not** prove unrestricted consumer sideload support. Track this as an independent external dependency.

## Qualification tests (must fail closed)
1. Install signed APK on emulator and qualify on actual supported Android hardware before claiming hardware support.
2. Install version N then update to N+1, preserve data, reject N-1 downgrade, reject changed appId or mismatched signing cert.
3. Discover update via self-hosted signed F-Droid metadata and validate repo key; test unattended only on eligible OS/client configurations.
4. Smoke test Fire OS tablet and Fire TV separately; verify remote focus on TV.
5. Verify APK and AAB identities and signing behavior; Play-signed delivered cert may differ from APK signed by publisher.
6. Validate no proprietary deps in F-Droid flavor; licenses, manifests, permissions, SBOM, artifact SHA, provenance, and accessibility review.
7. Negative fixtures for certificate mismatch, malicious repo/index, altered APK digest, incompatible ABI/SDK, denied unknown-app install, revoked credentials, fake approval and unsupported Vega APK.
8. Document coverage gaps as `not qualified`, never `passed`.

## Upstream references (revalidate before execution)
- Android alternative distribution: https://developer.android.com/distribute/marketing-tools/alternative-distribution
- Android verification: https://developer.android.com/developer-verification/guides
- Fire TV ADB: https://developer.amazon.com/docs/fire-tv/connecting-adb-to-device.html
- Vega developer install: https://developer.amazon.com/docs/vega/latest/developer-mode
- F-Droid signing: https://f-droid.org/en/docs/Signing_Process/
- F-Droid repo setup: https://f-droid.org/en/docs/Setup_an_F-Droid_App_Repo/
