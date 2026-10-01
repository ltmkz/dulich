const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const households = JSON.parse(fs.readFileSync('e:/mohinhdulich/web/scratch/all-households.json', 'utf8'));

(async () => {
  console.log('Clearing old households...');
  await prisma.household.deleteMany({});
  
  // Fill missing coords
  const safeHouseholds = households.map(h => ({
    ...h,
    latitude: h.latitude || 16.63,
    longitude: h.longitude || 106.73
  }));
  
  console.log(`Seeding ${safeHouseholds.length} exact households from API...`);
  await prisma.household.createMany({
    data: safeHouseholds
  });
  console.log('✅ Successfully seeded exact households!');
})();
