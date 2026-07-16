import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await c('Get started'); await c('Platform Admin');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(300);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await c('Create account'); await p.waitForTimeout(1500);
const side=await p.locator('.pm-side').innerText();
console.log('Payout approvals in nav:', side.includes('Payout approvals'));
await p.locator('.pm-side nav .pm-nav',{hasText:'Payout approvals'}).first().click(); await p.waitForTimeout(800);
const t=await p.locator('main').innerText();
console.log('screen renders:', t.includes('Payout approvals'));
console.log('explains stale-BVN risk:', t.includes('out-of-date BVN'));
console.log('warns approvals are attributed:', t.includes('recorded against your name'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
