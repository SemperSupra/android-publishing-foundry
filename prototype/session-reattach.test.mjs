import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {observeViewport,choosePresentation} from "./presentation-adapter.mjs";
import {validateRemoteSnapshot,verifyContextDigest,reattachReadOnly,
        freshClientView,acceptReplayPage,viewOnDevice} from "./session-reattach.mjs";

function canonical(v) {
  if (Array.isArray(v))return "["+v.map(canonical).join(",")+"]";
  if (v!==null&&typeof v==="object") {
    return "{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+canonical(v[k])).join(",")+"}";
  }
  return JSON.stringify(v);
}
const sha=s=>createHash("sha256").update(s).digest("hex");
const slots=["conversation","workspace","artifacts","memory","tool_state",
             "pending_work","approvals","model","dle"];
function snapshot() {
  const context=Object.fromEntries(slots.map(slot=>[slot,{
    ref:slot+":ref-1",digest:sha("synthetic-"+slot),revision:7
  }]));
  return {
    schema:"actor-cross-device-session-snapshot/v1",
    session:{id:"session-1",owner_scope:"scope-1",revision:7,
             last_event_seq:3,context_digest:sha(canonical(context)),run_state:"paused"},
    context,
    presentation:{portable:true,device_local_preferences:true,content_truncated:false},
    admission:{authenticated_by_external_service:false,grants_tool_authority:false,
               carries_approval_token:false,production_admitted:false}
  };
}
const ev=i=>({seq:i,kind:"message",digest:sha("event-"+i)});
const page=(s,events,after,more)=>({
  schema:"actor-session-replay-page/v1",
  session_id:s.session.id,revision:s.session.revision,
  context_digest:s.session.context_digest,events,
  next_seq:after+events.length,has_more:more
});
const clone=x=>structuredClone(x);

test("same canonical session and context reattach on phone, tablet and desktop",async()=>{
  const s=snapshot();
  assert.equal(validateRemoteSnapshot(s),s);
  assert.equal(await verifyContextDigest(s),true);
  const refs=await Promise.all([0,0,0].map(n=>reattachReadOnly(s,n)));
  assert.deepEqual(refs[0],refs[1]);
  assert.deepEqual(refs[1],refs[2]);
  assert.equal(refs[0].operation,"read-only-reattach");
  assert.equal(refs[0].approval_transfer,false);
  assert.equal(refs[0].tool_authority_transfer,false);
  const devices=[[390,844],[900,1180],[2560,1440]];
  const views=[];
  for (const [width,height] of devices) {
    let view=await freshClientView(s);
    view=await acceptReplayPage(view,page(s,[ev(1)],0,true));
    view=await acceptReplayPage(view,page(s,[ev(2),ev(3)],1,false));
    const layout=choosePresentation(observeViewport({window:{innerWidth:width,innerHeight:height}}));
    const rendered=viewOnDevice(view,layout);
    assert.equal(view.caughtUp,true);
    assert.equal(rendered.sessionRevision,7);
    assert.equal(rendered.approvalsTransferred,false);
    assert.equal(rendered.actorAuthorityTransferred,false);
    views.push(rendered);
  }
  assert.deepEqual(views.map(x=>x.layout.tier),["compact","balanced","workspace"]);
  for(const v of views) {
    assert.deepEqual(v.events,views[0].events);
    assert.deepEqual(v.contextRefs,views[0].contextRefs);
    assert.equal(v.taskDigest,views[0].taskDigest);
    assert.equal(v.event_count,3);
    assert.equal(v.all_details_available,true);
  }
});
test("mutated context must fail SHA-256 before read-only attach",async()=>{
  const s=snapshot();
  s.context.workspace.revision=99;
  await assert.rejects(reattachReadOnly(s,0),/integrity mismatch/);
  await assert.rejects(freshClientView(s),/integrity mismatch/);
  const noCrypto=Promise.resolve(verifyContextDigest(snapshot(),null));
  await assert.rejects(noCrypto,/WebCrypto/);
});
test("stale revisions, gaps, duplicates and cross-session payloads refuse replay",async()=>{
  const s=snapshot(),view=await freshClientView(s);
  const cases=[
    {...page(s,[ev(1)],0,true),revision:8},
    {...page(s,[ev(1)],0,true),context_digest:sha("other")},
    {...page(s,[ev(1)],0,true),session_id:"other"},
    {...page(s,[ev(2)],0,true)},
    {...page(s,[ev(1),ev(1)],0,true)},
    {...page(s,[ev(1)],0,true),next_seq:3},
    {...page(s,[ev(1)],0,true),has_more:false},
    {...page(s,[ev(1)],0,true),approved:true},
    {...page(s,[{...ev(1),digest:"nope"}],0,true)},
  ];
  for (const v of cases) await assert.rejects(acceptReplayPage(view,v));
});
test("no leaked login, scope promotion, approval or local context authority",async()=>{
  const s=snapshot();
  const invalid=[
    {...s,admission:{...s.admission,grants_tool_authority:true}},
    {...s,admission:{...s.admission,carries_approval_token:true}},
    {...s,admission:{...s.admission,authenticated_by_external_service:true}},
    {...s,presentation:{...s.presentation,content_truncated:true}},
    {...s,presentation:{...s.presentation,approved:true}},
    {...s,context:{...s.context,memory:null,conversation:null}},
    {...s,context:{...s.context,approvals:{...s.context.approvals,token:"LOCAL"}}},
    {...s,session:{...s.session,owner_scope:""}},
  ];
  for(const v of invalid) assert.throws(()=>validateRemoteSnapshot(v));
  const req=await reattachReadOnly(s,0);
  assert.equal("secret" in req,false);
  assert.equal("credentials" in req,false);
  assert.equal("device" in req,false);
  await assert.rejects(reattachReadOnly(s,-1));
  await assert.rejects(reattachReadOnly(s,4));
});

test("canonical manifest digest matches independent Python protocol golden vector",()=>{
  const ctx=Object.fromEntries(slots.map(name=>[name,{ref:name+":fixture",digest:"0".repeat(64),revision:1}]));
  assert.equal(sha(canonical(ctx)),"4efd6a3938e52fe4d782f75b201a82070399b1dea7481c1f0634654fc6465c6a");
});
