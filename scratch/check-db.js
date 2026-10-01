const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const h = await prisma.household.findMany();
  console.log("Households count:", h.length);
  if (h.length > 0) {
    console.log("Sample:", h[0].headName);
  } else {
    console.log("Empty!");
  }
})();
