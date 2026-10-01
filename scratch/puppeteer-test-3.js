const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });
  
  console.log('Navigating to i25jt5hv...');
  await page.goto('https://qr-i.io/i25jt5hv', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));
  
  // Click "Xem danh sách Hộ" button (it's a button with text)
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, div');
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.includes('Xem danh sách Hộ')) {
        btn.click();
        break;
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot-5-list-opened.png' });
  
  // Now click on the first household item
  await page.evaluate(() => {
    const items = document.querySelectorAll('div, li');
    for (const item of items) {
      // Find item with "Hồ Chí Trung" or "Hộ bình thường"
      if (item.textContent && item.textContent.includes('Hồ Chí Trung')) {
        item.click();
        break;
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot-6-item-clicked.png' });
  
  await browser.close();
})();
