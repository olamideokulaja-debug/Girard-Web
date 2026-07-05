import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3500});await p.waitForTimeout(400);}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);}catch(e2){}} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.locator(':text("Got it"):visible').first().click();}catch(e){}
await clickV('Get started'); await clickV('Platform Admin');
await p.fill('input[type=email]','admin@girardproperty.com'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
await clickV('Create account'); await p.waitForTimeout(1300);
let bad=[];
for (const label of ['Financials','Sign-ups','Reports','Payments','Users']){
  await clickV(label); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>({o:document.documentElement.scrollWidth>window.innerWidth+2, kpiCols:(()=>{const el=document.querySelector('.dash-kpi');return el?getComputedStyle(el).gridTemplateColumns.split(' ').length:0})()}));
  if(r.o) bad.push(label+' overflow');
  console.log(label,'| overflow:',r.o,'| kpi columns:',r.kpiCols);
}
console.log('desktop errors:', errs.length?errs.join('|'):'none');
await b.close();
