import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
await p.evaluate(()=>localStorage.setItem('girard_purged_v1','1'));
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
await c('Get started'); await c('Investor');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2500}); await p.waitForTimeout(300);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await c('Create account'); await p.waitForTimeout(1400);
await p.locator('.pm-side nav .pm-nav',{hasText:'Market intelligence'}).first().click(); await p.waitForTimeout(1200);
const t=await p.locator('main').innerText();
console.log('INTEL:', t.replace(/\s+/g,' ').slice(0,260));
console.log('no invented "values are up 8.4%":', !/values are up|8\.4%|6\.2%/.test(t));
console.log('honest empty state (no Supabase here):', t.includes('No briefing for') || t.includes('Loading the latest'));
console.log('illustrative charts labelled:', t.includes('Illustrative shape, not live data'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
