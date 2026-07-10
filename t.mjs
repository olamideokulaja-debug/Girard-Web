import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
const logo = await p.locator(':text-is("GIRARD")').first().boundingBox();
console.log('logo left x (px from edge):', logo? Math.round(logo.x): 'n/a');
console.log('nav still shows How it works:', (await p.locator(':text-is("How it works"):visible').count())>0);
await p.screenshot({path:'/tmp/nav.png', clip:{x:0,y:0,width:1440,height:90}});
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
