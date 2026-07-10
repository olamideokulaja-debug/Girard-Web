import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1300,height:950}})).newPage();
await p.goto('http://localhost:5199/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
try{await p.getByText('Got it').first().click();}catch(e){}
await p.locator(':text-is("Browse our listings"):visible').first().click({timeout:3000}); await p.waitForTimeout(700);
const t=await p.locator('body').innerText();
console.log('on listings (Book viewing present):', t.includes('Book viewing'));
console.log('no "/yr" price on listings:', !/\/yr/.test(t));
console.log('no ₦ price figure on cards:', !/₦[0-9]/.test(t.split('Book viewing')[0].split('Browse our listings').pop()||t));
await b.close();
