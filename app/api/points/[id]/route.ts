import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z
    .enum([
      "HISTORICAL_SITE",
      "RED_ADDRESS",
      "TOURIST_SPOT",
      "COMMUNITY_CENTER",
      "CULTURAL_HERITAGE",
    ])
    .optional(),
  address: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.string()).optional(),
  routeId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/points/[id] - Chi tiết điểm (public, tăng visitCount)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const point = await prisma.point.findUnique({
      where: { id, isActive: true },
      include: {
        route: {
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
              },
            },
          },
        },
        createdBy: { select: { name: true } },
      },
    });

    if (!point) {
      return NextResponse.json({ error: "Không tìm thấy điểm" }, { status: 404 });
    }

    // Tăng lượt xem (không await để không làm chậm response)
    prisma.point.update({ where: { id }, data: { visitCount: { increment: 1 } } }).catch(() => {});

    return NextResponse.json({
      ...point,
      images: JSON.parse(point.images || "[]"),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/points/[id] - Cập nhật điểm
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = UpdateSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }

    const point = await prisma.point.update({
      where: { id },
      data: updateData,
      include: {
        route: { select: { id: true, name: true, color: true } },
        createdBy: { select: { name: true } },
      },
    });

    return NextResponse.json({
      ...point,
      images: JSON.parse(point.images || "[]"),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/points/[id] - Xóa mềm điểm
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.point.update({ where: { id }, data: { isActive: false } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
