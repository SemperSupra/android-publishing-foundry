/**
 * R42 public-safe browser capability probe for an Android/tablet client.
 * This does not request HID/media permissions, read a device, launch an actor
 * or equate browser API presence with real installed hardware availability.
 * The canonical channel taxonomy and authority are Model Spelunker R42.
 */
export const CATEGORIES = Object.freeze({
  keyboard: ["keyboard"],
  pointer: ["mouse", "trackpad", "trackball", "pen", "stylus", "touch"],
  "gamepad-interface": ["gamepad", "joystick", "adaptive-controller"],
  "media-capture-api": ["camera", "microphone"],
  "speech-recognition-api": ["speech-recognition", "voice"],
  "speech-synthesis-api": ["audio-output"],
  "hid-api": ["gamepad", "joystick", "adaptive-controller", "braille-display", "switch-access", "midi-controller"],
  "bluetooth-api": ["gamepad", "keyboard", "mouse", "adaptive-controller"],
  "orientation-api": ["head-tracking", "hand-gesture", "motion-controller"],
  "screen-reader-accessibility": ["screen-reader", "braille-display", "switch-access"],
  "vibration-api": ["haptic-feedback"],
  "file-picker-api": ["photo-picker", "document-scanner"],
});
const UA = "UNKNOWN_API_PRESENCE_NOT_HARDWARE_ATTESTATION";
const own = (obj, name) => obj != null && name in Object(obj);

/** Return only known read-only feature flags; never prompts for access. */
export function probeClientCapabilities(env = {}) {
  const navigator = env.navigator ?? {};
  const window = env.window ?? {};
  const document = env.document ?? {};
  const present = {
    keyboard: own(window, "KeyboardEvent"),
    pointer: own(window, "PointerEvent"),
    "gamepad-interface": typeof navigator.getGamepads === "function",
    "media-capture-api": typeof navigator.mediaDevices?.getUserMedia === "function",
    "speech-recognition-api": own(window, "SpeechRecognition") ||
                              own(window, "webkitSpeechRecognition"),
    "speech-synthesis-api": own(window, "speechSynthesis"),
    "hid-api": own(navigator, "hid"),
    "bluetooth-api": own(navigator, "bluetooth"),
    "orientation-api": own(window, "DeviceOrientationEvent"),
    "screen-reader-accessibility": own(document, "documentElement"),
    "vibration-api": typeof navigator.vibrate === "function",
    "file-picker-api": own(window, "File") && own(window, "FileReader"),
  };
  return {
    schema: "android-foundry-human-io-probe/v1",
    purpose: "source-only-browser-capability",
    source: UA,
    capabilities: Object.keys(CATEGORIES).map((id) => ({
      id,
      mapped_channels: [...CATEGORIES[id]],
      api_present: !!present[id],
      device_observed: false,
      permission_granted: false,
      runtime_exercised: false,
    })),
    permissions_requested: false,
    human_approval_authorized: false,
    agent_tool_authorized: false,
    production_admitted: false,
  };
}

/** Browser event metadata is never a trusted approval token or raw media. */
export function normalizeHumanIntent(intent) {
  if (intent == null || typeof intent !== "object" ||
      Object.keys(intent).sort().join(",") !== "channel,kind,sequence" ||
      !["text","navigate","select","inspect","attach","dictate",
         "request-approval","cancel","status"].includes(intent.kind) ||
      !/^[a-z][a-z0-9-]{0,39}$/.test(intent.channel) ||
      !Number.isSafeInteger(intent.sequence) || intent.sequence < 0) {
    throw new Error("Unqualified human input event");
  }
  return Object.freeze({
    schema: "android-foundry-human-io-intent/v1",
    channel: intent.channel,
    kind: intent.kind,
    sequence: intent.sequence,
    authorization: "UNTRUSTED_INPUT_ONLY",
    approved: false,
  });
}
