import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);}catch(e){}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1200);
await p.locator('.pm-side nav .pm-nav',{hasText:'Swap marketplace'}).first().click(); await p.waitForTimeout(600);
await clickV("Got it, let\u2019s start"); await p.waitForTimeout(300);
await clickV('Browse'); await p.waitForTimeout(500);
console.log('badges Permanent (substring):', await p.getByText('Permanent',{exact:false}).count(), '| Temporary:', await p.getByText('Temporary',{exact:false}).count());
await clickV('List for swap'); await p.waitForTimeout(500);
console.log('main has "Swap type":', (await p.locator('main').innerText()).includes('Swap type'));
console.log('main mentions Temporary helper:', (await p.locator('main').innerText()).toLowerCase().includes('no ownership'));
await b.close();
