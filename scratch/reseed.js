const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.household.deleteMany({});
  console.log("Deleted all households. Next page load will re-seed automatically.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
