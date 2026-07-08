import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1200,height:1550},deviceScaleFactor:1.5});
const p=await ctx.newPage();
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);return true;}catch(e){return false;} };
const shot=async(n)=>{ await p.waitForTimeout(600); await p.screenshot({path:`/tmp/tshots/${n}.png`}); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
try{await p.getByText('Got it').first().click();await p.waitForTimeout(200);}catch(e){}
// 1 Bourdillon (desktop nav button)
await clickV('1 Bourdillon'); await shot('bourdillon');
// Listings dropdown -> Browse
try{ await p.getByText('Listings ▾',{exact:false}).first().hover(); await p.waitForTimeout(250); await p.locator('.navdrop-item',{hasText:'Browse'}).first().click(); await p.waitForTimeout(500);}catch(e){}
await shot('listings');
// sign in owner + pay
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('review@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(900); await clickV('Pay & continue'); await p.waitForTimeout(1300);
await shot('dashboard');
// swaps via sidebar
try{ await p.locator('.pm-side nav .pm-nav',{hasText:'Swap'}).first().click({timeout:3000}); await p.waitForTimeout(700);}catch(e){}
await shot('swaps');
console.log('tablet shots captured');
await b.close();
