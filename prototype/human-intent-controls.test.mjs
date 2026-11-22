import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {projectControlSurfaces,proposeHumanIntervention} from "./human-intent-controls.mjs";

const sha=s=>createHash("sha256").update(s).digest("hex");
const slots=["conversation","workspace","artifacts","memory","tool_state",
             "pending_work","approvals","model","dle"];
function example() {
  const context=Object.fromEntries(slots.map(slot=>[slot,{
    ref:slot+":ref-1",digest:sha(slot),revision:1
  }]));
  const session={id:"session-1",owner_scope:"scope-1",revision:1,
    last_event_seq:0,context_digest:"0".repeat(64),run_state:"paused"};
  return {schema:"actor-cross-device-session-snapshot/v1",
    session,context,presentation:{
      portable:true,device_local_preferences:true,content_truncated:false
    },admission:{
      authenticated_by_external_service:false,grants_tool_authority:false,
      carries_approval_token:false,production_admitted:false}};
}
const control=(phase="Running",epoch=7)=>({session_id:"session-1",epoch,phase});

test("all three audiences see one session and one epoch, human controls lead",()=>{
  const p=projectControlSurfaces(example(),control());
  assert.equal(p.session_id,p.human.session_id);
  assert.equal(p.human.session_id,p.agent.session_id);
  assert.equal(p.agent.session_id,p.automation.session_id);
  assert.equal(p.agent.epoch,p.automation.epoch);
  assert.equal(p.human.control_epoch,p.agent.epoch);
  assert.equal(p.human.human_controls_first,true);
  for (const b of p.human.controls) {
    assert.equal(b.role,"button");
    assert.equal(b.keyboard_operable,true);
    assert.equal(b.touch_target,"large");
    assert.ok(b.accessible_name);
    assert.equal(b.client_can_approve,false);
  }
  assert.equal(p.agent.tool_dispatch_admitted,false);
  assert.equal(p.automation.command_capability,"READ_AND_PROPOSE_ONLY");
});

test("human intent request never manufactures verified human identity",()=>{
  const s=example(),c=control();
  const q=proposeHumanIntervention(s,c,"guide","human-intent-op-0001",sha("guidance"));
  assert.equal(q.authentication,"NOT_ESTABLISHED_IN_CLIENT");
  assert.equal(q.approval_granted,false);
  assert.equal(q.executable_tool_authority,false);
  assert.equal(q.session_id,s.session.id);
  assert.equal(q.expected_epoch,7);
  assert.equal(q.guidance_digest,sha("guidance"));
  assert.equal("token" in q,false);
  assert.equal("credentials" in q,false);
  assert.throws(()=>proposeHumanIntervention(s,c,"guide","human-intent-op-0001","raw voice text"));
});

test("pending/stop phases fence agents and do not misreport executor stop",()=>{
  for (const phase of ["PauseRequested","StopRequested"]) {
    const p=projectControlSurfaces(example(),control(phase,8));
    assert.equal(p.agent.must_reconcile_human_guidance,true);
    assert.equal(p.automation.proposals_fenced,true);
    assert.match(p.human.status_text,/unverified/);
    const resume=p.human.controls.find(x=>x.kind==="resume");
    assert.equal(resume.enabled,false);
    assert.throws(()=>proposeHumanIntervention(example(),control(phase,8),"resume","human-intent-op-0002"));
  }
  const quiescent=projectControlSurfaces(example(),control("Quiescent",9));
  assert.equal(quiescent.human.controls.find(x=>x.kind==="resume").enabled,true);
});

test("invalid or forged control payloads are refused",()=>{
  const s=example(),c=control();
  for(const bogus of [
    {...c,session_id:"other"},
    {...c,epoch:-1},
    {...c,epoch:"7"},
    {...c,phase:"APPROVED"},
    {...c,authenticated_human:true},
    {...c,tool_permission:true},
  ]) assert.throws(()=>projectControlSurfaces(s,bogus));
  assert.throws(()=>proposeHumanIntervention(s,c,"execute-tool","human-intent-op-0003"));
  assert.throws(()=>proposeHumanIntervention(s,c,"pause","short"));
  assert.throws(()=>proposeHumanIntervention(s,c,"stop","human-intent-op-0004",sha("extra")));
  assert.throws(()=>proposeHumanIntervention(s,c,"resume","human-intent-op-0005"));
});
