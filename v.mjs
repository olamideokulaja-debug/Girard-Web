import { chromium } from 'playwright';
const b=await chromium.launch(); const log=[];
async function withState(state){
  const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
  p.on('pageerror',e=>log.push(String(e.message||e)));
  const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){}};
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(200);
  await p.evaluate(s=>localStorage.setItem('girard_swapjourney_v1',JSON.stringify(s)), state);
  await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(300);
  try{await p.getByText('Got it').first().click();}catch(e){}
  await clickV('Get started'); await clickV('Owner / Landlord');
  await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
  try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
  await clickV('Create account'); await p.waitForTimeout(1000);
  await p.locator('.pm-side nav .pm-nav',{hasText:'Swap marketplace'}).first().click(); await p.waitForTimeout(500);
  try{await p.locator(':text-is("Got it, let\u2019s start"):visible').first().click({timeout:1500});await p.waitForTimeout(200);}catch(e){}
  await clickV('Start a swap'); await p.waitForTimeout(500);
  const t=await p.locator('main').innerText(); await p.context().close(); return t;
}
const base={ paid:true, verified:true, swapType:"Temporary", prop:{market:"Nigeria",area:"Ikeja",value:"250000000",currency:"\u20a6",photos:[],docs:[]}, targets:[], chat:[], match:{id:"SM-3",title:"4-Bed Villa, Palm",place:"Dubai, UAE",value:"AED 3.2M",by:"R. Haddad"} };
let t3=await withState({...base, stage:3});
// check MATCH CARD TITLES (not city chips)
console.log('CARD Villa/Dubai(temp) shown:', t3.includes('4-Bed Villa, Palm'));
console.log('CARD Riverside/London(perm) hidden:', !t3.includes('2-Bed Riverside Flat'));
console.log('CARD Townhouse/Toronto(perm) hidden:', !t3.includes('Detached Townhouse'));
console.log('CARD Condo/Ontario(both) shown:', t3.includes('3-Bed Condo, waterfront'));
console.log('CARD Brownstone/NY(both) shown:', t3.includes('Brownstone Apartment'));
let t6=await withState({...base, stage:6, signedMe:true, signedThem:true, tempFrom:"1 July 2026", tempTo:"21 July 2026" });
console.log('S6 contains "escrow"?', t6.toLowerCase().includes('escrow'), '| "title"?', t6.toLowerCase().includes('title'));
console.log('S6 text sample:', t6.replace(/\s+/g,' ').slice(0,240));
console.log('ERR:', log.length?log.join(' || '):'none');
await b.close();
