const fs = require('fs');

const scrapedData = JSON.parse(fs.readFileSync('scratch/scraped_data.json', 'utf-8'));

const tsContent = `export const extractedQrData: Record<string, { type: 'map' | 'household', value: string, mapUrl?: string, nhanKhau?: number, hoStatus?: string }> = {
  "Sơ đồ địa giới - Thôn Lương Lễ": { type: "map", value: "Thôn Lương Lễ", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
  "Sơ đồ địa giới - Thôn 3A": { type: "map", value: "Thôn 3A", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/1d20e283cb9f10e82c746a6042bc081c.png" },
  "Thôn Lương Lễ - xã Khe Sanh": { type: "map", value: "Thôn Lương Lễ", mapUrl: "https://qr-i.io/image/smart-village%20/smart-village-overview.png" },
  "Thôn 3A - Xã Khe Sanh": { type: "map", value: "Thôn 3A", mapUrl: "https://qr-i.io/image/smart-village%20/smart-village-overview.png" },
${Object.keys(scrapedData)
  .filter(key => !key.includes("Sơ đồ") && !key.includes("Khe Sanh"))
  .map(key => {
    const item = scrapedData[key];
    let hoStatus = item.hoStatus;
    if (hoStatus === "Cận nghèo") hoStatus = "Hộ cận nghèo";
    return `  "${key}": { type: "household", value: "${item.value}", nhanKhau: ${item.nhanKhau}, hoStatus: "${hoStatus}", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" }`;
  }).join(',\n')}
};
`;

fs.writeFileSync('lib/regionData.ts', tsContent);
console.log('Updated lib/regionData.ts');
