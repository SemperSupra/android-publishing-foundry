// No secrets, no app installation: bounded actual iPhoneSimulator Safari URL/screenshot probe.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const out=process.env.OSD_RDTE_OUTPUT||path.join(process.cwd(),'osd-ios-evidence');fs.mkdirSync(out,{recursive:true});
const receipt={schema:'osd-ios-simulator-probe/v1',source:'already-public OSD 0.3.1 URL',runner:process.env.RUNNER_LABEL||'unknown',classification:'NOT_RUN',time_utc:new Date().toISOString(),caveat:'Actual Simulator URL launch and screenshot, not native iOS app, verified gameplay, WebRTC or browser automation'};
const run=(args,timeout=30000)=>cp.spawnSync('xcrun',['simctl',...args],{encoding:'utf8',timeout,maxBuffer:2*1024*1024});
const save=()=>fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
let id;
try {
 const list=run(['list','devices','available','--json']);
 if(list.status!==0) throw Error('simctl list failed: '+list.stderr);
 const devices=JSON.parse(list.stdout).devices||{};
 const all=Object.values(devices).flat();
 const d=all.find(x=>x.name&&x.name.startsWith('iPhone')&&x.state==='Shutdown'&&x.isAvailable!==false);
 if(!d) {receipt.classification='NO_ELIGIBLE_SIMULATOR';save();process.exit(0);}
 id=d.udid;receipt.device=d.name;receipt.udid_hash=require('node:crypto').createHash('sha256').update(id).digest('hex');
 const boot=run(['boot',id],45000);
 if(boot.status!==0) throw Error('simctl boot failed '+boot.stderr);
 const ready=run(['bootstatus',id,'-b'],100000);
 if(ready.status!==0) throw Error('simctl bootstatus failed/timed out '+ready.stderr);
 receipt.boot='SUPPORTED';
 const navigation=run(['openurl',id,'https://mark-e-deyoung.github.io/open-space-duel/'],35000);
 receipt.openurl_exit=navigation.status;
 receipt.navigation_output=(navigation.stdout||navigation.stderr||'').slice(0,1200);
 if(navigation.status!==0) {receipt.classification='URL_LAUNCH_FAILED';}
 else {receipt.classification='SAFARI_URL_LAUNCH_REQUESTED';}
 const shot=run(['io',id,'screenshot',path.join(out,'simulator.png')],25000);
 receipt.screenshot_exit=shot.status;
 save();
} catch(e) {receipt.classification='ENVIRONMENT_FAILURE';receipt.error=String(e);save();}
finally {if(id) run(['shutdown',id],20000);}
if(!['SAFARI_URL_LAUNCH_REQUESTED','NO_ELIGIBLE_SIMULATOR'].includes(receipt.classification)) process.exitCode=1;
