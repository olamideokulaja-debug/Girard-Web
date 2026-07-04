import { chromium } from 'playwright';
const b = await chromium.launch();
// agent activate (paystack fallback) + swap fee + investor deal modal
{ const c = await b.newContext({viewport:{width:1280,height:1000}}); const p = await c.newPage(); const log=[]; p.on('pageerror',e=>log.push('ERR:'+e.message)); const has=async t=>(await p.getByText(t,{exact:false}).count())>0;
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
  await p.getByText('Get started',{exact:false}).first().click(); await p.waitForTimeout(300);
  await p.getByText('Agent',{exact:true}).first().click(); await p.waitForTimeout(300);
  await p.fill('input[type=email]','agent_ps@girard.example'); await p.fill('input[type=password]','test1234');
  await p.getByText('Create account',{exact:false}).first().click(); await p.waitForTimeout(1100);
  await p.getByText('Earnings',{exact:false}).first().click(); await p.waitForTimeout(400);
  await p.getByText('Pay registration fee',{exact:false}).first().click(); await p.waitForTimeout(600);
  console.log('agent activated (fallback):', await has('Total earned'), await has('₦11,040,000'));
  console.log('ERR-agent:', log.length?log.join('|'):'none');
  await c.close();
}
// investor deal modal + swap fee
{ const c = await b.newContext({viewport:{width:1280,height:1000}}); const p = await c.newPage(); const log=[]; p.on('pageerror',e=>log.push('ERR:'+e.message)); const has=async t=>(await p.getByText(t,{exact:false}).count())>0;
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
  await p.getByText('Get started',{exact:false}).first().click(); await p.waitForTimeout(300);
  await p.getByText('Investor / Developer',{exact:false}).first().click(); await p.waitForTimeout(300);
  await p.fill('input[type=email]','inv_ps@girard.example'); await p.fill('input[type=password]','test1234');
  await p.getByText('Create account',{exact:false}).first().click(); await p.waitForTimeout(1100);
  await p.getByText('Overview',{exact:false}).first().click(); await p.waitForTimeout(400);
  await p.getByText('Explore',{exact:true}).first().click(); await p.waitForTimeout(400);
  console.log('deal modal:', await has('Strategy'), await has('Projected returns'), await has('Discuss with Girard'));
  await p.getByText('Close',{exact:true}).first().click().catch(()=>{}); await p.waitForTimeout(200);
  await p.getByText('Swap marketplace',{exact:false}).first().click(); await p.waitForTimeout(400);
  await p.getByText('Pay registration fee',{exact:false}).first().click(); await p.waitForTimeout(500);
  console.log('swap fee -> property stage:', await has('Location / city')||await has('Property market'));
  console.log('ERR-inv:', log.length?log.join('|'):'none');
  await c.close();
}
// sales board + admin oversight checklist (inject a swap journey)
{ const c = await b.newContext({viewport:{width:1280,height:1000}}); const p = await c.newPage(); const log=[]; p.on('pageerror',e=>log.push('ERR:'+e.message)); const has=async t=>(await p.getByText(t,{exact:false}).count())>0;
  await p.addInitScript(()=>{ localStorage.setItem('girard_swapjourney_v1', JSON.stringify({ paid:true, stage:3, verified:true, prop:{market:"Nigeria",area:"Ikeja",value:"250,000,000",currency:"₦",photos:[],docs:[]}, targets:[], match:{place:"Ontario, Canada",title:"Condo"}, chat:[], agreementText:"", signedMe:false, signedThem:false, escrowFunded:false, balanceValue:"", finalMe:false, finalThem:false, revealed:false, contractText:"", stopped:false, flagged:false })); });
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
  await p.getByText('Get started',{exact:false}).first().click(); await p.waitForTimeout(300);
  await p.getByText('Platform Admin',{exact:false}).first().click(); await p.waitForTimeout(300);
  await p.fill('input[type=email]','admin_ps@girardproperty.com'); await p.fill('input[type=password]','test1234');
  await p.getByText('Create account',{exact:false}).first().click(); await p.waitForTimeout(1100);
  await p.getByText('1 Bourdillon sales',{exact:false}).first().click(); await p.waitForTimeout(600);
  const unitCount = await p.locator('.unit-grid > button').count();
  console.log('sales board units loaded:', unitCount>0, '('+unitCount+')');
  await p.getByText('Swap oversight',{exact:false}).first().click(); await p.waitForTimeout(600);
  console.log('oversight checklist:', await has('Register & pay'), await has('Achieved'), await has('Not achieved'));
  console.log('ERR-admin:', log.length?log.join('|'):'none');
  await c.close();
}
await b.close();
