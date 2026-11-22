import test from "node:test";
import assert from "node:assert/strict";
import {observeViewport,choosePresentation,projectSessionView} from "./presentation-adapter.mjs";

function sample(width,height,scale=1) {
  return observeViewport({window:{innerWidth:width,innerHeight:height,visualViewport:{width,height,scale}}});
}

test("phone/tablet/workstation shape yields distinct views without changing task",()=>{
  const session={id:"same-session",taskDigest:"digest",events:[
    {id:1,kind:"tool",raw:"source detail"},
    {id:2,kind:"assistant",raw:"full response"}]};
  const devices=[sample(390,844),sample(850,1180),sample(2560,1440)];
  const projections=devices.map(x=>choosePresentation(x));
  assert.deepEqual(projections.map(x=>x.tier),["compact","balanced","workspace"]);
  assert.deepEqual(projections.map(x=>x.panes),[1,2,3]);
  assert.deepEqual(projections.map(x=>x.default_mode),["conversation","review","detail"]);
  for(const p of projections) {
    const v=projectSessionView(session,p);
    assert.strictEqual(v.events,session.events);
    assert.equal(v.event_count,2);
    assert.equal(v.all_details_available,true);
    assert.equal(p.task_content_changed,false);
    assert.equal(p.approval_policy_changed,false);
    assert.equal(p.tool_scope_changed,false);
  }
});
test("user preference and accessibility text scaling override heuristics",()=>{
  const p=choosePresentation(sample(1024,768),{textScale:2,mode:"detail"});
  assert.equal(p.tier,"compact");
  assert.equal(p.default_mode,"detail");
  assert.equal(p.detail_access,"expandable");
  const x=choosePresentation(sample(390,844),{density:"workspace",reducedMotion:true});
  assert.equal(x.tier,"workspace");
  assert.equal(x.reduced_motion,true);
});
test("browser screen hints cannot claim a physical monitor topology",()=>{
  const p=sample(3840,2160);
  assert.equal(p.display_topology,"UNOBSERVED");
  assert.equal(p.display_count,null);
  assert.equal(p.media_permissions_requested,false);
  const bad={...p,display_count:4,display_topology:"OS_ATTESTED"};
  assert.throws(()=>choosePresentation(bad));
});
test("no camera, HID, audio, or other active permission APIs are invoked",()=>{
  const calls=[];
  const p=observeViewport({
    window:{innerWidth:500,innerHeight:760},
    navigator:{
      mediaDevices:{getUserMedia(){calls.push("media");throw Error("active");}},
      hid:{requestDevice(){calls.push("hid");throw Error("active");}},
      bluetooth:{requestDevice(){calls.push("bluetooth");throw Error("active");}}
    }
  });
  choosePresentation(p);
  assert.deepEqual(calls,[]);
});
test("reject privileged, malformed and adversarial projection preferences",()=>{
  const p=sample(400,800);
  const cases=[
    {mode:"approve-tool"}, {density:"ADMIN"}, {approval:true},
    {textScale:0}, {textScale:NaN}, {textScale:"2"},
    {reducedMotion:"no"}, {toolAuthority:"grant"},
  ];
  for(const c of cases)assert.throws(()=>choosePresentation(p,c));
  assert.throws(()=>observeViewport({window:{innerWidth:0,innerHeight:800}}));
  assert.throws(()=>projectSessionView({id:"s",taskDigest:"d",events:"altered"},choosePresentation(p)));
});
