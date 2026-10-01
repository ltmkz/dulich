const fs = require('fs');

const csvPath = 'E:/mohinhdulich/web/các chức năng mới/Danh_sach_Ma_QR.csv';
const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

const result = [];
result.push(`export const extractedQrData: Record<string, { type: 'map' | 'household', value: string, mapUrl?: string }> = {`);

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.match(/(?:\"([^\"]*)\"|([^,]+))/g).map(s => s.replace(/^"|"$/g, ''));
  if (parts.length < 3) continue;
  
  const name = parts[1];
  
  // Decide type
  let type = 'household';
  if (name.includes('Sơ đồ') || name === 'Thôn Lương Lễ - xã Khe Sanh' || name === 'Thôn 3A - Xã Khe Sanh') {
    type = 'map';
  }
  
  // Fake value just for TS typing if it's household, or the static URL if it's map
  let value = 'Số 1';
  if (type === 'map') {
    value = 'https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png'; // Fallback map img
  }
  
  result.push(`  "${name}": { type: "${type}", value: "${value}", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },`);
}

result.push(`};`);

fs.writeFileSync('e:/mohinhdulich/web/lib/regionData.ts', result.join('\n'));
console.log('Regenerated regionData.ts');
