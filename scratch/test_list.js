const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://qr-i.io/0kkjc9ub', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Find and click the button containing "Xem danh sách Hộ"
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes("Xem danh sách Hộ")) {
        await btn.click();
        await new Promise(r => setTimeout(r, 2000));
        break;
      }
    }
    
    // Also try checking for links or divs if button is not found
    const html = await page.content();
    fs.writeFileSync('scratch/xom5_list.html', html);
    
    const text = await page.evaluate(() => document.body.innerText);
    console.log("TEXT EXTRACTED AFTER CLICK:");
    console.log(text);
  } catch (e) {
    console.log("Error:", e);
  }
  
  await browser.close();
})();
