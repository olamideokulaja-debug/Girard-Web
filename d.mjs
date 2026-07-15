import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
await p.route('**/api/paystack-subaccount', r => r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify({configured:true, ok:true, subaccount_code:'ACCT_fake123', split_code:'SPL_fake123', account_name:'OLAMIDE OKULAJA'}) }));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1400);
await p.locator('input[placeholder="e.g. Olamide Okulaja"]').fill('Olamide Okulaja');
await p.locator('input[placeholder="10-digit NUBAN"]').fill('0123456789');
await clickV('Create test landlord & tenancy'); await p.waitForTimeout(900);
await p.locator('.pm-side nav .pm-nav',{hasText:'Rent & invoices'}).first().click(); await p.waitForTimeout(700);
// what buttons are on the test invoice row?
const row = p.locator('tr', { hasText: 'test tenancy' }).first();
console.log('row buttons:', (await row.locator('button').allInnerTexts()).join(' | '));
await row.locator('button').first().click(); await p.waitForTimeout(700);
const t=await p.locator('body').innerText();
console.log('modal open?', t.includes('Pay rent') && t.includes('Total'));
console.log('has 5% line?', t.includes('administrative fee'));
console.log('has split note?', t.includes('routes Girard'));
console.log('modal text sample:', t.replace(/\s+/g,' ').slice(t.replace(/\s+/g,' ').indexOf('Pay rent'), t.replace(/\s+/g,' ').indexOf('Pay rent')+260));
await b.close();
