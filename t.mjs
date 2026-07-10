import { chromium } from 'playwright';
const b=await chromium.launch();
for (const w of [1440, 1280]) {
  const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
  try{await p.getByText('Got it').first().click();}catch(e){}
  const items = await p.locator('nav.nav-links > *').all();
  const xs=[]; for (const it of items){ const bb=await it.boundingBox(); if(bb) xs.push(Math.round(bb.x+bb.width/2)); }
  console.log(`W=${w} | tab centres:`, xs.join(', '));
  if (w===1440) await p.screenshot({path:'/tmp/nav3.png', clip:{x:0,y:0,width:1440,height:90}});
  await p.context().close();
}
await b.close();
