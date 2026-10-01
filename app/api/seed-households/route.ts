import { prisma } from "@/lib/prisma";
import allHouseholds from "@/lib/all-households.json";

export async function POST(request: Request) {
  try {
    // Xóa dữ liệu cũ nếu cần
    await prisma.household.deleteMany({});
    
    const households = [];
    let idCounter = 1;
    
    for (const item of allHouseholds) {
      households.push({
        id: `house-${idCounter++}`,
        headName: item.headName,
        address: item.address,
        status: item.status,
        memberCount: item.memberCount,
        // Random coordinates around Khe Sanh center
        latitude: 16.62 + (Math.random() * 0.02 - 0.01),
        longitude: 106.73 + (Math.random() * 0.02 - 0.01),
      });
    }

    await prisma.household.createMany({
      data: households
    });

    return new Response(JSON.stringify({ success: true, count: households.length }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
