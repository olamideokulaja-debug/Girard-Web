import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1300}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(String(e.message||e)));
const c=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
await p.evaluate(()=>{
  const iso=(d)=>new Date(Date.now()+d*86400000).toISOString().slice(0,10);
  const s={properties:[{id:'PR-7001',ref:'GP-26-SL001',title:'Serviced 2-Bed, Ikoyi',area:'Ikoyi',state:'Lagos',country:'Nigeria',type:'Apartment',beds:2,rent:0,status:'Available',hue:210,intent:'To let',letType:'Short let',nightly:85000,cleaning:25000,deposit:100000,minNights:2,uploadedByGirard:true,amenities:['Parking'],photos:[],postedAt:new Date().toISOString()}],invoices:[],applications:[],leases:[],jobs:[],units:[],tickets:[]};
  localStorage.setItem('girard_pm_v3',JSON.stringify(s));
  localStorage.setItem('girard_bookings_v1',JSON.stringify([{id:'BK-1',property:'PR-7001',guest:'Someone',checkin:iso(5),checkout:iso(8),status:'Confirmed'}]));
  localStorage.setItem('girard_purged_v1','1');
});
await p.reload({waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await c('Get started'); await c('Tenant');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:2000}); await p.waitForTimeout(300);}catch(e){}
await p.locator('input[type=email]').first().fill('guest@example.com'); await p.locator('input[type=password]').first().fill('test1234');
await c('Create account'); await p.waitForTimeout(1500);
await p.locator('.pm-side nav .pm-nav',{hasText:'Find a home'}).first().click(); await p.waitForTimeout(900);
await p.getByText('Serviced 2-Bed, Ikoyi').first().click(); await p.waitForTimeout(1200);
const t=await p.locator('body').innerText();
console.log('detail opens:', t.includes('per night'));
console.log('nightly + min nights:', t.includes('85,000') && t.includes('Minimum 2 nights'));
console.log('booked nights blocked:', (await p.locator('button[style*="line-through"]').count())>0);
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
