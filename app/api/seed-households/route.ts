import { prisma } from "@/lib/prisma";
import { extractedQrData } from "@/lib/regionData";

export async function POST(request: Request) {
  try {
    // Xóa dữ liệu cũ nếu cần (hoặc chỉ tạo mới những hộ chưa có)
    await prisma.household.deleteMany({});
    
    const households = [];
    let idCounter = 1;
    
    for (const [key, info] of Object.entries(extractedQrData)) {
      if (info.type === 'household') {
        // key là địa chỉ (VD: "Đường Trần Nguyên Hãn", "Xóm 5 - Thôn Lương Lễ")
        // info.value là tên chủ hộ hoặc số nhà (VD: "Nguyễn Phong Phú", "Số 29")
        
        let khuVuc = "Thôn Lương Lễ";
        if (key.includes("Thôn 3A")) khuVuc = "Thôn 3A";
        else if (key.includes("Khe Sanh")) khuVuc = "Thôn Lương Lễ - xã Khe Sanh";
        
        households.push({
          id: `house-${idCounter++}`,
          headName: info.value,
          address: key,
          status: "Hộ bình thường",
          memberCount: Math.floor(Math.random() * 5) + 2,
          // random tọa độ xung quanh trung tâm Khe Sanh (16.62, 106.73)
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
