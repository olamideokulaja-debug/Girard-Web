import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);return true;}catch(e){return false;} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1200);
await p.locator('.pm-side nav .pm-nav',{hasText:'Swap marketplace'}).first().click(); await p.waitForTimeout(600);
try{await p.locator(':text-is("Got it, let\u2019s start"):visible').first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){}
await clickV('Start a swap'); await p.waitForTimeout(500); log.push('[stage0 rendered]');
await clickV('Pay registration fee'); await p.waitForTimeout(800); log.push('[after pay]');
// stage1: fill property
try{ await p.locator('input').first().fill('Ikeja, Lagos'); }catch(e){}
await clickV('Submit for verification'); await p.waitForTimeout(500); log.push('[after submit prop]');
await clickV('Girard has verified me'); await p.waitForTimeout(600); log.push('[after verify]');
await clickV('Request swap'); await p.waitForTimeout(600); log.push('[after request swap]');
await clickV('Agree terms'); await p.waitForTimeout(500); log.push('[after agree]');
console.log('EVENTS/ERRORS:', log.join(' | '));
await b.close();
