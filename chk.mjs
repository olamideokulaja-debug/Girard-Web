import { chromium } from 'playwright';
const b=await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const c=await b.newContext({viewport:{width:1300,height:1000}}); const p=await c.newPage(); const log=[]; p.on('pageerror',e=>log.push(e.message));
const tap=async(t,ex=false)=>{try{await p.getByText(t,{exact:ex}).first().click({timeout:5000});await p.waitForTimeout(400);}catch(e){console.log('miss:',t);}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await tap('Get started'); await tap('Owner / Landlord',true);
await p.fill('input[type=email]','swap_owner@girard.example'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:2000});}catch(e){}
await tap('Create account'); await p.waitForTimeout(1100);
// seed a completed-ready swap journey
await p.evaluate(() => {
  const j={ stage:6, paid:true, prop:{market:"Nigeria",area:"Lekki",value:"120000000",currency:"₦",photos:[],docs:["Certificate of Occupancy"]}, verified:true, targets:[], match:{place:"Manchester, UK",title:"2-Bed Flat",value:"£240,000",by:"J. Smith"}, chat:[], agreementText:"AGREEMENT", signedMe:true, signedThem:true, escrowFunded:true, balanceValue:"", finalMe:true, finalThem:true, revealed:true, contractText:"CONTRACT OF SALE", payoutName:"", payoutNum:"", payoutBank:"", stopped:false, flagged:false };
  localStorage.setItem("girard_swapjourney_v1", JSON.stringify(j));
});
await tap('Swap marketplace',true); await p.waitForTimeout(700);
console.log('at final stage (Complete swap visible):', (await p.getByText('Complete swap',{exact:true}).count())>0);
await tap('Complete swap',true); await p.waitForTimeout(1000);
console.log('filed card shows:', await has(p,'Completed swaps (1)'));
console.log('filed entry:', await has(p,'Lekki → Manchester'));
console.log('journey reset (Complete swap gone):', (await p.getByText('Complete swap',{exact:true}).count())===0);
console.log('fresh journey ready (Register step present):', await has(p,'Register'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
