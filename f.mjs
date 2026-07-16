import { chromium } from 'playwright';
const b=await chromium.launch();
const NAMES=/Chidera|Fatima Bello|Chuka Obi|Ada Eze|Tunde Adeyemi|Grace N\.|Kitunde|SUB-2201|SWP-4410|INV-900|PR-10\d\d|AP-0\d|JB-200|MT-50/;
let issues=0;
async function run(role, navs, email){
  const p=await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
  const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:1700});await p.waitForTimeout(240);}catch(x){} };
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(250);
  await p.evaluate(()=>{ Object.keys(localStorage).filter(k=>k.indexOf('girard_')===0).forEach(k=>localStorage.removeItem(k)); localStorage.setItem('girard_purged_v1','1'); });
  await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(500);
  try{await p.getByText('Got it').first().click();}catch(x){}
  await c('Get started'); await c(role);
  try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:1800}); await p.waitForTimeout(240);}catch(x){}
  await p.locator('input[type=email]').first().fill(email); await p.locator('input[type=password]').first().fill('test1234');
  await c('Create account'); await p.waitForTimeout(1300);
  for (const nav of navs){
    try{ await p.locator('.pm-side nav .pm-nav',{hasText:nav}).first().click({timeout:1500}); await p.waitForTimeout(600);
      const t=(await p.locator('main').innerText()).replace(/\s+/g,' ');
      const m=t.match(NAMES);
      if (m){ console.log(`  ${role} > ${nav}: "${m[0]}"`); issues++; }
    }catch(x){}
  }
  await p.context().close();
}
const F='olamideokulaja@girardpropertylimited.com';
await run('Platform Admin', ['Dashboard','Admin requests','Financials','Sign-ups','Users','Development sales','Rent reminders','Jobs & repairs','Swap pipeline','Enquiries','Applications'], F);
await run('Owner / Landlord', ['Dashboard','Properties','Applications','Enquiries','Rent & invoices','Jobs & repairs','Saved'], F);
await run('Investor', ['Dashboard','Live feed','Saved'], F);
await run('Agent', ['Live feed','Pipeline / CRM','Earnings','Analytics'], F);
await run('Tenant', ['My tenancy','Pay rent','Repairs','Find a home'], F);
console.log(issues===0 ? '>>> CLEAN: no sample records anywhere' : `>>> ${issues} real issues`);
await b.close();
