import { chromium } from 'playwright';
const b=await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const c=await b.newContext({viewport:{width:1300,height:1000}}); const p=await c.newPage(); const log=[]; p.on('pageerror',e=>log.push(e.message));
const tap=async(t,ex=false)=>{try{await p.getByText(t,{exact:ex}).first().click({timeout:5000});await p.waitForTimeout(400);}catch(e){console.log('miss:',t);}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await tap('Get started'); await tap('Platform Admin',true);
await p.fill('input[type=email]','admin@girardproperty.com'); await p.fill('input[type=password]','test1234');
try{await p.locator('input[type=checkbox]').first().check({timeout:2000});}catch(e){}
await tap('Create account'); await p.waitForTimeout(1200);
await tap('Payments',true); await p.waitForTimeout(500);
console.log('payments PDF+CSV buttons:', (await p.getByText('PDF',{exact:true}).count())>0, (await p.getByText('CSV',{exact:true}).count())>0);
// trigger PDF download
p.on('download',d=>console.log('download started:', d.suggestedFilename()));
await tap('PDF',true); await p.waitForTimeout(1500);
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
