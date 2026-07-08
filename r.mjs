import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:900}})).newPage();
const log=[]; p.on('pageerror',e=>log.push(e.message));
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:3000});await p.waitForTimeout(400);}catch(e){}};
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
try{await p.getByText('Got it').first().click();}catch(e){}
// go to sign-in
await clickV('Sign in');
console.log('sign-in screen:', (await p.getByText('Welcome back',{exact:false}).count())>0);
console.log('Forgot password link present:', (await p.getByText('Forgot password?',{exact:false}).count())>0);
// click with no email -> should prompt for email
await p.getByText('Forgot password?',{exact:false}).first().click(); await p.waitForTimeout(400);
console.log('empty-email prompt shown:', (await p.getByText('Enter your email address first',{exact:false}).count())>0);
// enter email, click again -> demo message (no supabase locally)
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com');
await p.getByText('Forgot password?',{exact:false}).first().click(); await p.waitForTimeout(500);
console.log('demo/reset message shown:', (await p.getByText('Password reset works on the live site',{exact:false}).count())>0 || (await p.getByText('Reset link sent',{exact:false}).count())>0);
console.log('ERR:', log.length?log.join('|'):'none');
await b.close();
