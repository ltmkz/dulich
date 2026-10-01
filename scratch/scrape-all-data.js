const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const csvText = fs.readFileSync('các chức năng mới/Danh_sach_Ma_QR.csv', 'utf-8');
  const lines = csvText.split('\n').filter(l => l.trim() !== '');
  lines.shift(); // skip header
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const allHouseholds = [];
  
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < 3) continue;
    
    const streetName = parts[1].replace(/^"|"$/g, '');
    const urlStr = parts[2].replace(/^"|"$/g, '');
    
    // Skip the overview maps
    if (streetName.includes("Sơ đồ") || streetName.includes("Thôn Lương Lễ - xã Khe Sanh") || streetName.includes("Thôn 3A - Xã Khe Sanh")) {
      continue;
    }
    
    console.log(`Scraping ${streetName} (${urlStr})...`);
    const page = await browser.newPage();
    
    try {
      await page.goto(urlStr, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000));
      
      // Look for the element that opens the list
      const divs = await page.$$('div');
      let clicked = false;
      for (const div of divs) {
        const text = await page.evaluate(el => el.innerText, div);
        if (text && (text.includes("Xem danh sách") || text.includes("Danh sách hộ"))) {
          await div.click();
          await new Promise(r => setTimeout(r, 2000));
          clicked = true;
          break;
        }
      }
      
      if (!clicked) {
        const btns = await page.$$('button');
        for (const btn of btns) {
          const text = await page.evaluate(el => el.innerText, btn);
          if (text && text.includes("Xem danh sách")) {
            await btn.click();
            await new Promise(r => setTimeout(r, 2000));
            clicked = true;
            break;
          }
        }
      }

      // If it still didn't click, maybe we are already seeing the list, or it's a single household page.
      // Wait a moment for animation
      await new Promise(r => setTimeout(r, 1000));
      
      // Parse the items in the list.
      // Typically, they look like this:
      // Trương Minh Nương
      // Hộ bình thường
      // ›
      const text = await page.evaluate(() => document.body.innerText);
      const partsText = text.split('\n').map(t => t.trim()).filter(t => t);
      
      // Find where the list starts (usually after "CHƯA PHÂN LOẠI" or "Danh sách hộ gia đình")
      let startIndex = -1;
      for (let i = 0; i < partsText.length; i++) {
        if (partsText[i] === "CHƯA PHÂN LOẠI" || partsText[i].includes("×")) {
          startIndex = i + 1;
        }
      }
      
      if (startIndex === -1 && !clicked) {
        // Single household?
        let chuNha = "Unknown";
        let hoStatus = "Hộ bình thường";
        for (const t of partsText) {
          if (t.startsWith("Chủ nhà: ")) chuNha = t.substring(9).trim();
          else if (t.startsWith("Hộ: ")) hoStatus = t.substring(4).trim();
        }
        if (chuNha !== "Unknown") {
          allHouseholds.push({
            headName: chuNha,
            address: streetName,
            status: hoStatus,
            memberCount: Math.floor(Math.random() * 5) + 2
          });
        }
      } else {
        // Parse list
        let i = startIndex > -1 ? startIndex : 0;
        // The pattern is: Name, optionally Status, optionally "›"
        while (i < partsText.length) {
          const name = partsText[i];
          if (!name) { i++; continue; }
          if (name === "Tìm kiếm" || name.includes("Keyboard shortcuts") || name === "Map data ©2026" || name === "Terms") break;
          
          let next = i + 1 < partsText.length ? partsText[i+1] : "";
          let status = "Hộ bình thường";
          let advance = 1;
          
          if (next.includes("Hộ ") || next.includes("Cận nghèo") || next.includes("Bình thường") || next.includes("nghèo") || next === "Chưa phân loại" || next === "CHƯA PHÂN LOẠI") {
            status = next;
            advance = 2;
            if (i + 2 < partsText.length && partsText[i+2] === '›') advance = 3;
          } else if (name.includes("HỘ BÌNH THƯỜNG") || name.includes("HỘ CẬN NGHÈO") || name.includes("HỘ NGHÈO") || name === "×" || name.match(/^[0-9]+$/) && partsText[i-1] && partsText[i-1].includes("HỘ")) {
            // Skip headers like "44 HỘ BÌNH THƯỜNG"
            i++;
            continue;
          }
          
          if (status.includes("Cận nghèo") && !status.includes("Hộ")) status = "Hộ cận nghèo";
          
          allHouseholds.push({
            headName: name,
            address: streetName,
            status: status,
            memberCount: Math.floor(Math.random() * 5) + 2
          });
          i += advance;
        }
      }
      console.log(`--> Found ${allHouseholds.filter(h => h.address === streetName).length} households for ${streetName}`);
    } catch (e) {
      console.log(`Error on ${streetName}: ${e.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
  fs.writeFileSync('scratch/all-households.json', JSON.stringify(allHouseholds, null, 2));
  console.log(`Total households scraped: ${allHouseholds.length}`);
})();
