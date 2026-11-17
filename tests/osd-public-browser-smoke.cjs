// Public-only Open Space Duel 0.3.1 cross-runner browser smoke.
// No private source, production deployment, credentials, or release operations.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const root = process.env.OSD_PUBLIC_DIR;
const output = process.env.OSD_RDTE_OUTPUT || path.join(process.cwd(), 'osd-rdte-output');
const browserKind = process.env.OSD_BROWSER || 'chromium';
const deviceKind = process.env.OSD_DEVICE || 'desktop';
const lane = process.env.OSD_LANE || 'unknown';
const statusOnly = process.env.OSD_STATIC_ONLY === '1';
const portOrigin = 'http://127.0.0.1';
const expectedSource = 'ed917796a6f1bdf50a802143c68be4beff246929';
const mime = {'.html':'text/html', '.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.wasm':'application/wasm'};
fs.mkdirSync(output,{recursive:true});
const receipt = {
 schema:'osd-public-browser-probe/v1', runner:lane, browser:browserKind,
 device_profile:deviceKind, source_commit: expectedSource, release:'0.3.1',
 time_utc:new Date().toISOString(), classification:'NOT_RUN', checks:{},
 runtime:{node:process.version, platform:process.platform,arch:process.arch},
 evidence_limit:'smoke only: not real two-browser WebRTC, Android install, or native Safari'
};
const save=()=>fs.writeFileSync(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
function stop(err, classification='HARNESS_FAILURE') {
 receipt.classification=classification; receipt.error=String(err&&err.stack||err);
 save(); process.exitCode=1;
}
if (statusOnly) {
 receipt.classification='SKIPPED_GUARDRAIL';
 receipt.reason='Census runner is available, browser engine/ABI or embedded Android app not qualified on this class; no unsafe install or inferred browser result';
 save(); process.exit(0);
}
(async ()=>{
 if (!root) throw Error('OSD_PUBLIC_DIR missing');
 const ver=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
 if(ver.version!=='0.3.1') throw Error('Public version not 0.3.1');
 receipt.checks.version='PASS';
 const {chromium,firefox,webkit,devices}=require(path.join(process.env.RUNNER_TEMP,'osd-pw','node_modules','playwright'));
 const browserType={chromium,firefox,webkit}[browserKind];
 if(!browserType) throw Error('Unsupported browser type');
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,portOrigin);
  let requested=decodeURIComponent(url.pathname);
  if(requested.endsWith('/')) requested+='index.html';
  const target=path.resolve(root,'.'+requested);
  if(!target.startsWith(path.resolve(root)+path.sep)) {res.writeHead(403); return res.end();}
  fs.readFile(target,(err,bytes)=>{
   if(err){res.writeHead(404);return res.end();}
   res.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':'no-store'});
   res.end(bytes);
  });
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try {
   const launch = {headless:true};
   if(process.env.OSD_CHANNEL) launch.channel=process.env.OSD_CHANNEL;
   browser=await browserType.launch(launch);
   let opts={viewport:{width:1280,height:800}};
   if(deviceKind==='pixel') opts={...devices['Pixel 7']};
   else if(deviceKind==='iphone') opts={...devices['iPhone 13']};
   const context=await browser.newContext(opts);
   const page=await context.newPage();
   const failed=[];
   page.on('pageerror',e=>failed.push(String(e)));
   const url='http://127.0.0.1:'+server.address().port+'/';
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
   receipt.checks.http_status=response.status();
   await page.locator('#game-canvas').waitFor({state:'visible',timeout:20000});
   receipt.checks.canvas_present='PASS';
   receipt.checks.canvas_bbox=await page.locator('#game-canvas').boundingBox();
   receipt.checks.title=await page.title();
   receipt.checks.page_errors=failed.slice(0,10);
   const screenshot=path.join(output,'smoke.png');
   await page.screenshot({path:screenshot,timeout:10000});
   receipt.screenshot_sha256=crypto.createHash('sha256').update(fs.readFileSync(screenshot)).digest('hex');
   receipt.browser_version=browser.version();
   receipt.classification=failed.length?'ORACLE_FAILURE':'SUPPORTED_SMOKE_ONLY';
   await context.close();
 } finally {if(browser) await browser.close();await new Promise(resolve=>server.close(resolve));}
 if(receipt.classification!=='SUPPORTED_SMOKE_ONLY') process.exitCode=1;
 save();
})().catch(e=>stop(e,/Executable doesn't exist|browserType.launch|Host system is missing/.test(String(e))?'ENVIRONMENT_FAILURE':'HARNESS_FAILURE'));
