import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(300);}catch(e){}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1100);
await p.locator('.pm-side nav .pm-nav',{hasText:'Swap marketplace'}).first().click(); await p.waitForTimeout(600);
const t=await p.locator('body').innerText();
console.log("button reads correctly:", t.includes("Got it, let's start"));
console.log("no garbled u2019/u2026:", !t.includes('\\u2019') && !t.includes('\\u2026') && !t.includes('\\u20a6') && !t.includes('\\u00b7'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
