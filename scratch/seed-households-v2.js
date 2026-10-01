const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

const extractedQrData = require('../lib/regionData').extractedQrData;

(async () => {
  console.log('Clearing old households...');
  await prisma.household.deleteMany({});
  
  const households = [];
  
  // Specific data for "Đường Hồ Sỹ Thản"
  const specificAddress = "Đường Hồ Sỹ Thản";
  // We need exactly 49 households: 40 bình thường, 6 cận nghèo, 3 nghèo, 0 chưa phân loại
  
  // The named ones (all "Hộ bình thường")
  const namedHouseholds = [
    { headName: "Hoàng Văn Khánh (HST)", status: "Hộ bình thường", memberCount: 4, address: specificAddress, latitude: 16.634, longitude: 106.721 },
    { headName: "Đinh Thị Thao", status: "Hộ bình thường", memberCount: 3, address: specificAddress, latitude: 16.6342, longitude: 106.7211 },
    { headName: "Hoàng Xuân Đại", status: "Hộ bình thường", memberCount: 5, address: specificAddress, latitude: 16.6338, longitude: 106.7208 },
    { headName: "Trần Thị Hằng", status: "Hộ bình thường", memberCount: 2, address: specificAddress, latitude: 16.6339, longitude: 106.7215 },
    { headName: "Hồ Chí Trung", status: "Hộ bình thường", memberCount: 4, address: specificAddress, latitude: 16.6341, longitude: 106.7213 },
  ];
  
  households.push(...namedHouseholds);
  
  // Fill the rest for "Đường Hồ Sỹ Thản"
  for (let i = 0; i < 49 - 5; i++) {
    let status = "Hộ bình thường";
    if (i < 6) status = "Hộ cận nghèo";
    else if (i < 6 + 3) status = "Hộ nghèo";
    
    households.push({
      headName: `Người Dân ${i+6} (HST)`,
      address: specificAddress,
      status: status,
      memberCount: Math.floor(Math.random() * 5) + 2,
      latitude: 16.63 + (Math.random() * 0.02 - 0.01),
      longitude: 106.72 + (Math.random() * 0.02 - 0.01),
    });
  }

  // Generate random for other roads
  for (const [key, info] of Object.entries(extractedQrData)) {
    if (info.type === 'household' && key !== specificAddress) {
      const num = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < num; j++) {
        households.push({
          headName: `${info.value} - ${j+1}`,
          address: key,
          status: "Hộ bình thường",
          memberCount: Math.floor(Math.random() * 5) + 2,
          latitude: 16.63 + (Math.random() * 0.02 - 0.01),
          longitude: 106.72 + (Math.random() * 0.02 - 0.01),
        });
      }
    }
  }

  console.log(`Seeding ${households.length} households...`);
  await prisma.household.createMany({
    data: households
  });
  console.log(`Seeded!`);
})();
