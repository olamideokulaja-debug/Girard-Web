import { chromium } from 'playwright';
const b = await chromium.launch(); const c = await b.newContext({viewport:{width:1280,height:1000}}); const p = await c.newPage();
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const card = p.locator('#leadership .team-grid > div').first();
await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
await card.screenshot({path:'/tmp/card.png'});
console.log('ok');
await b.close();
