import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:950}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);return true;}catch(e){return false;} };
const nav=async(label)=>{ try{ await p.locator('.pm-side nav .pm-nav',{hasText:label}).first().click({timeout:2500}); await p.waitForTimeout(500);}catch(e){ log.push('nav-miss:'+label);} };
const sw=async(role)=>{ try{ await p.getByText('WORKSPACE',{exact:false}).first().click({timeout:2000}); await p.waitForTimeout(300); await p.locator(`:text-is("${role}"):visible`).first().click({timeout:2000}); await p.waitForTimeout(600);}catch(e){ log.push('switch-miss:'+role);} };
const T=async(s)=> (await p.locator('main').innerText()).includes(s);

await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
// build label
const foot=await p.locator('body').innerText();
console.log('BUILD 5.0 label:', foot.includes('Tabs build 5.0'));
console.log('no "1 Bourdillon" on landing:', !foot.includes('1 Bourdillon'));
// founder login
await clickV('Get started'); await clickV('Owner / Landlord');
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1300);
console.log('OWNER: no paywall + switcher:', !(await T('Annual membership')) && (await p.getByText('WORKSPACE').count())>0);
console.log('OWNER: founder photo <img> in bar:', (await p.locator('.pm-topbar-right img').count())>0);
// add property lease + airbnb
await nav('Add property');
console.log('OWNER Add property: Airbnb option:', (await p.locator('option',{hasText:'Airbnb'}).count())>0, '| lease period visible:', (await p.locator('main').innerText()).toUpperCase().includes('LETTING TYPE'));
// applications risk + verified
await nav('Applications');
console.log('OWNER Applications: Risk column:', (await p.locator('th',{hasText:'Risk'}).count())>0, '| Verified badge:', await T('Verified by Girard'));
// investor
await sw('Investor');
console.log('INVESTOR: dashboard default (Total invested):', await T('Total invested'), '| activity feed:', await T('Portfolio activity'), '| Sell an asset:', await T('Sell an asset'), '| favourites heart(Saved):', await T('Saved ('));
// tenant
await sw('Tenant');
console.log('TENANT: rent review notice:', await T('Rent review notice'), '| termination:', await T('Request termination'));
// agent
await sw('Agent');
const agentNav=await p.locator('.pm-side').innerText();
console.log('AGENT: independence disclaimer:', await T('independent professionals'), '| no AI documents nav:', !agentNav.includes('AI documents'), '| no Documents nav:', !/\\bDocuments\\b/.test(agentNav));
// admin (founder = super -> sees Financials)
await sw('Platform Admin');
console.log('ADMIN(super founder): Financials visible:', (await p.locator('.pm-side').innerText()).includes('Financials'));
// ask AI disclaimer (back to owner)
await sw('Owner / Landlord'); await nav('Ask AI');
console.log('Ask AI disclaimer:', await T('AI-generated results may contain errors'));
console.log('PAGE ERRORS:', log.length?log.join(' || '):'none');
await b.close();
