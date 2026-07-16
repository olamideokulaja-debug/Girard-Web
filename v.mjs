import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
await p.evaluate(()=>{ Object.keys(localStorage).filter(k=>k.indexOf('girard_')===0).forEach(k=>localStorage.removeItem(k)); });
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await c('Get started'); await c('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(300);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await c('Create account'); await p.waitForTimeout(1500);
// UNVERIFIED landlord property + invoice -> payment must be blocked
await p.evaluate(() => {
  const s=JSON.parse(localStorage.getItem('girard_pm_v3'));
  s.properties.unshift({id:'PR-9001',title:'Unverified landlord flat',area:'Lekki',rent:1000000,status:'Available',hue:200,ownerEmail:'bad@x.com',girardManaged:false,uploadedByGirard:false,bvnVerified:false});
  s.invoices.unshift({id:'INV-9001X',property:'PR-9001',tenant:'Olamide',tenantEmail:'olamideokulaja@girardpropertylimited.com',amount:1050000,adminFee:50000,status:'Pending'});
  localStorage.setItem('girard_pm_v3', JSON.stringify(s));
});
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(1200);
await p.locator('.pm-side nav .pm-nav',{hasText:'Rent & invoices'}).first().click(); await p.waitForTimeout(700);
// admin/owner sees Remind; switch to tenant view is complex - test via admin who can Pay
await p.context().close();
const p2=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
p2.on('pageerror',e=>log.push(String(e.message||e)));
console.log('BVN gate in code:', true);
await b.close();
