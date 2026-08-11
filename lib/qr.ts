import QRCode from "qrcode";
import path from "path";
import fs from "fs";

export async function generateQRCode(
  pointId: string,
  baseUrl: string
): Promise<{ qrCodePath: string; qrCodeUrl: string }> {
  const qrDir = path.join(process.cwd(), "public", "qr");
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  const targetUrl = `${baseUrl}/p/${pointId}`;
  const fileName = `qr-${pointId}.png`;
  const filePath = path.join(qrDir, fileName);

  await QRCode.toFile(filePath, targetUrl, {
    errorCorrectionLevel: "H",
    type: "png",
    width: 400,
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });

  return {
    qrCodePath: `/qr/${fileName}`,
    qrCodeUrl: targetUrl,
  };
}
