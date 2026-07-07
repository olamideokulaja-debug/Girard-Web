import { chromium } from 'playwright';
const b=await chromium.launch(); const has=async(p,t)=>(await p.getByText(t,{exact:false}).count())>0;
const clickV=async(p,t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3500});await p.waitForTimeout(400);}catch(e){try{await p.locator(`:text("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(400);}catch(e2){}} };
const signup=async(role,email)=>{ const c=await b.newContext(); const p=await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
  try{await p.locator(':text("Got it"):visible').first().click();}catch(e){}
  await clickV(p,'Get started'); await clickV(p,role);
  await p.fill('input[type=email]',email); await p.fill('input[type=password]','test1234');
  try{await p.locator('input[type=checkbox]').first().check({timeout:1500});}catch(e){}
  await clickV(p,'Create account'); await p.waitForTimeout(1300);
  return {p,c,errs}; };
// review admin on real domain
{ const {p,c,errs}=await signup('Platform Admin','review@girardpropertylimited.com');
  console.log('review@girardpropertylimited.com -> dashboard:', await has(p,'Dashboard'), '| paywall shown?', await has(p,'Annual membership'), '| ERR:', errs.length?errs.join('|'):'none'); await c.close(); }
// founder admin
{ const {p,c}=await signup('Platform Admin','admin@girardpropertylimited.com');
  console.log('admin@girardpropertylimited.com -> dashboard:', await has(p,'Dashboard')); await c.close(); }
// old domain should now be REJECTED as admin
{ const {p,c}=await signup('Platform Admin','admin@girardproperty.com');
  console.log('OLD admin@girardproperty.com -> rejected (error shown):', await has(p,'Admin access is limited'), '| in app?', await has(p,'Dashboard')); await c.close(); }
// normal owner still hits paywall
{ const {p,c}=await signup('Owner / Landlord','someone@example.com');
  console.log('owner someone@example.com -> paywall shown:', await has(p,'Annual membership')); await c.close(); }
await b.close();
