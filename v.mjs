import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
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
const t=await p.locator('main').innerText();
console.log('subaccount shown:', t.includes('ACCT_fake123'), '| split shown:', t.includes('SPL_fake123'));
console.log('PAY button on card:', (await p.getByRole('button',{name:/Pay the .* test invoice now/}).count())>0);
console.log('test card hint shown:', t.includes('4084 0840 8408 4081'));
// click pay (no paystack key locally -> falls back and marks success)
await p.getByRole('button',{name:/Pay the .* test invoice now/}).click(); await p.waitForTimeout(900);
console.log('paid confirmation:', (await p.locator('main').innerText()).includes('Now open Paystack'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
