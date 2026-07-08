import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:412,height:732},deviceScaleFactor:2})).newPage();
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);}catch(e){}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('review@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(900); await clickV('Pay & continue'); await p.waitForTimeout(1200);
await p.locator('.pm-burger').first().click(); await p.waitForTimeout(400);
await p.locator('.pm-side nav .pm-nav',{hasText:'Rent & invoices'}).first().click(); await p.waitForTimeout(800);
await p.screenshot({path:'/tmp/shots/6_rent.png'});
await b.close();
