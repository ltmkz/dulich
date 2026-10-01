const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const khuVucList = [
  "Sơ đồ địa giới - Thôn Lương Lễ",
  "Sơ đồ địa giới - Thôn 3A",
  "Thôn Lương Lễ - xã Khe Sanh",
  "Thôn 3A - Xã Khe Sanh",
  "Xóm Tà Đủ - Thôn Lương Lễ",
  "Xóm 5 - Thôn Lương Lễ",
  "Xóm 4 - Thôn Lương Lễ",
  "Xóm 3 - Thôn Lương Lễ",
  "Xóm 2 - Thôn Lương Lễ",
  "Xóm 1 - Thôn Lương Lễ",
  "Đường Trần Nguyên Hãn",
  "Đường Hồ Sỹ Thản",
  "Đường Nguyễn Văn Linh",
  "Ngõ 01 - Hà Huy Tập",
  "Đường Hà Huy Tập",
  "Ngõ 01 - Bùi Thị Xuân",
  "Đường Bùi Thị Xuân",
  "Ngõ 02 - Đường Ngô Sỹ Liên",
  "Ngõ 01 - Đường Ngô Sỹ Liên",
  "Đường Ngô Sỹ Liên",
  "Kiệt 35 - Đường Ngô Sỹ Liên",
  "Đường Hai Bà Trưng",
  "Đường Nguyễn Trãi",
  "Đường Trần Hữu Dực",
  "Đường Đặng Thai Mai",
  "Đường Lê Hành",
  "Đường Hùng Vương",
  "Ngõ 22 - Hùng Vương",
  "Ngõ 30 - Hùng Vương",
  "Đường Lê Duẩn",
  "Ngõ 171 Lê Duẩn"
];

const BASE_URL = "https://dulich-git-main-menhs-projects.vercel.app"; // Thay bằng URL thật
const outputDir = path.join(__dirname, 'public', 'qr-khuvuc');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateQRCodes() {
  console.log("Generating QR Codes...");
  for (const khuVuc of khuVucList) {
    const url = `${BASE_URL}/thon-thong-minh?khuVuc=${encodeURIComponent(khuVuc)}`;
    const safeFilename = khuVuc.replace(/[^a-zA-Z0-9]/g, '_') + ".png";
    const filePath = path.join(outputDir, safeFilename);

    await QRCode.toFile(filePath, url, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 400,
      margin: 2,
      color: {
        dark: "#002b80",
        light: "#ffffff",
      },
    });
    console.log(`✅ Generated: ${safeFilename}`);
  }
  console.log("Done!");
}

generateQRCodes();
