const fs = require('fs');
const csvPath = 'E:/mohinhdulich/web/các chức năng mới/Danh_sach_Ma_QR.csv';
const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

const households = [];

async function scrape() {
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.match(/(?:\"([^\"]*)\"|([^,]+))/g).map(s => s.replace(/^"|"$/g, ''));
    if (parts.length < 3) continue;
    
    const name = parts[1];
    const link = parts[2];
    const hash = link.split('/').pop();
    
    console.log(`Processing ${name} (${hash})...`);
    
    try {
      const scanRes = await fetch(`https://icheckqr.com/api/p/e/scan/${hash}`);
      const scanData = await scanRes.json();
      
      if (scanData.data && scanData.data.qrCodeType === 41 && scanData.data.objectId) {
        const objectId = scanData.data.objectId;
        const mapRes = await fetch(`https://icheckqr.com/api/e/smart-village/map-markers?id=${objectId}&type=STORE`);
        const mapData = await mapRes.json();
        
        if (mapData.data && Array.isArray(mapData.data)) {
          let addressData = mapData.data[0];
          let personals = addressData.personals || [];
          
          console.log(`Found ${personals.length} households!`);
          
          for (const p of personals) {
            let memberCount = 0;
            if (p.descriptionData && p.descriptionData.length > 0) {
              const desc = p.descriptionData[0].description;
              const match = desc.match(/Số nhân khẩu:\s*(\d+)/);
              if (match) memberCount = parseInt(match[1]);
            }
            
            let status = 'Hộ bình thường';
            if (p.householdClassification === 'POOR') status = 'Hộ nghèo';
            else if (p.householdClassification === 'NEAR_POOR') status = 'Hộ cận nghèo';
            
            households.push({
              headName: p.name,
              address: name, // Use the name from CSV, e.g. 'Đường Hồ Sỹ Thản' or 'Thôn 3A - Xã Khe Sanh'
              status: status,
              memberCount: memberCount,
              latitude: p.latitude,
              longitude: p.longitude,
            });
          }
        }
      }
    } catch (e) {
      console.error(`Error on ${hash}:`, e.message);
    }
  }
  
  fs.writeFileSync('all-households.json', JSON.stringify(households, null, 2));
  console.log(`Scraped ${households.length} total households!`);
}

scrape();
