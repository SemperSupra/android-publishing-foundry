/**
 * R45 read-only client reattachment to one external session authority.
 * Device view preferences are local; conversation, workspace, artifacts,
 * memory, tool state, pending work and approval HISTORY belong to the server.
 * Reattachment NEVER imports credentials, executes tools or approves actions.
 */
import {projectSessionView} from "./presentation-adapter.mjs";

const SLOTS = Object.freeze([
  "conversation","workspace","artifacts","memory","tool_state",
  "pending_work","approvals","model","dle"
]);
const REF=/^[A-Za-z0-9._:-]{1,80}$/;
const HEX=/^[0-9a-f]{64}$/;
const safeCounter=x=>Number.isSafeInteger(x)&&x>=0;
const safeRef=x=>typeof x==="string"&&REF.test(x);

export function validateRemoteSnapshot(snapshot) {
  if (snapshot?.schema!=="actor-cross-device-session-snapshot/v1" ||
      !snapshot.session || !snapshot.context ||
      typeof snapshot.session!=="object" || typeof snapshot.context!=="object" ||
      !safeRef(snapshot.session.id) ||
      !safeRef(snapshot.session.owner_scope) ||
      !safeCounter(snapshot.session.revision) ||
      !safeCounter(snapshot.session.last_event_seq) ||
      !HEX.test(snapshot.session.context_digest ?? "") ||
      !["idle","running","paused","awaiting-approval","unknown"].includes(snapshot.session.run_state)) {
    throw new Error("Untrusted or incomplete server-owned session");
  }
  if (Object.keys(snapshot.context).sort().join("|")!==[...SLOTS].sort().join("|")) {
    throw new Error("Missing shared context component");
  }
  for (const [key,value] of Object.entries(snapshot.context)) {
    if (value===null && key!=="conversation") continue;
    if (!value || Object.keys(value).sort().join("|")!=="digest|ref|revision" ||
        !safeRef(value.ref) || !HEX.test(value.digest ?? "") || !safeCounter(value.revision)) {
      throw new Error("Invalid context reference");
    }
  }
  if (Object.keys(snapshot).sort().join("|")!=="admission|context|presentation|schema|session" ||
      Object.keys(snapshot.session).sort().join("|")!==
         "context_digest|id|last_event_seq|owner_scope|revision|run_state" ||
      Object.keys(snapshot.admission ?? {}).sort().join("|")!==
         "authenticated_by_external_service|carries_approval_token|grants_tool_authority|production_admitted" ||
      Object.values(snapshot.admission).some(v=>v!==false) ||
      snapshot.presentation?.portable!==true ||
      snapshot.presentation?.device_local_preferences!==true ||
      snapshot.presentation?.content_truncated!==false) {
    throw new Error("Client cannot inherit session authority");
  }
  // SHA-256 context manifest is verified by the external server and the R45
  // canonical source oracle, NOT by this browser-only source-presence checker.
  return snapshot;
}

export function reattachReadOnly(snapshot, afterSeq=0) {
  validateRemoteSnapshot(snapshot);
  if (!safeCounter(afterSeq) || afterSeq>snapshot.session.last_event_seq) {
    throw new Error("Invalid replay cursor");
  }
  return {
    schema:"actor-session-reattach-request/v1",
    operation:"read-only-reattach",
    session_id:snapshot.session.id,
    known_revision:snapshot.session.revision,
    known_context_digest:snapshot.session.context_digest,
    after_seq:afterSeq,
    approval_transfer:false,
    tool_authority_transfer:false,
  };
}
export function freshClientView(snapshot) {
  validateRemoteSnapshot(snapshot);
  return {snapshot, eventRefs:[], afterSeq:0,
          caughtUp:snapshot.session.last_event_seq===0,
          authority:"NONE_FROM_CLIENT_VIEW"};
}

export function acceptReplayPage(view,page) {
  if (!view?.snapshot || !Array.isArray(view.eventRefs)) throw new Error("Invalid view");
  const s=validateRemoteSnapshot(view.snapshot).session;
  if (page?.schema!=="actor-session-replay-page/v1" ||
      Object.keys(page).sort().join("|")!==
        "context_digest|events|has_more|next_seq|revision|schema|session_id" ||
      page.session_id!==s.id) throw new Error("Cross-session or injected replay");
  if (page.revision!==s.revision || page.context_digest!==s.context_digest) {
    throw new Error("STALE_SNAPSHOT_REQUIRES_AUTHORITATIVE_REFRESH");
  }
  if (!Array.isArray(page.events) || page.events.length>256) throw new Error("Unbounded page");
  let seq=view.afterSeq;
  for(const e of page.events) {
    if (!e || Object.keys(e).sort().join("|")!=="digest|kind|seq" ||
        e.seq!==++seq || !HEX.test(e.digest ?? "") ||
        !["message","tool-call","tool-result","status","artifact",
          "approval-request","approval-decision","context-change"].includes(e.kind)) {
      throw new Error("Replay is not contiguous or source-typed");
    }
  }
  if (page.next_seq!==seq || seq>s.last_event_seq ||
      typeof page.has_more!=="boolean" ||
      page.has_more!==(seq<s.last_event_seq)) throw new Error("Replay cursor mismatch");
  return {
    snapshot:view.snapshot,
    eventRefs:[...view.eventRefs,...page.events],
    afterSeq:seq, caughtUp:!page.has_more,
    authority:"NONE_FROM_CLIENT_VIEW",
  };
}

export function viewOnDevice(view,layout) {
  if (!view?.snapshot || !Array.isArray(view.eventRefs) ||
      !safeCounter(view.afterSeq) || view.authority!=="NONE_FROM_CLIENT_VIEW") {
    throw new Error("Untrusted local device view");
  }
  // Treat event refs as identical immutable source identity; actual content
  // resolution is governed by the external session service.
  const session={id:view.snapshot.session.id,
                 taskDigest:view.snapshot.session.context_digest,
                 events:view.eventRefs};
  const rendered=projectSessionView(session,layout);
  return {...rendered,contextRefs:view.snapshot.context,
          sessionRevision:view.snapshot.session.revision,
          approvalsTransferred:false,actorAuthorityTransferred:false,
          localPresentationOnly:true};
}
