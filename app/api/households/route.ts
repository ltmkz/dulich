import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const khuVuc = searchParams.get('khuVuc') || "Ngõ 171 Lê Duẩn";

    let households = await prisma.household.findMany({
      where: { address: khuVuc },
      orderBy: { createdAt: 'desc' }
    });

    if (households.length === 0) {
      // Tự động seed dữ liệu mẫu cho khu vực này nếu chưa có
      const mockHouseholds = [
        { headName: `Nguyễn Văn A (${khuVuc})`, status: "Hộ bình thường", address: khuVuc, memberCount: 4, latitude: 50, longitude: 35 },
        { headName: `Trần Thị B (${khuVuc})`, status: "Hộ cận nghèo", address: khuVuc, memberCount: 5, latitude: 30, longitude: 42 },
        { headName: `Lê Văn C (${khuVuc})`, status: "Hộ bình thường", address: khuVuc, memberCount: 2, latitude: 25, longitude: 52 },
        { headName: `Phạm Thị D (${khuVuc})`, status: "Hộ nghèo", address: khuVuc, memberCount: 4, latitude: 60, longitude: 65 },
        { headName: `Hoàng Văn E (${khuVuc})`, status: "Chưa phân loại", address: khuVuc, memberCount: 3, latitude: 45, longitude: 55 },
      ];

      await prisma.household.createMany({
        data: mockHouseholds
      });
      
      households = await prisma.household.findMany({
        where: { address: khuVuc },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    return NextResponse.json({ error: "Failed to fetch households" }, { status: 500 });
  }
}
