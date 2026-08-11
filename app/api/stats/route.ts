import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats - Dashboard thống kê
export async function GET(_req: NextRequest) {
  try {
    const [totalPoints, totalRoutes, totalVisits, topPoints] = await Promise.all([
      prisma.point.count({ where: { isActive: true } }),
      prisma.touristRoute.count({ where: { isActive: true } }),
      prisma.point.aggregate({ _sum: { visitCount: true }, where: { isActive: true } }),
      prisma.point.findMany({
        where: { isActive: true },
        orderBy: { visitCount: "desc" },
        take: 5,
        select: { id: true, name: true, visitCount: true, category: true },
      }),
    ]);

    const categoryStats = await prisma.point.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: true,
    });

    return NextResponse.json({
      totalPoints,
      totalRoutes,
      totalVisits: totalVisits._sum.visitCount || 0,
      topPoints,
      categoryStats,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
