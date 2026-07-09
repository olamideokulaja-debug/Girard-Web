import { chromium } from 'playwright';
const b=await chromium.launch();
async function login(role){
  const log=[]; const p=await (await b.newContext({viewport:{width:1300,height:950}})).newPage();
  p.on('pageerror',e=>log.push(String(e.message||e)));
  const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
  try{await p.getByText('Got it').first().click();}catch(e){}
  await clickV('Get started'); await clickV(role);
  await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
  try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
  await clickV('Create account'); await p.waitForTimeout(1300);
  return {p,log};
}
const T=async(p,s)=> (await p.locator('main').innerText()).includes(s);
const SIDE=async(p)=> (await p.locator('.pm-side').innerText());

// Investor
let {p,log}=await login('Investor');
console.log('INVESTOR default Dashboard(Total invested):', await T(p,'Total invested'), '| activity:', await T(p,'Portfolio activity'), '| Sell an asset:', await T(p,'Sell an asset'), '| Saved filter:', await T(p,'Saved ('), '| no Mortgage nav:', !(await SIDE(p)).includes('Mortgage'), '| ERR:', log.length?log.join('|'):'none');
await p.context().close();
// Tenant
({p,log}=await login('Tenant'));
console.log('TENANT rent review:', await T(p,'Rent review notice'), '| termination:', await T(p,'Request termination'), '| no Mortgage nav:', !(await SIDE(p)).includes('Mortgage'), '| ERR:', log.length?log.join('|'):'none');
await p.context().close();
// Agent
({p,log}=await login('Agent'));
const side=await SIDE(p);
console.log('AGENT disclaimer:', await T(p,'independent professionals'), '| no AI documents:', !side.includes('AI documents'), '| no Documents item:', !/(^|\n)\s*Documents(\n|$)/.test(side), '| ERR:', log.length?log.join('|'):'none');
await p.context().close();
await b.close();
