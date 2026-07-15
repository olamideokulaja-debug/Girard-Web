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
await p.locator('input[placeholder="CLEAR"]').fill('CLEAR'); await clickV('Clear sample data'); await p.waitForTimeout(1200);
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(1600);
const d=await p.locator('main').innerText();
console.log('DASH:', d.replace(/\s+/g,' ').slice(0,190));
console.log('tickets zeroed:', /Open tickets 0/.test(d.replace(/\s+/g,' ')), '| no "1 emergency":', !d.includes('1 emergency'));
// deep sweep for ANY sample names across every screen
const names=/Chidera|Fatima|Chuka|Ada Eze|Tunde Adeyemi|Grace N\.|Kitunde|Jennifer|Godwin|K\. Mensah|A\. Whitmore|R\. Haddad|L\. Okafor|J\. Rivera|Girard Client/;
let found=[];
for (const nav of ['Dashboard','Properties','Applications','Enquiries','Rent & invoices','Jobs & repairs','Swap marketplace','Documents']) {
  try { await p.locator('.pm-side nav .pm-nav',{hasText:nav}).first().click({timeout:2000}); await p.waitForTimeout(600);
    const t=await p.locator('main').innerText(); if (names.test(t)) found.push(nav); } catch(e){}
}
console.log('screens still showing sample names:', found.length? found.join(', ') : 'NONE');
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
