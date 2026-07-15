import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:950}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Platform Admin');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1400);
// admin rent view = "Payments"? use Rent reminders? Try owner instead via switcher-free: admin has no Rent&invoices; use owner
await p.context().close();
const p2=await (await b.newContext({viewport:{width:1440,height:950}})).newPage();
p2.on('pageerror',e=>log.push(String(e.message||e)));
const c2=async(t)=>{ try{await p2.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p2.waitForTimeout(350);}catch(e){} };
await p2.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p2.waitForTimeout(400);
try{await p2.getByText('Got it').first().click();}catch(e){}
await c2('Get started'); await c2('Owner / Landlord');
try{ await p2.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p2.waitForTimeout(400);}catch(e){}
await p2.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p2.locator('input[type=password]').first().fill('test1234');
await c2('Create account'); await p2.waitForTimeout(1400);
await p2.locator('.pm-side nav .pm-nav',{hasText:'Rent & invoices'}).first().click(); await p2.waitForTimeout(700);
const rt=await p2.locator('main').innerText();
console.log('OWNER rent rows show admin fee note:', rt.includes('admin fee'));
console.log('OWNER sees Remind (not Pay):', rt.includes('Remind'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
