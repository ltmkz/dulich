import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const khuVuc = searchParams.get('khuVuc');
    
    let whereClause = {};
    if (khuVuc && khuVuc !== 'all') {
      whereClause = { address: { contains: khuVuc } };
    }

    let households = await prisma.household.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (households.length === 0) {
      const res = await fetch(new URL('/api/seed-households', request.url).toString(), { method: 'POST' });
      if (res.ok) {
        households = await prisma.household.findMany({
          where: whereClause,
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newHousehold = await prisma.household.create({
      data: {
        headName: data.headName,
        address: data.address,
        memberCount: data.memberCount || 1,
        status: data.status || "Hộ bình thường",
        latitude: data.latitude || (50 + (Math.random() * 40 - 20)),
        longitude: data.longitude || (50 + (Math.random() * 40 - 20)),
      }
    });

    return NextResponse.json(newHousehold);
  } catch (error) {
    console.error("Error creating household:", error);
    return NextResponse.json({ error: "Failed to create household" }, { status: 500 });
  }
}
