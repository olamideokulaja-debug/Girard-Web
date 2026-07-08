import { chromium } from 'playwright';
const b=await chromium.launch();
async function cap(w,name){
  const log=[]; const p=await (await b.newContext({viewport:{width:w,height:820}})).newPage();
  p.on('pageerror',e=>log.push(String(e.message||e)));
  const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2000});await p.waitForTimeout(300);}catch(e){}};
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(300);
  try{await p.getByText('Got it').first().click();}catch(e){}
  await clickV('Get started'); await clickV('Owner / Landlord');
  await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
  try{await p.locator('input[type=checkbox]').first().check();}catch(e){}
  await clickV('Create account'); await p.waitForTimeout(1100);
  // open swap via burger on mobile or sidebar on desktop
  try{ await p.locator('.pm-side nav .pm-nav',{hasText:'Swap marketplace'}).first().click({timeout:2000}); }
  catch(e){ try{ await p.locator('.pm-burger').first().click(); await p.waitForTimeout(300); await p.locator('.pm-side nav .pm-nav',{hasText:'Swap marketplace'}).first().click(); }catch(e2){} }
  await p.waitForTimeout(700);
  await p.screenshot({path:`/tmp/${name}.png`});
  console.log(name,'intro shown:',(await p.getByText('How the Swap Marketplace works',{exact:false}).count())>0,'| ERR:',log.length?log.join('|'):'none');
  await p.context().close();
}
await cap(1300,'popup_desktop');
await cap(390,'popup_mobile');
await b.close();
