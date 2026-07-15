import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1100}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Platform Admin');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1600);
await p.locator('.pm-side nav .pm-nav',{hasText:'Financials'}).first().click(); await p.waitForTimeout(1000);
const t=await p.locator('main').innerText();
console.log('FINANCIALS:', t.replace(/\s+/g,' ').slice(0,240));
console.log('no fake 533.1M / 486M / 9.2M:', !/533,100,000|486,000,000|9,200,000|31,500,000/.test(t));
console.log('renders without crash:', t.includes('Financials'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
