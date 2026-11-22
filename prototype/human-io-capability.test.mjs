import test from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, normalizeHumanIntent, probeClientCapabilities } from "./human-io-capability.mjs";

test("no permission APIs invoked or inferred physical devices", () => {
  const calls = [];
  const mock = {
    navigator: {
      getGamepads() { calls.push("gamepad"); throw Error("not allowed"); },
      mediaDevices: {
        getUserMedia() { calls.push("camera"); throw Error("not allowed"); },
      },
      hid: { requestDevice() { calls.push("hid"); throw Error("not allowed"); } },
      bluetooth: { requestDevice() { calls.push("bluetooth"); throw Error("not allowed"); } },
      vibrate() { calls.push("vibrate"); throw Error("not allowed"); },
    },
    window: { PointerEvent: function PointerEvent(){}, File: function File(){},
              FileReader: function FileReader(){}, speechSynthesis: {} },
    document: { documentElement: {} },
  };
  const result = probeClientCapabilities(mock);
  assert.deepEqual(calls, []);
  assert.equal(result.permissions_requested, false);
  assert.equal(result.human_approval_authorized, false);
  assert.equal(result.agent_tool_authorized, false);
  assert.equal(result.production_admitted, false);
  assert.equal(result.capabilities.length, Object.keys(CATEGORIES).length);
  for (const c of result.capabilities) {
    assert.equal(c.permission_granted, false);
    assert.equal(c.device_observed, false);
    assert.equal(c.runtime_exercised, false);
  }
  assert.equal(result.capabilities.find(x => x.id === "hid-api").api_present, true);
});

test("unknown/headless environment remains unknown, not unsupported", () => {
  const result = probeClientCapabilities();
  assert.ok(result.capabilities.every(x => !x.api_present && !x.device_observed));
});

test("accessible review intent is not an action approval", () => {
  for (const channel of ["switch-access","braille-display","touch","pen","gamepad",
                         "eye-gaze","keyboard","voice","sip-puff"]) {
    const r = normalizeHumanIntent({ channel, kind:"request-approval", sequence:12 });
    assert.equal(r.approved, false);
    assert.equal(r.authorization, "UNTRUSTED_INPUT_ONLY");
  }
});

test("reject injected privileged fields and invalid event envelopes", () => {
  const malformed = [
    null,
    {channel:"touch",kind:"execute-tool",sequence:1},
    {channel:"touch",kind:"request-approval",sequence:1,approved:true},
    {channel:"touch",kind:"attach",sequence:1,image:"raw-media"},
    {channel:"../../admin",kind:"select",sequence:1},
    {channel:"touch",kind:"select",sequence:-1},
    {channel:"touch",kind:"select",sequence:0.5},
    {channel:"touch",kind:"select",sequence:"1"},
  ];
  for (const payload of malformed) {
    assert.throws(() => normalizeHumanIntent(payload));
  }
});
