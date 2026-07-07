import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
const shown=async(sel)=>await p.evaluate(s=>{const el=document.querySelector(s);return !!el && el.offsetParent!==null;},sel);
const heroShown=async()=>await p.evaluate(()=>{const el=document.querySelector('.hero-h');return !!el && el.offsetParent!==null;});
const txt=async(t)=>await p.getByText(t,{exact:false}).first().isVisible().catch(()=>false);
const tab=async(name)=>{ await p.getByRole('button',{name, exact:true}).first().click(); await p.waitForTimeout(350); };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
console.log('tabs:', (await p.getByRole('button',{name:'Listings',exact:true}).count())>0, (await p.getByRole('button',{name:'Leadership',exact:true}).count())>0, (await p.getByRole('button',{name:'Partners',exact:true}).count())>0, (await p.getByRole('button',{name:'Contact',exact:true}).count())>0);
console.log('HOME: hero shown:', await heroShown(), '| about hidden:', !(await shown('section#about')), '| footer shown:', await shown('footer'));
await tab('About');   console.log('ABOUT: about shown:', await shown('section#about'), '| hero hidden:', !(await heroShown()));
await tab('Listings');console.log('LISTINGS: content shown:', await txt('Homes worth moving for'), '| hero hidden:', !(await heroShown()));
await tab('Leadership');console.log('LEADERSHIP: content shown:', await txt('Our leadership'));
await tab('Partners');console.log('PARTNERS: content shown:', await txt('trusted partnerships'));
await tab('Contact'); console.log('CONTACT: content shown:', await txt('Speak with Girard'), '| footer still shown:', await shown('footer'));
await tab('Home');    console.log('HOME again: hero shown:', await heroShown());
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
