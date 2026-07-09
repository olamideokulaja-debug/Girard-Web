import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:950}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1300);
await p.locator('.pm-side nav .pm-nav',{hasText:'Add property'}).first().click(); await p.waitForTimeout(600);
const add=await p.locator('main').innerText();
console.log('ADD: no inline bank field (no "10-digit NUBAN"):', !add.includes('10-digit NUBAN'));
console.log('ADD: Girard-account note shown:', add.includes('no administrative fee'));
await p.locator('.pm-side nav .pm-nav',{hasText:'Data & privacy'}).first().click(); await p.waitForTimeout(600);
console.log('PRIVACY: Payout account card present:', (await p.locator('main').innerText()).includes('Payout account'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
