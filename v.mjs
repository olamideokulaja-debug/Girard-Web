import { chromium } from 'playwright';
const b=await chromium.launch();
async function run(label, apiReply){
  const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
  const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
  await p.route('**/api/paystack-subaccount', r => r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(apiReply)}));
  const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
  try{await p.getByText('Got it').first().click();}catch(e){}
  await c('Get started'); await c('Owner / Landlord');
  try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(300);}catch(e){}
  await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
  await c('Create account'); await p.waitForTimeout(1400);
  await p.locator('.pm-side nav .pm-nav',{hasText:'Data & privacy'}).first().click(); await p.waitForTimeout(700);
  await p.locator('input[placeholder="Account holder name"]').fill('Olamide Okulaja');
  await p.locator('input[placeholder="10-digit NUBAN"]').fill('0028842186');
  await p.locator('input[placeholder="11 digits"]').fill('22192144418');
  await c('Save payout account'); await p.waitForTimeout(1000);
  const t=await p.locator('main').innerText();
  console.log(label+':', t.replace(/\s+/g,' ').match(/(BVN matched[^.]*\.|Payout account saved[^.]*\.|Paystack says[^”]*”)/)?.[0]?.slice(0,110) || 'no message');
  console.log('   ERR:', log.length?log.join('|'):'none');
  await p.context().close();
}
await run('MATCHED   ', {configured:true,ok:true,check:"matched",bvn_verified:true,subaccount_code:'ACCT_a',split_code:'SPL_a',account_name:'OLAMIDE OKULAJA'});
await run('UNAVAILABLE', {configured:true,ok:true,check:"unavailable",bvn_verified:false,check_message:"Your balance is not enough to fulfill this request",subaccount_code:'ACCT_b',split_code:'SPL_b',account_name:'OLAMIDE OKULAJA'});
await run('MISMATCH  ', {configured:true,ok:false,bvn_mismatch:true,check:"mismatch",error:'Paystack says this bank account is not linked to that BVN. Paystack\u2019s exact words: \u201cProvided BVN does not match\u201d'});
await b.close();
