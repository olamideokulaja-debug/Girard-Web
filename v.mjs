import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:950}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
// pre-seed a landlord WITH a subaccount, as if Paystack had created one
await p.evaluate(()=>localStorage.setItem('girard_bank_v1', JSON.stringify({"testlandlord@example.com":{bankName:"Zenith Bank",bankAcctName:"Test Landlord",bankAcctNo:"0123456789",subaccount:"ACCT_test123",split_code:"SPL_test123"}})));
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1400);
const t1=await p.locator('main').innerText();
console.log('Test-split card on dashboard:', t1.includes('Test the 5% split'));
console.log('landlord listed:', t1.includes('testlandlord@example.com'));
await clickV('Create test tenancy'); await p.waitForTimeout(700);
await p.locator('.pm-side nav .pm-nav',{hasText:'Rent & invoices'}).first().click(); await p.waitForTimeout(700);
const t2=await p.locator('main').innerText();
console.log('test invoice present:', t2.includes('INV-TEST') || t2.includes('test tenancy'));
console.log('admin fee shown on it:', t2.includes('incl.') || t2.includes('admin fee'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
