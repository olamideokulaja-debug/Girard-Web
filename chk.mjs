import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
// hero visible = the .hero-h actually rendered (offsetParent not null)
const heroShown=async()=>await p.evaluate(()=>{const el=document.querySelector('.hero-h');return !!el && el.offsetParent!==null;});
const clickTab=async(name)=>{ await p.getByRole('button',{name, exact:true}).first().click(); await p.waitForTimeout(400); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
console.log('HOME: hero actually rendered:', await heroShown());
await clickTab('About');
console.log('ABOUT: hero actually hidden:', !(await heroShown()));
await clickTab('Home');
console.log('HOME again: hero actually rendered:', await heroShown());
await b.close();
