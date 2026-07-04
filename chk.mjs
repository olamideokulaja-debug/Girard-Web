import { chromium } from 'playwright';
const b = await chromium.launch(); const c = await b.newContext({viewport:{width:1280,height:1000}}); const p = await c.newPage();
const log=[]; p.on('pageerror',e=>log.push('ERR:'+e.message)); const has=async t=>(await p.getByText(t,{exact:false}).count())>0;
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
await p.getByText('Get started',{exact:false}).first().click(); await p.waitForTimeout(300);
await p.getByText('Platform Admin',{exact:false}).first().click(); await p.waitForTimeout(300);
await p.fill('input[type=email]','admin_rm@girardproperty.com'); await p.fill('input[type=password]','test1234');
await p.getByText('Create account',{exact:false}).first().click(); await p.waitForTimeout(1100);
await p.getByText('Rent reminders',{exact:false}).first().click(); await p.waitForTimeout(600);
console.log('reminders load:', await has('Active tenancies'), await has('Sent'));
// send one
const sendBtn = p.getByText('Send now',{exact:false}).first();
if (await sendBtn.count()) { await sendBtn.click(); await p.waitForTimeout(600); }
console.log('after send, no crash:', await has('Rent reminders'), '| ERR:', log.length?log.join('|'):'none');
await b.close();
