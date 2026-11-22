/**
 * R46 three-audience human-intent control projections for shared sessions.
 * This is a client-side descriptor, not a login, transport, or authority.
 * The human's authenticated intervention is handled by the existing server.
 */
import {validateRemoteSnapshot} from "./session-reattach.mjs";

const PHASES=new Set(["Running","PauseRequested","Quiescent","StopRequested","Stopped"]);
const ACTIONS=["guide","pause","stop","resume"];
const LABELS=Object.freeze({
  guide:"Provide guidance and pause",pause:"Request pause",stop:"Request stop",
  resume:"Request resume"
});
const KEY=/^[A-Za-z0-9_.:-]{12,128}$/;
const SHA=/^[0-9a-f]{64}$/;
const safeInteger=n=>Number.isSafeInteger(n)&&n>=0;

export function projectControlSurfaces(snapshot, control) {
  validateRemoteSnapshot(snapshot);
  if (!control || Object.keys(control).sort().join("|")!==
        "epoch|phase|session_id" ||
      control.session_id!==snapshot.session.id ||
      !safeInteger(control.epoch) || !PHASES.has(control.phase)) {
    throw new Error("Untrusted control snapshot");
  }
  const hold=control.phase!=="Running";
  const humanControls=ACTIONS.map(kind=>({
    action_id:"session.human."+kind,
    kind,
    label:LABELS[kind],
    role:"button",
    keyboard_operable:true,
    touch_target:"large",
    accessible_name:LABELS[kind],
    enabled:kind==="resume"?control.phase==="Quiescent":
            kind==="guide"||kind==="pause"?
            !["StopRequested","Stopped"].includes(control.phase):
            control.phase!=="Stopped",
    requires_external_human_authentication:true,
    client_can_approve:false
  }));
  const human={
    schema:"suprachat-human-command-ui/v1",
    session_id:control.session_id,
    control_epoch:control.epoch,
    phase:control.phase,
    status_text:control.phase==="PauseRequested"?"Pause requested; worker stop unverified":
                control.phase==="StopRequested"?"Stop requested; worker stop unverified":
                control.phase==="Quiescent"?"Executor quiescent; review before resume":
                control.phase==="Stopped"?"Run stopped":"Run active",
    status_live_region:"polite",
    human_controls_first:true,
    controls:humanControls,
    human_identity_verified_in_client:false
  };
  const automation={
    schema:"suprachat-human-command-automation/v1",
    session_id:control.session_id,
    epoch:control.epoch,phase:control.phase,
    proposals_fenced:hold,
    command_capability:"READ_AND_PROPOSE_ONLY",
    approval_capability:"NONE_FROM_CLIENT",
    machine_readable:true
  };
  const agent={
    schema:"suprachat-human-command-agent/v1",
    session_id:control.session_id,
    epoch:control.epoch,phase:control.phase,
    model_actions_must_observe_epoch:true,
    stale_work_fenced_by_server:true,
    must_reconcile_human_guidance:hold,
    tool_dispatch_admitted:false,
    approval_capability:"NONE_FROM_CLIENT"
  };
  return {session_id:control.session_id,human,automation,agent};
}

/** A local UI click/voice/assistive event is ONLY an unsigned request proposal. */
export function proposeHumanIntervention(snapshot,control,kind,key,guidanceDigest=null) {
  const screens=projectControlSurfaces(snapshot,control);
  const target=screens.human.controls.find(c=>c.kind===kind);
  if (!target || !target.enabled || !KEY.test(key) ||
      (kind==="guide"?!SHA.test(guidanceDigest ?? ""):guidanceDigest!==null)) {
    throw new Error("Invalid or disabled intervention intent");
  }
  return {
    schema:"suprachat-human-intervention-proposal/v1",
    session_id:snapshot.session.id,
    expected_epoch:control.epoch,
    operation_key:key,
    kind, guidance_digest:guidanceDigest,
    authentication:"NOT_ESTABLISHED_IN_CLIENT",
    approval_granted:false,
    executable_tool_authority:false
  };
}
