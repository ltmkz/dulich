const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  await prisma.household.deleteMany({});
  
  const data = JSON.parse(fs.readFileSync('scratch/all-households.json', 'utf-8'));
  
  let idCounter = 1;
  const households = data.map(item => ({
    id: `house-${idCounter++}`,
    headName: item.headName,
    address: item.address,
    status: item.status,
    memberCount: item.memberCount,
    latitude: 16.62 + (Math.random() * 0.02 - 0.01),
    longitude: 106.73 + (Math.random() * 0.02 - 0.01),
  }));
  
  await prisma.household.createMany({
    data: households
  });
  
  console.log(`Seeded ${households.length} true households without padding!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
