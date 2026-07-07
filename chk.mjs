import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
const heads=async()=>await p.evaluate(()=>[...document.querySelectorAll('section h1, section h2')].filter(h=>h.offsetParent!==null).map(h=>h.textContent.trim().replace(/\s+/g,' ').slice(0,34)));
const pick=async(drop,item)=>{ await p.getByText(drop,{exact:false}).first().hover(); await p.waitForTimeout(250); await p.locator('.navdrop-item',{hasText:item}).first().click(); await p.waitForTimeout(300); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
console.log('About dropdown present:', (await p.getByText('About ▾',{exact:false}).count())>0);
console.log('Listings dropdown present:', (await p.getByText('Listings ▾',{exact:false}).count())>0);
console.log('Leadership NOT a top-level nav button:', (await p.locator('nav.nav-links > .nav-link', {hasText:'Leadership'}).count())===0);
await pick('About','Leadership');       console.log('About>Leadership   :', JSON.stringify(await heads()));
await pick('About','Redefining');       console.log('About>Excellence   :', JSON.stringify(await heads()));
await pick('About','Strategic');        console.log('About>Advantages   :', JSON.stringify(await heads()));
await pick('Listings','Browse');        console.log('Listings>Browse    :', JSON.stringify(await heads()));
await pick('Listings','Estimate');      console.log('Listings>Returns   :', JSON.stringify(await heads()));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
