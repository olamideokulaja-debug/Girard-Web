import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
await p.evaluate(()=>localStorage.clear());
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1400);
const leak = await p.evaluate(() => { const raw = localStorage.getItem('girard_pm_v3') || ''; return /bankAcctNo|bankAcctName/.test(raw); });
console.log('NO bank account details on any property:', !leak);
console.log('app works:', (await p.locator('header.pm-topbar').count())>0, '| ERR:', log.length?log.join('|'):'none');
await p.locator('.pm-side nav .pm-nav',{hasText:'Properties'}).first().click(); await p.waitForTimeout(600);
console.log('properties render:', (await p.locator('main').innerText()).includes('Bed'));
await b.close();
