import { chromium } from 'playwright';
const b = await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const c=await b.newContext({viewport:{width:1300,height:1000}}); const p=await c.newPage(); const log=[]; p.on('pageerror',e=>log.push('ERR:'+e.message));
const tap=async(t,ex=false)=>{try{await p.getByText(t,{exact:ex}).first().click({timeout:5000});await p.waitForTimeout(400);}catch(e){console.log('miss:',t);}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
await tap('Get started'); await tap('Platform Admin',true);
await p.fill('input[type=email]','admin@girard.com'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:2000});}catch(e){}
await tap('Create account'); await p.waitForTimeout(1300);
console.log('admin logged in (Dashboard):', await has(p,'Dashboard'));
// nav Reports
try{await p.getByText('Reports',{exact:true}).first().click({timeout:4000});await p.waitForTimeout(600);}catch(e){console.log('nav miss');}
console.log('reports:', 'RentRoll='+await has(p,'Rent roll'), 'Fees='+await has(p,'Fees this month'), 'Area='+await has(p,'Listings by area'), '| ERR:', log.length?log.join('|'):'none');
await b.close();
