import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:412,height:732},deviceScaleFactor:2});
const p=await ctx.newPage();
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);}catch(e2){}} };
const shot=async(n)=>{ await p.waitForTimeout(500); await p.screenshot({path:`/tmp/shots/${n}.png`}); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
try{await p.getByText('Got it').first().click();await p.waitForTimeout(200);}catch(e){}
// 1 home hero
await shot('1_home');
// 2 one Bourdillon (mobile menu)
try{ await p.locator('.pm-burger, [aria-label=Menu]').first().click({timeout:1500}); }catch(e){}
await clickV('1 Bourdillon'); await shot('2_bourdillon');
// 3 listings browse
try{ await p.locator('.nav-burger, button').filter({hasText:''}); }catch(e){}
// open menu again for listings
try{ await p.locator('header button').last().click({timeout:1500}); await p.waitForTimeout(300);}catch(e){}
await clickV('Browse our listings'); await shot('3_listings');
// sign in as owner + pay (demo auto-success)
await clickV('Get started'); await clickV('Owner / Landlord');
await p.fill('input[type=email]','review@girardpropertylimited.com'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1000);
await clickV('Pay & continue'); await p.waitForTimeout(1200);
await shot('4_dashboard');
// swaps via drawer
const goNav=async(label)=>{ try{await p.locator('.pm-burger').first().click({timeout:2000});await p.waitForTimeout(300); await p.locator('.pm-side nav .pm-nav',{hasText:label}).first().click({timeout:2500});await p.waitForTimeout(600);}catch(e){} };
await goNav('Swap'); await shot('5_swaps');
await goNav('Payment'); await shot('6_payments');
console.log('captured');
await b.close();
