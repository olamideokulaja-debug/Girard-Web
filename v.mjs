import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
try{await p.getByText('Got it').first().click();}catch(e){}
await c('Get started'); await c('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(300);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await c('Create account'); await p.waitForTimeout(1500);
// add a sale listing via the real form, then open it
await p.locator('.pm-side nav .pm-nav',{hasText:'Properties'}).first().click(); await p.waitForTimeout(900);
const txt=await p.locator('main').innerText();
console.log('properties screen text len:', txt.length, '| shows any property:', /Bed|Land|Studio/.test(txt));
// click the first card image area
const imgs=await p.locator('main svg, main img').count();
if(imgs){ await p.locator('main svg, main img').first().click({force:true}); await p.waitForTimeout(800); }
const t=await p.locator('body').innerText();
console.log('detail opened:', t.includes('Amenities') || t.includes('Sale commission') || t.includes('Verified'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
