import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
const vis=async(t)=>await p.getByText(t,{exact:false}).first().isVisible().catch(()=>false);
const heroVis=async()=>await p.evaluate(()=>{const el=document.querySelector('.hero-h');return !!el && el.offsetParent!==null;});
const tab=async(name)=>{ await p.getByRole('button',{name, exact:true}).first().click(); await p.waitForTimeout(300); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
const bourd=async()=>await vis('Featured development'); // the 1 Bourdillon marker
console.log('HOME       : hero',await heroVis(),'| bourdillon hidden',!(await bourd()));
await tab('About');       console.log('ABOUT      : own',await vis('Redefining excellence'),'| why-choose',await vis('Strategic advantages'),'| bourdillon hidden',!(await bourd()));
await tab('Services');    console.log('SERVICES   : own',await vis('comprehensive suite'),'| bourdillon hidden',!(await bourd()));
await tab('Platform');    console.log('PLATFORM   : own',await vis('Two flagship modules'),'| bourdillon hidden',!(await bourd()));
await tab('Who we serve');console.log('WHO        : own',await vis('role-aware platform'),'| bourdillon hidden',!(await bourd()));
await tab('1 Bourdillon');console.log('BOURDILLON : shows featured',await bourd(),'| hero hidden',!(await heroVis()));
await tab('Listings');    console.log('LISTINGS   : own',await vis('Homes worth moving for'),'| bourdillon hidden',!(await bourd()));
await tab('Leadership');  console.log('LEADERSHIP : own',await vis('Our leadership'),'| bourdillon hidden',!(await bourd()));
await tab('Partners');    console.log('PARTNERS   : own',await vis('trusted partnerships'),'| cta',await vis('Sign up to become a partner'),'| bourdillon hidden',!(await bourd()));
await tab('Contact');     console.log('CONTACT    : own',await vis('Speak with Girard'),'| lets-build',await vis('build something enduring'),'| bourdillon hidden',!(await bourd()));
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
