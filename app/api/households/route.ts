import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const mockHouseholds = [
  { headName: "Hồ Thị Thu Hương", status: "Hộ bình thường", address: "Ngõ 171 Lê Duẩn", memberCount: 4, latitude: 50, longitude: 35 },
  { headName: "Hoàng Minh Hải", status: "Hộ bình thường", address: "Ngõ 171 Lê Duẩn", memberCount: 5, latitude: 30, longitude: 42 },
  { headName: "Hoàng Thị Kim Yến", status: "Hộ bình thường", address: "Ngõ 171 Lê Duẩn", memberCount: 2, latitude: 25, longitude: 52 },
  { headName: "Phan Như Ý", status: "Hộ bình thường", address: "Ngõ 171 Lê Duẩn", memberCount: 4, latitude: 60, longitude: 65 },
  { headName: "Phan Thị Lệ Ninh", status: "Hộ nghèo", address: "Ngõ 171 Lê Duẩn", memberCount: 3, latitude: 45, longitude: 55 },
  { headName: "Hồ Thị Don", status: "Hộ bình thường", address: "Ngõ 171 Lê Duẩn", memberCount: 2, latitude: 40, longitude: 25 },
];

export async function GET() {
  try {
    let households = await prisma.household.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (households.length === 0) {
      // Tự động seed dữ liệu mẫu nếu chưa có
      await prisma.household.createMany({
        data: mockHouseholds
      });
      households = await prisma.household.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    return NextResponse.json({ error: "Failed to fetch households" }, { status: 500 });
  }
}
