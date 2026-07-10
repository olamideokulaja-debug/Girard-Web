import { chromium } from 'playwright';
const b=await chromium.launch();
const VW={width:1440,height:900};
const clickV=async(p,t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);return true;}catch(e){return false;} };
const nav=async(p,label)=>{ try{ await p.locator('.pm-side nav .pm-nav',{hasText:label}).first().click({timeout:2500}); await p.waitForTimeout(700);}catch(e){} };
async function login(role,email){
  const p=await (await b.newContext({viewport:VW})).newPage();
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
  try{await p.getByText('Got it').first().click();}catch(e){}
  await clickV(p,'Get started'); await clickV(p,role);
  await p.locator('input[type=email]').first().fill(email); await p.locator('input[type=password]').first().fill('test1234');
  try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
  await clickV(p,'Create account'); await p.waitForTimeout(1400);
  return p;
}
const shot=async(p,n)=>{ await p.waitForTimeout(500); await p.screenshot({path:`/tmp/shots/${n}.png`}); console.log('shot',n); };
const F='olamideokulaja@girardpropertylimited.com';
// OWNER screens
let p=await login('Owner / Landlord',F);
await nav(p,'Dashboard'); await shot(p,1);
await nav(p,'Applications'); await shot(p,2);
await nav(p,'Add property'); await shot(p,3);
await nav(p,'Properties'); await shot(p,4);
await nav(p,'Rent & invoices'); await shot(p,5);
await nav(p,'AI documents'); await shot(p,6);
await nav(p,'Swap marketplace'); await p.waitForTimeout(500);
try{await p.locator(':text-is("Got it, let\u2019s start"):visible').first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){}
await clickV(p,'Browse'); await shot(p,7);
await p.context().close();
// INVESTOR
p=await login('Investor',F);
await nav(p,'Dashboard'); await shot(p,8);
await p.context().close();
// TENANT
p=await login('Tenant','tenant@example.com');
await nav(p,'My tenancy'); await shot(p,9);
await p.context().close();
// AGENT
p=await login('Agent',F);
await nav(p,'Pipeline / CRM'); await shot(p,10);
await p.context().close();
await b.close();
