const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://qr-i.io/8c5ewtex', { waitUntil: 'networkidle2' });
  
  // Wait for some content to load
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('scratch/qr_page.html', html);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT EXTRACTED:");
  console.log(text);
  
  await browser.close();
})();
