const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://qr-i.io/0kkjc9ub', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.content();
  fs.writeFileSync('scratch/xom5.html', html);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT EXTRACTED:");
  console.log(text);
  
  await browser.close();
})();
