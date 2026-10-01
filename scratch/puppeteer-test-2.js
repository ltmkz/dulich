const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });
  
  console.log('Navigating to i25jt5hv...');
  await page.goto('https://qr-i.io/i25jt5hv', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));
  
  // Click on the first marker with class custom-leaflet-icon or leaflet-marker-icon
  await page.evaluate(() => {
    const markers = document.querySelectorAll('.leaflet-marker-icon');
    if (markers.length > 0) {
      // Find the one that doesn't have a number in it, probably the individual household
      for (const marker of markers) {
        if (!marker.textContent || marker.textContent.trim() === '') {
          marker.click();
          break;
        }
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot-3-map-clicked.png' });
  console.log('Took map clicked screenshot');
  
  // Now click on the first item in the bottom list
  await page.evaluate(() => {
    const items = document.querySelectorAll('.list-item, [class*="item"]');
    if (items.length > 0) {
      for (const item of items) {
        if (item.textContent && item.textContent.includes('Hộ bình thường')) {
          item.click();
          break;
        }
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot-4-list-clicked.png' });
  console.log('Took list clicked screenshot');
  
  await browser.close();
})();
