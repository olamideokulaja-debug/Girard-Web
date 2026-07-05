import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3500});await p.waitForTimeout(400);}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);}catch(e2){}} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.locator(':text("Got it"):visible').first().click();}catch(e){}
await clickV('Get started'); await clickV('Platform Admin');
await p.fill('input[type=email]','admin@girardproperty.com'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1400);
const titleBefore = await p.locator('.pm-topbar-title-sub').first().textContent();
await p.locator('.pm-burger').first().click(); await p.waitForTimeout(500);
// scroll drawer to the Agent workspace button and click it
const btn = p.locator('.pm-side .pm-show-mobile .pm-nav', {hasText:'Agent'}).first();
await btn.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
await btn.click({timeout:4000}); await p.waitForTimeout(800);
const titleAfter = await p.locator('.pm-topbar-title-sub').first().textContent();
console.log('workspace name before:', titleBefore.trim());
console.log('workspace name after tapping Agent:', titleAfter.trim());
console.log('switched quickly (title changed to Agent, no sign-in):', titleAfter.trim()==='Agent' && (await p.locator('input[type=email]').count())===0, '| ERR:', log.length?log.join('|'):'none');
await b.close();
