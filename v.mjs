import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);}catch(e){}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1500);
const img = p.locator('.pm-topbar-right img').first();
const cnt = await img.count();
let ok=false, natural=0;
if(cnt){ const src=await img.getAttribute('src'); ok = (src||'').startsWith('data:image/jpeg;base64,'); natural = await img.evaluate(e=>e.naturalWidth); }
console.log('avatar <img> present:', cnt>0, '| src is embedded photo:', ok, '| image loaded (naturalWidth):', natural);
console.log('name shows:', (await p.getByText('Dr. Olamide Okulaja',{exact:false}).count())>0);
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
