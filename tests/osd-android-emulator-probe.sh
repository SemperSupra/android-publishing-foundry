#!/usr/bin/env bash
# Runs inside a disposable Android API 35 emulator via pinned android-emulator-runner.
# This is browser availability/navigation smoke, NOT Android app or crossplay proof.
set -euo pipefail
OUT="${OSD_RDTE_OUTPUT:?}"; mkdir -p "$OUT"
export OSD_RDTE_OUTPUT="$OUT"
adb wait-for-device
BOOT="$(adb shell getprop sys.boot_completed | tr -d '\r')"
API="$(adb shell getprop ro.build.version.sdk | tr -d '\r')"
ABI="$(adb shell getprop ro.product.cpu.abi | tr -d '\r')"
adb shell pm list packages > "$OUT/packages.txt"
CHROME="$(grep -E '^package:(com.android.chrome|com.google.android.apps.chrome|com.android.browser)$' "$OUT/packages.txt" | head -1 | cut -d: -f2 || true)"
RESULT="NEGATIVE_OBSERVATION"
START=""
if [ "$BOOT" = "1" ] && [ "$API" = "35" ]; then
  if [ -n "$CHROME" ]; then
    set +e
    START="$(adb shell am start -a android.intent.action.VIEW -d 'https://mark-e-deyoung.github.io/open-space-duel/' 2>&1)"
    R=$?
    set -e
    if [ "$R" -eq 0 ] && grep -Eq 'Starting|cmp=|Status: ok|Warning: Activity not started' <<<"$START"; then RESULT="BROWSER_NAVIGATION_ATTEMPTED"; else RESULT="ENVIRONMENT_FAILURE"; fi
    sleep 4
    adb exec-out screencap -p > "$OUT/android.png" || true
  else
    RESULT="NO_BROWSER_PACKAGE"
  fi
else RESULT="EMULATOR_BOOT_OR_API_MISMATCH"; fi
printf '%s\n' "$RESULT" > "$OUT/result.txt"
node - <<'NODE'
const fs=require('fs'),path=require('path');
const out=process.env.OSD_RDTE_OUTPUT;
const get=k=>process.env[k]||'';
const result={
 schema:'osd-android-emulator-probe/v1',
 source:'already-public OSD 0.3.1 URL; no private repo',
 runner:get('RUNNER_LABEL'), android_api:35,
 classification:fs.readFileSync(path.join(out,'result.txt'),'utf8').trim(),
 caveat:'No Android app installed. Browser launch attempt is not game render, P2P, or crossplay acceptance.',
 time_utc:new Date().toISOString()
};
fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');
NODE
