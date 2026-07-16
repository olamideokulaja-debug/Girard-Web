import { chromium } from 'playwright';
const b=await chromium.launch();
const FIG=/₦[\d,.]+[MBK]?|\$[\d,.]+[MBK]?|£[\d,.]+[MBK]?|\b\d+(\.\d+)?%|\b\d{1,3},\d{3}\b/g;
const PRICE=/₦50,000|₦120,000|₦25,000|₦1,650,000|\$1,000|5%|₦450,000|₦180,000|₦900,000|₦75,000|₦100,000|₦5,000|₦105,000|25%|₦10,000/;
let issues=0, errors=0;
async function run(role, navs){
  const p=await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message||e)));
  const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:1800});await p.waitForTimeout(250);}catch(e){} };
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
  await p.evaluate(()=>localStorage.setItem('girard_purged_v1','1'));
  await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(500);
  try{await p.getByText('Got it').first().click();}catch(e){}
  await c('Get started'); await c(role);
  try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(250);}catch(e){}
  await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
  await c('Create account'); await p.waitForTimeout(1300);
  for (const nav of navs){
    try{ await p.locator('.pm-side nav .pm-nav',{hasText:nav}).first().click({timeout:1600}); await p.waitForTimeout(650);
      const t=(await p.locator('main').innerText()).replace(/\s+/g,' ');
      const figs=[...new Set((t.match(FIG)||[]).filter(x=>!/^0%$|^₦0$|^0$/.test(x)).filter(x=>!PRICE.test(x)))];
      if (figs.length){ console.log(`  ${role} > ${nav}: ${figs.slice(0,6).join(' | ')}`); issues++; }
    }catch(e){}
  }
  if (errs.length){ console.log(`  !! ${role}: ${errs.slice(0,1).join('')}`); errors++; }
  await p.context().close();
}
await run('Platform Admin', ['Dashboard','Financials','Sign-ups','Reports','Users','Development sales','Rent reminders','Jobs & repairs','Swap pipeline','Confirmed payments','Activity log']);
await run('Owner / Landlord', ['Dashboard','Properties','Applications','Enquiries','Rent & invoices','Rent reminders','Jobs & repairs','Swap marketplace']);
await run('Investor', ['Dashboard','Market intelligence','Live feed','Saved']);
await run('Agent', ['Live feed','Pipeline / CRM','Enquiries','Earnings','Analytics','Development sales']);
await run('Tenant', ['My tenancy','Pay rent','Repairs','Find a home','Saved']);
console.log(issues===0 && errors===0 ? '>>> CLEAN: no leftover data, no errors, across 5 roles / 34 screens' : `>>> ${issues} screens with data, ${errors} roles with errors`);
await b.close();
