import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractedQrData } from "@/lib/regionData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const khuVuc = searchParams.get('khuVuc') || "Ngõ 171 Lê Duẩn";

    let households = await prisma.household.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (households.length === 0) {
      // Nếu chưa có, seed từ file
      const res = await fetch(new URL('/api/seed-households', request.url).toString(), { method: 'POST' });
      if (res.ok) {
        households = await prisma.household.findMany({
          orderBy: { createdAt: 'desc' }
        });
      }
    }

    return NextResponse.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    return NextResponse.json({ error: "Failed to fetch households" }, { status: 500 });
  }
}
