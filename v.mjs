import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1500);
// inject a REAL property + invoice that must survive the purge
await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('girard_pm_v3'));
  s.properties.unshift({ id:'PR-2001', title:'REAL Landlord Flat', area:'Lekki', type:'Apartment', beds:2, rent:5000000, status:'Available', hue:200, ownerEmail:'real@x.com' });
  s.invoices.unshift({ id:'INV-2001', property:'PR-2001', tenant:'Real Tenant', amount:5250000, adminFee:250000, status:'Pending' });
  localStorage.setItem('girard_pm_v3', JSON.stringify(s));
});
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(1200);
const before = await p.evaluate(() => { const s=JSON.parse(localStorage.getItem('girard_pm_v3')); return {props:s.properties.length, invs:s.invoices.length, apps:(s.applications||[]).length}; });
console.log('BEFORE:', JSON.stringify(before));
const t=await p.locator('main').innerText();
console.log('Sample data card present:', t.includes('Sample data'));
// wrong confirm word must be refused
await p.locator('input[placeholder="CLEAR"]').fill('yes');
await clickV('Clear sample data'); await p.waitForTimeout(500);
const mid = await p.evaluate(() => JSON.parse(localStorage.getItem('girard_pm_v3')).properties.length);
console.log('refuses without the word CLEAR:', mid === before.props);
// now confirm properly
await p.locator('input[placeholder="CLEAR"]').fill('CLEAR');
await clickV('Clear sample data'); await p.waitForTimeout(900);
const after = await p.evaluate(() => { const s=JSON.parse(localStorage.getItem('girard_pm_v3')); return {props:s.properties.map(x=>x.id), invs:s.invoices.map(x=>x.id), apps:(s.applications||[]).length}; });
console.log('AFTER props:', after.props.join(',') || '(none)');
console.log('AFTER invs:', after.invs.join(',') || '(none)');
console.log('REAL property survived:', after.props.includes('PR-2001'), '| REAL invoice survived:', after.invs.includes('INV-2001'));
console.log('demo gone (no PR-10xx / PR-BOURDILLON):', !after.props.some(id => /^PR-10\d\d$/.test(id) || id==='PR-BOURDILLON'));
console.log('demo invoices gone:', !after.invs.some(id => /^INV-900\d$/.test(id)), '| demo apps gone:', after.apps===0);
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
