import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const RouteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default("#FF6B35"),
});

// GET /api/routes
export async function GET() {
  try {
    const routes = await prisma.touristRoute.findMany({
      where: { isActive: true },
      include: {
        points: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
            category: true,
            images: true,
            visitCount: true,
          },
        },
        _count: { select: { points: { where: { isActive: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(routes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/routes
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const data = RouteSchema.parse(body);

    const route = await prisma.touristRoute.create({ data });
    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
