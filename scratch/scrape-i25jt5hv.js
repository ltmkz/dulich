const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to i25jt5hv...');
  await page.goto('https://qr-i.io/i25jt5hv', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 5000));
  
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('i25jt5hv.txt', text);
  
  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('i25jt5hv_full.html', html);
  
  console.log('Saved to i25jt5hv.txt and _full.html');
  
  await browser.close();
})();
