import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
// home should NOT contain the walkthrough now
console.log('home has NO tour section:', !(await p.locator('body').innerText()).includes('A guided tour of the platform'));
// click How it works
await p.locator(':text-is("How it works"):visible').first().click(); await p.waitForTimeout(700);
console.log('tour tab shows walkthrough:', (await p.locator('body').innerText()).includes('A guided tour of the platform') && (await p.locator('body').innerText()).includes('Your portfolio at a glance'));
console.log('counter 1 / 10 present:', (await p.locator('body').innerText()).includes('1 / 10'));
// does it fit without scrolling? check the controls counter is within viewport height
const box = await p.locator(':text("1 / 10")').first().boundingBox();
const scrollH = await p.evaluate(()=>document.body.scrollHeight);
console.log('controls bottom Y:', box? Math.round(box.y+box.height): 'n/a', '| viewport 900 | page scrollHeight:', scrollH);
console.log('fits in viewport (controls within 900):', box ? (box.y+box.height) <= 900 : false);
await p.screenshot({path:'/tmp/tour.png'});
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
