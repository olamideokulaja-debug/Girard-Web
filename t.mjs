import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:1000}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
console.log('section present:', (await p.locator('body').innerText()).includes('A guided tour of the platform'));
console.log('step 1 caption:', (await p.locator('body').innerText()).includes('Manage your whole portfolio'));
// image loaded?
const nat = await p.locator('img[src="/walkthrough/1.jpg"]').first().evaluate(e=>e.naturalWidth).catch(()=>0);
console.log('walkthrough image loaded (naturalWidth):', nat);
// scroll to it and screenshot
await p.locator(':text("A guided tour of the platform")').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
await p.screenshot({path:'/tmp/walkthrough.png'});
// click Next -> step 2
await p.locator('button[aria-label="Next"]').first().click(); await p.waitForTimeout(500);
console.log('after Next -> step 2 caption:', (await p.locator('body').innerText()).includes('List, let and take enquiries'));
// pause toggle exists
console.log('pause/play control present:', (await p.locator('button[aria-label="Pause"], button[aria-label="Play"]').count())>0);
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
