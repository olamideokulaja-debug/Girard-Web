import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message)); p.on('console',m=>{ if(m.type()==='error') log.push('console:'+m.text()); });
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);}catch(e){}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(2000);
console.log('topbar present:', (await p.locator('header.pm-topbar').count()));
console.log('paywall present:', (await p.getByText('Annual membership').count()));
console.log('auth page present:', (await p.getByText('Create your account').count()) + (await p.getByText('Welcome back').count()));
console.log('visible body text (first 200):', (await p.locator('body').innerText()).replace(/\s+/g,' ').slice(0,200));
console.log('ERR:', log.length?log.slice(0,3).join(' || '):'none');
await b.close();
