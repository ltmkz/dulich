const fs = require('fs');

const csvPath = 'E:/mohinhdulich/web/các chức năng mới/Danh_sach_Ma_QR.csv';
const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

async function scrapeMaps() {
  for (let i = 1; i <= 4; i++) { // First 4 are maps
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.match(/(?:\"([^\"]*)\"|([^,]+))/g).map(s => s.replace(/^"|"$/g, ''));
    if (parts.length < 3) continue;
    
    const name = parts[1];
    const link = parts[2];
    const hash = link.split('/').pop();
    
    const scanRes = await fetch(`https://icheckqr.com/api/p/e/scan/${hash}`);
    const scanData = await scanRes.json();
    
    let mapUrl = '';
    
    if (scanData.data.qrCodeType === 12) {
      mapUrl = scanData.data.url;
    } else if (scanData.data.qrCodeType === 43) {
      // It's a COMPANY map! We can't just show an image, but in our app we mapped it to 'map'.
      // If the original app shows an interactive map of sub-regions, maybe we can just show our interactive map without selectedAddress?
      // For now, let's just get whatever URL is available or print what it is.
      console.log(`${name} is type 43 (COMPANY). Company ID: ${scanData.data.objectId}`);
    }
    
    console.log(`${name}: ${mapUrl}`);
  }
}

scrapeMaps();
