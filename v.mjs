import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1500);
// inject TEST-created data that the old sample-purge would have PROTECTED
await p.evaluate(() => {
  const s=JSON.parse(localStorage.getItem('girard_pm_v3'));
  s.properties.unshift({id:'PR-2001',title:'Our test flat',area:'Lekki',rent:5000000,status:'Available',hue:200,ownerEmail:'x@y.com'});
  s.invoices.unshift({id:'INV-2001',property:'PR-2001',tenant:'Test Person',amount:5250000,status:'Pending'});
  localStorage.setItem('girard_pm_v3', JSON.stringify(s));
  localStorage.setItem('girard_bank_v1', JSON.stringify({'testlandlord@x.com':{bankName:'Zenith Bank',bankAcctNo:'0000000000',subaccount:'ACCT_x'}}));
});
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const t1=await p.locator('main').innerText();
console.log('counts panel shows what is there:', t1.includes('Data in the system') && t1.includes('Payout accounts'));
// choose FULL reset
await clickV('Everything, including our test data'); await p.waitForTimeout(300);
await p.locator('input[placeholder="RESET EVERYTHING"]').fill('RESET EVERYTHING');
await clickV('Reset everything'); await p.waitForTimeout(1300);
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(1600);
const after = await p.evaluate(() => {
  const pm=JSON.parse(localStorage.getItem('girard_pm_v3')||'{}');
  return { props:(pm.properties||[]).length, invs:(pm.invoices||[]).length, apps:(pm.applications||[]).length,
           banks:Object.keys(JSON.parse(localStorage.getItem('girard_bank_v1')||'{}')).length,
           enq:(JSON.parse(localStorage.getItem('girard_enquiries_v1')||'{"items":[]}').items||[]).length };
});
console.log('AFTER full reset:', JSON.stringify(after));
console.log('test property PR-2001 gone:', after.props===0, '| test invoice gone:', after.invs===0, '| payout accounts gone:', after.banks===0);
const t2=await p.locator('main').innerText();
console.log('card now says empty:', t2.includes('Girard is empty and ready'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
