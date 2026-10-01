import { prisma } from "@/lib/prisma";
import { extractedQrData } from "@/lib/regionData";

export async function POST(request: Request) {
  try {
    // Xóa dữ liệu cũ nếu cần (hoặc chỉ tạo mới những hộ chưa có)
    await prisma.household.deleteMany({});
    
    const households = [];
    let idCounter = 1;
    
    const thon3ARoads: string[] = [];
    const thonLuongLeRoads: string[] = [];

    for (const [key, info] of Object.entries(extractedQrData)) {
      if (info.type === 'household') {
        if (key.includes("Thôn Lương Lễ")) {
          thonLuongLeRoads.push(key);
        } else {
          thon3ARoads.push(key);
        }
      }
    }

    // Seed Thôn Lương Lễ (keep minimal as mockup shows 0 or unclassified, but we'll leave it empty to match "0" if needed, 
    // wait, the mockup says "0 - Chưa có dữ liệu phân loại", so let's skip seeding Lương Lễ to match exactly!)
    // Actually, I'll just seed 0 for Thôn Lương Lễ.
    
    // Seed exactly 613 households for Thôn 3A
    const thon3AStats = {
      "Hộ bình thường": 571,
      "Hộ cận nghèo": 30,
      "Hộ nghèo": 12
    };

    for (const [status, count] of Object.entries(thon3AStats)) {
      for (let i = 0; i < count; i++) {
        // Randomly pick a road in Thôn 3A
        const road = thon3ARoads[Math.floor(Math.random() * thon3ARoads.length)] || "Thôn 3A";
        households.push({
          id: `house-${idCounter++}`,
          headName: `Chủ hộ ${idCounter}`,
          address: road,
          status: status,
          memberCount: Math.floor(Math.random() * 5) + 2,
          // Random coordinates around Khe Sanh center
          latitude: 16.62 + (Math.random() * 0.02 - 0.01),
          longitude: 106.73 + (Math.random() * 0.02 - 0.01),
        });
      }
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
