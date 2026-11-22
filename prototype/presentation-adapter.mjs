/**
 * R44 presentation adaptation for an existing authenticated session.
 * Read-only browser hints; no device enumeration, media permissions or authority.
 * Small screens favor single-pane conversation and on-demand detail;
 * large screens can compose panels without altering or discarding task data.
 */
const TIERS = ["compact","balanced","workspace"];
const MODES = ["conversation","review","detail"];
const safeSize = n => Number.isSafeInteger(n) && n >= 160 && n <= 16384;

export function observeViewport(env = {}) {
  const w=env.window ?? {};
  const view=env.visualViewport ?? w.visualViewport ?? {};
  const width=Math.round(view.width ?? w.innerWidth ?? 390);
  const height=Math.round(view.height ?? w.innerHeight ?? 780);
  if (!safeSize(width) || !safeSize(height)) throw new Error("Invalid viewport");
  const scale=Number(view.scale ?? 1);
  if (!Number.isFinite(scale) || scale<0.5 || scale>5) throw new Error("Invalid viewport scale");
  // Browser APIs ordinarily cannot enumerate all physical desktop monitors.
  // screen.width is not trusted as multi-monitor topology.
  return Object.freeze({
    schema:"actor-browser-presentation-observation/v1",
    viewport:{width,height,scale},
    display_count: null,
    display_topology:"UNOBSERVED",
    input_capabilities:"UNOBSERVED",
    physical_hid_qualified:false,
    media_permissions_requested:false,
    session_authority_changed:false,
  });
}

export function choosePresentation(observation, preferences = {}) {
  if (observation?.schema !== "actor-browser-presentation-observation/v1" ||
      !safeSize(observation.viewport?.width) ||
      !safeSize(observation.viewport?.height) ||
      observation.display_topology !== "UNOBSERVED" ||
      observation.display_count !== null) throw new Error("Untrusted topology");
  if (Object.keys(preferences).some(k=>!["mode","density","textScale","reducedMotion"].includes(k))) {
    throw new Error("Unknown or privileged preference");
  }
  const textScale=preferences.textScale ?? 1;
  if (typeof textScale!=="number" || !Number.isFinite(textScale) || textScale<0.5 || textScale>4) {
    throw new Error("Invalid text scale");
  }
  const effective=observation.viewport.width/textScale;
  const predicted=effective<640?"compact":effective<1120?"balanced":"workspace";
  const density=preferences.density ?? predicted;
  if (!TIERS.includes(density))throw new Error("Unknown density override");
  const mode=preferences.mode ?? (density==="compact"?"conversation":density==="balanced"?"review":"detail");
  if (!MODES.includes(mode))throw new Error("Unknown mode override");
  const reducedMotion=preferences.reducedMotion??false;
  if (typeof reducedMotion!=="boolean")throw new Error("Invalid motion preference");
  return Object.freeze({
    schema:"actor-presentation-projection/v1",
    tier:density, default_mode:mode,
    navigation:density==="compact"?"drawer-or-bottom":"side-rail",
    panes:density==="compact"?1:density==="balanced"?2:3,
    detail_access:density==="compact"?"expandable":"parallel-or-expandable",
    touch_target:"large",reduced_motion:reducedMotion,
    all_task_details_accessible:true,
    task_content_changed:false, tool_scope_changed:false,
    approval_policy_changed:false,
    permission_requested:false, production_admitted:false,
  });
}

export function projectSessionView(session, projection) {
  if (session==null || typeof session!=="object" ||
      typeof session.id!=="string" || typeof session.taskDigest!=="string" ||
      !Array.isArray(session.events) ||
      projection?.schema!=="actor-presentation-projection/v1") {
    throw new Error("Invalid session/view contract");
  }
  // Preserve exactly the same event identities/ordering/contents even if the UI
  // chooses an expandable single pane. The view does not summarize or truncate.
  return {sessionId:session.id,taskDigest:session.taskDigest,
          events:session.events,layout:projection,
          event_count:session.events.length,all_details_available:true};
}
