import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const log=[]; p.on('pageerror',e=>log.push('PAGEERR:'+String(e.message||e)));
p.on('console',m=>{ if(m.type()==='error') log.push('CONSOLE:'+m.text().slice(0,80)); });
const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
await p.route('**/api/paystack-subaccount', r => r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,ok:true,subaccount_code:'ACCT_x',split_code:'SPL_x',account_name:'OLAMIDE OKULAJA',bvn_verified:true})}));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await c('Get started'); await c('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(300);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await c('Create account'); await p.waitForTimeout(1500);
await p.locator('.pm-side nav .pm-nav',{hasText:'Data & privacy'}).first().click(); await p.waitForTimeout(800);
const t=await p.locator('main').innerText();
console.log('Payout card present:', t.includes('Payout account'));
console.log('BVN field present:', (await p.locator('input[placeholder="11 digits"]').count())>0);
// fill and save
try{
  await p.locator('input[placeholder="Account holder name"]').fill('Olamide Okulaja');
  await p.locator('input[placeholder="10-digit NUBAN"]').fill('0123456789');
  await p.locator('input[placeholder="11 digits"]').fill('12345678901');
}catch(e){ console.log('fill error:', e.message.slice(0,60)); }
await c('Save payout account'); await p.waitForTimeout(1200);
const body=await p.locator('body').innerText();
console.log('toast/result shown:', body.includes('BVN matched') || body.includes('verified and saved') || body.includes('saved'));
console.log('ERRORS:', log.length?log.join(' || '):'none');
await b.close();
