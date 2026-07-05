import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:1000}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
// find any justified narrative + confirm headings not justified
const stats = await p.evaluate(() => {
  const all=[...document.querySelectorAll('div,p,span')];
  let justified=0, headings=0, headingJustified=0;
  for (const el of all){ const ta=getComputedStyle(el).textAlign; const t=(el.textContent||'').trim();
    if (ta==='justify' && t.length>60) justified++;
  }
  for (const el of document.querySelectorAll('h1,h2,h3')){ headings++; if(getComputedStyle(el).textAlign==='justify') headingJustified++; }
  return { justified, headings, headingJustified };
});
console.log('justified narrative blocks visible on landing:', stats.justified);
console.log('headings on landing:', stats.headings, '| headings wrongly justified:', stats.headingJustified);
await p.screenshot({path:'/tmp/landing.png', fullPage:false});
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
