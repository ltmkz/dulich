import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateQRCode } from "@/lib/qr";

// POST /api/points/[id]/qr - Sinh lại QR code
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;
    const baseUrl =
      process.env.NEXTAUTH_URL || `https://${req.headers.get("host")}`;

    const { qrCodePath, qrCodeUrl } = await generateQRCode(id, baseUrl);

    const point = await prisma.point.update({
      where: { id },
      data: { qrCodePath, qrCodeUrl },
    });

    return NextResponse.json({ qrCodePath: point.qrCodePath, qrCodeUrl: point.qrCodeUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
