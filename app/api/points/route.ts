import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateQRCode } from "@/lib/qr";
import { z } from "zod";

const PointSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  category: z.enum([
    "HISTORICAL_SITE",
    "RED_ADDRESS",
    "TOURIST_SPOT",
    "COMMUNITY_CENTER",
    "CULTURAL_HERITAGE",
  ]),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  latitude: z.number(),
  longitude: z.number(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string().url()).default([]),
  routeId: z.string().optional().nullable(),
});

// GET /api/points - Lấy danh sách điểm
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { isActive: true };
    if (routeId) where.routeId = routeId;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const points = await prisma.point.findMany({
      where,
      include: {
        route: { select: { id: true, name: true, color: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(points);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/points - Tạo điểm mới
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const data = PointSchema.parse(body);

    const baseUrl =
      process.env.NEXTAUTH_URL || `https://${req.headers.get("host")}`;

    const point = await prisma.point.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
        videos: JSON.stringify(data.videos),
        createdById: session.user.id,
      },
    });

    // Tự động sinh QR code
    const { qrCodePath, qrCodeUrl } = await generateQRCode(point.id, baseUrl);
    const updated = await prisma.point.update({
      where: { id: point.id },
      data: { qrCodePath, qrCodeUrl },
      include: {
        route: { select: { id: true, name: true, color: true } },
        createdBy: { select: { name: true } },
      },
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
