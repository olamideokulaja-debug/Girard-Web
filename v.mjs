import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
const clickV=async(t)=>{ try{await p.locator(`:text-is("${t}"):visible`).first().click({timeout:2500});await p.waitForTimeout(350);}catch(e){} };
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await clickV('Get started'); await clickV('Owner / Landlord');
try{ await p.getByRole('button',{name:/I accept the Terms/}).click({timeout:3000}); await p.waitForTimeout(400);}catch(e){}
await p.locator('input[type=email]').first().fill('olamideokulaja@girardpropertylimited.com'); await p.locator('input[type=password]').first().fill('test1234');
await clickV('Create account'); await p.waitForTimeout(1500);
const t=await p.locator('main').innerText();
console.log('LIVE KEYS -> testing tool disabled:', t.includes('you are on live keys'));
console.log('LIVE KEYS -> no pay button:', !t.includes('Create test landlord'));
await b.close();
