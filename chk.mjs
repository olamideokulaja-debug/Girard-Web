import { chromium } from 'playwright';
const b=await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const p=await (await b.newContext({viewport:{width:1200,height:900}})).newPage(); const log=[]; p.on('pageerror',e=>log.push(e.message));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3500});await p.waitForTimeout(400);}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);}catch(e2){}} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.locator(':text("Got it"):visible').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
await p.fill('input[type=email]','plan_owner@girard.example'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1000);
await clickV('Pay & continue'); await p.waitForTimeout(1200);
await clickV('Plans & pricing'); await p.waitForTimeout(600);
console.log('Membership tier:', await has(p,'Membership'));
console.log('annual price 50,000:', await has(p,'50,000'));
console.log('per year label /yr:', await has(p,'/yr'));
console.log('billed annually:', await has(p,'billed annually'));
console.log('Current membership CTA:', await has(p,'Current membership'));
console.log('NO Free tier:', !(await has(p,'Free')));
console.log('enterprise Contact sales:', await has(p,'Contact sales'));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
