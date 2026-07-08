import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:412,height:732},deviceScaleFactor:2});
const p=await ctx.newPage();
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);return true;}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(400);return true;}catch(e2){return false;}} };
const shot=async(n)=>{ await p.waitForTimeout(500); await p.screenshot({path:`/tmp/shots/${n}.png`}); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();await p.waitForTimeout(200);}catch(e){}
// get to auth: try Get started; if not, open menu then Get started
let ok=await clickV('Get started');
if(!ok){ try{await p.locator('.pm-burger, header button').last().click({timeout:1500});await p.waitForTimeout(300);}catch(e){} await clickV('Get started'); }
await clickV('Owner / Landlord'); await p.waitForTimeout(300);
await p.locator('input[type=email]').first().fill('review@girardpropertylimited.com');
await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1000);
await clickV('Pay & continue'); await p.waitForTimeout(1300);
await shot('4_dashboard');
const goNav=async(label)=>{ try{await p.locator('.pm-burger').first().click({timeout:2000});await p.waitForTimeout(350); await p.locator('.pm-side nav .pm-nav',{hasText:label}).first().click({timeout:2500});await p.waitForTimeout(700);return true;}catch(e){return false;} };
console.log('dashboard reached, url text has topbar:', (await p.locator('header.pm-topbar').count())>0);
console.log('swaps nav:', await goNav('Swap')); await shot('5_swaps');
console.log('payments nav:', await goNav('Payment')); await shot('6_payments');
await b.close();
