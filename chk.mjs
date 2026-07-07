import { chromium } from 'playwright';
const b=await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const clickV=async(p,t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(350);}catch(e){}};
const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage(); const log=[]; p.on('pageerror',e=>log.push(e.message));
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV(p,'Get started'); await clickV(p,'Platform Admin');
await p.fill('input[type=email]','admin@girardpropertylimited.com'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
await clickV(p,'Create account'); await p.waitForTimeout(1300);
// submit a report from Enquiries
await p.locator('nav .pm-nav',{hasText:'Enquiries'}).first().click(); await p.waitForTimeout(600);
await p.getByRole('button',{name:'Report',exact:true}).first().click(); await p.waitForTimeout(300);
await clickV(p,'Report this enquiry');
await clickV(p,'Submit report'); await p.waitForTimeout(400);
// open admin queue
await p.locator('nav .pm-nav',{hasText:'Flagged reports'}).first().click(); await p.waitForTimeout(600);
console.log('Flagged reports screen:', await has(p,'Flagged reports'));
console.log('report appears in queue:', await has(p,'enquiry'), '| has Resolve:', await has(p,'Resolve'));
await clickV(p,'Resolve'); await p.waitForTimeout(400);
console.log('after resolve -> shows resolved:', await has(p,'resolved') || await has(p,'RESOLVED'));
// messages report control
await p.locator('nav .pm-nav',{hasText:'Tenant messages'}).first().click(); await p.waitForTimeout(600);
const threadBtns = await p.locator('.pm-card button, button').filter({hasText:'@'}).count();
if (threadBtns>0){ await p.locator('button').filter({hasText:'@'}).first().click(); await p.waitForTimeout(300);
  console.log('messages: report control in conversation:', (await p.getByRole('button',{name:'Report',exact:true}).count())>0);
} else console.log('messages: no demo threads to open (control shows when a chat is open)');
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
