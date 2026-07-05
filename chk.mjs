import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:430,height:1200}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
await p.screenshot({path:'/tmp/narrow.png', fullPage:false});
const hy = await p.evaluate(()=>{ let n=0; for(const el of document.querySelectorAll('div,p,span')){ const cs=getComputedStyle(el); if(cs.textAlign==='justify' && (cs.hyphens==='auto')) n++; } return n; });
console.log('justified blocks with hyphens active:', hy, '| ERR:', log.length?log.join('|'):'none');
await b.close();
