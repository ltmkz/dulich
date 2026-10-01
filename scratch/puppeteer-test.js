const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 }); // Mobile view
  
  console.log('Navigating to i25jt5hv...');
  await page.goto('https://qr-i.io/i25jt5hv', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: 'screenshot-1-loaded.png' });
  console.log('Took screenshot 1');
  
  // Try to find a household in the list and click it
  // Usually it's in a list at the bottom.
  // We can just dump HTML to see the structure if we can't guess the selector.
  const html1 = await page.content();
  fs.writeFileSync('i25jt5hv-list.html', html1);
  
  // Click on the first household (assumed it's an element containing "Hộ bình thường" or a specific class)
  const listItems = await page.$$('.item-list, .household-item, li, [class*="item"]');
  if (listItems.length > 0) {
    // Let's just evaluate and click the first element that looks like a household list item
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div, li')).filter(el => el.textContent.includes('Hộ bình thường') || el.textContent.includes('Hồ Chí Trung'));
      if (items.length > 0) {
        items[0].click();
      }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'screenshot-2-clicked.png' });
    console.log('Took screenshot 2');
    
    const html2 = await page.content();
    fs.writeFileSync('i25jt5hv-clicked.html', html2);
  }
  
  await browser.close();
})();
