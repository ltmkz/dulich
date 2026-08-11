/**
 * Script để sinh QR code cho tất cả điểm chưa có QR
 * Chạy: node prisma/generate-qr.js
 */
const { PrismaClient } = require("@prisma/client");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function generateQR(pointId) {
  const qrDir = path.join(process.cwd(), "public", "qr");
  if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

  const targetUrl = `${BASE_URL}/p/${pointId}`;
  const fileName = `qr-${pointId}.png`;
  const filePath = path.join(qrDir, fileName);

  await QRCode.toFile(filePath, targetUrl, {
    errorCorrectionLevel: "H",
    type: "png",
    width: 400,
    margin: 2,
    color: { dark: "#1a1a2e", light: "#ffffff" },
  });

  return { qrCodePath: `/qr/${fileName}`, qrCodeUrl: targetUrl };
}

async function main() {
  const points = await prisma.point.findMany({
    where: { qrCodePath: null, isActive: true },
  });

  console.log(`🔍 Found ${points.length} points without QR codes`);

  for (const point of points) {
    const { qrCodePath, qrCodeUrl } = await generateQR(point.id);
    await prisma.point.update({
      where: { id: point.id },
      data: { qrCodePath, qrCodeUrl },
    });
    console.log(`✅ QR generated for: ${point.name}`);
  }

  console.log("🎉 All QR codes generated!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
