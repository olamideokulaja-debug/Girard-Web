import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:950}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
console.log('landing OK, no crash:', (await p.locator('body').innerText()).length>200, '| ERR:', log.length?log.join('|'):'none');
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1400);
await p.locator('.pm-side nav .pm-nav',{hasText:'Data & privacy'}).first().click(); await p.waitForTimeout(600);
const t=await p.locator('main').innerText();
console.log('Payout card present:', t.includes('Payout account'), '| split explainer:', t.includes('routed automatically'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
