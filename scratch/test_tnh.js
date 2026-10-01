const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://qr-i.io/8c5ewtex', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  try {
    const buttons = await page.$$('button');
    let clicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text && text.includes("Xem danh sách Hộ")) {
        await btn.click();
        await new Promise(r => setTimeout(r, 2000));
        clicked = true;
        break;
      }
    }
    
    if (!clicked) {
      // Maybe the list is already visible or it's a div?
      const divs = await page.$$('div');
      for (const div of divs) {
        const text = await page.evaluate(el => el.innerText, div);
        if (text === "Xem danh sách Hộ") {
          await div.click();
          await new Promise(r => setTimeout(r, 2000));
          break;
        }
      }
    }
    
    const text = await page.evaluate(() => document.body.innerText);
    console.log("TEXT EXTRACTED AFTER CLICK:");
    console.log(text);
  } catch (e) {
    console.log("Error:", e);
  }
  
  await browser.close();
})();
