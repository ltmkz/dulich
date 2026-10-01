const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const csvText = fs.readFileSync('các chức năng mới/Danh_sach_Ma_QR.csv', 'utf-8');
  const lines = csvText.split('\n').filter(l => l.trim() !== '');
  // Skip header
  lines.shift();
  
  const browser = await puppeteer.launch({ headless: 'new' });
  
  const results = {};
  
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < 3) continue;
    
    // Remove quotes
    const nameStr = parts[1].replace(/^"|"$/g, '');
    const urlStr = parts[2].replace(/^"|"$/g, '');
    
    console.log(`Scraping ${nameStr} (${urlStr})...`);
    const page = await browser.newPage();
    
    try {
      await page.goto(urlStr, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000)); // Wait a bit for JS to render
      
      const text = await page.evaluate(() => document.body.innerText);
      
      // Extract data
      let chuNha = "Số 1";
      let nhanKhau = 1;
      let hoStatus = "Hộ bình thường";
      let khuVuc = nameStr;
      
      const lines = text.split('\n').map(t => t.trim()).filter(t => t);
      for (const t of lines) {
        if (t.startsWith("Chủ nhà: ")) chuNha = t.substring(9).trim();
        else if (t.startsWith("Nhân Khẩu: ")) nhanKhau = parseInt(t.substring(11).trim()) || 1;
        else if (t.startsWith("Hộ: ")) hoStatus = t.substring(4).trim();
        else if (t.startsWith("Khu vực: ")) khuVuc = t.substring(9).trim();
      }
      
      let type = "household";
      if (nameStr.includes("Sơ đồ") || nameStr.includes("Thôn Lương Lễ - xã Khe Sanh") || nameStr.includes("Thôn 3A - Xã Khe Sanh")) {
        type = "map";
      }
      
      results[nameStr] = {
        type: type,
        value: chuNha,
        nhanKhau: nhanKhau,
        hoStatus: hoStatus,
        khuVuc: khuVuc,
        mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png"
      };
      
      console.log(`--> ${chuNha} - ${nhanKhau} - ${hoStatus}`);
    } catch (e) {
      console.log(`Error scraping ${urlStr}: ${e.message}`);
      // fallback
      results[nameStr] = { type: "household", value: "Số 1", nhanKhau: 1, hoStatus: "Hộ bình thường", khuVuc: nameStr };
    }
    
    await page.close();
  }
  
  await browser.close();
  
  fs.writeFileSync('scratch/scraped_data.json', JSON.stringify(results, null, 2));
  console.log("DONE!");
})();
