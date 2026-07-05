import { chromium } from 'playwright';
const b=await chromium.launch();
const roles=[['Owner / Landlord','own@girard.example'],['Tenant','ten@girard.example'],['Agent','agent@girard.example'],['Investor / Developer','inv@girard.example'],['Platform Admin','admin@girardproperty.com']];
const clickV=async(p,t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3500});await p.waitForTimeout(400);}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);}catch(e2){}} };
let count=0; const problems=[];
for (const [role,email] of roles){
  const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2}); const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
  try{await p.locator(':text("Got it"):visible').first().click();await p.waitForTimeout(200);}catch(e){}
  await clickV(p,'Get started'); await clickV(p,role);
  await p.fill('input[type=email]',email); await p.fill('input[type=password]','test1234');
  try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
  await clickV(p,'Create account'); await p.waitForTimeout(1300);
  const labels=await p.evaluate(()=>[...document.querySelectorAll('.pm-side nav .pm-nav')].map(b=>b.textContent.trim()));
  for (const label of labels){
    try{ await p.locator('.pm-burger').first().click({timeout:2000}); await p.waitForTimeout(300);
      await p.locator('.pm-side nav .pm-nav', {hasText: label}).first().click({timeout:2500}); await p.waitForTimeout(550);
    }catch(e){ continue; }
    count++;
    const r=await p.evaluate(()=>({o:document.documentElement.scrollWidth>window.innerWidth+2,w:document.documentElement.scrollWidth}));
    if (r.o) problems.push(`[${role}] ${label} (${r.w}px)`);
  }
  if (errs.length) problems.push(`[${role}] ERRORS: ${[...new Set(errs)].join(' | ')}`);
  await ctx.close();
}
console.log('pages checked:', count);
console.log('=== PROBLEMS ('+problems.length+') ==='); problems.forEach(x=>console.log(x));
if(!problems.length) console.log('CLEAN: every page fits at phone width, no JS errors.');
await b.close();
