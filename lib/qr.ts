import QRCode from "qrcode";

export async function generateQRCode(
  pointId: string,
  baseUrl: string
): Promise<{ qrCodePath: string; qrCodeUrl: string }> {
  const targetUrl = `${baseUrl}/p/${pointId}`;

  // Generate Base64 Data URI instead of saving to disk (fixes Vercel read-only issue)
  const qrCodeDataUri = await QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: 400,
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });

  return {
    qrCodePath: qrCodeDataUri,
    qrCodeUrl: targetUrl,
  };
}
