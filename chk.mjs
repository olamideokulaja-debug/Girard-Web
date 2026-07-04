import { chromium } from 'playwright';
const b=await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const c=await b.newContext({viewport:{width:1300,height:1000}}); const p=await c.newPage(); const log=[]; p.on('pageerror',e=>log.push(e.message));
const tap=async(t,ex=false)=>{try{await p.getByText(t,{exact:ex}).first().click({timeout:5000});await p.waitForTimeout(400);}catch(e){console.log('miss:',t);}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await tap('Get started'); await tap('Owner / Landlord',true);
await p.fill('input[type=email]','demo_owner@girard.example'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:2000});}catch(e){}
await tap('Create account'); await p.waitForTimeout(1100);
console.log('DEMO signup -> dashboard:', await has(p,'Dashboard'));
await tap('Settings',true); await p.waitForTimeout(400);
console.log('settings + change role present:', await has(p,'Change role'), '| ERR:', log.length?log.join('|'):'none');
await b.close();
