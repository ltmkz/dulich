const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

(async () => {
  const extractedQrData = {
    "Sơ đồ địa giới - Thôn Lương Lễ": { type: "map", value: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Sơ đồ địa giới - Thôn 3A": { type: "map", value: "https://assets.icheck.vn/image/2026/app/8/25/1d20e283cb9f10e82c746a6042bc081c.png" },
    "Thôn Lương Lễ - xã Khe Sanh": { type: "map", value: "https://qr-i.io/image/smart-village%20/smart-village-overview.png" },
    "Thôn 3A - Xã Khe Sanh": { type: "map", value: "https://qr-i.io/image/smart-village%20/smart-village-overview.png" },
    "Xóm 5 - Thôn Lương Lễ": { type: "household", value: "Số 29", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Xóm 4 - Thôn Lương Lễ": { type: "household", value: "Số 12", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Xóm 3 - Thôn Lương Lễ": { type: "household", value: "Số 70", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Xóm 2 - Thôn Lương Lễ": { type: "household", value: "Số 5", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Xóm 1 - Thôn Lương Lễ": { type: "household", value: "Số 13", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Trần Nguyên Hãn": { type: "household", value: "Nguyễn Phong Phú", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Hồ Sỹ Thản": { type: "household", value: "Số 9", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Nguyễn Văn Linh": { type: "household", value: "Phan Văn Quynh (NVL)", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 01 - Hà Huy Tập": { type: "household", value: "Số 2", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Hà Huy Tập": { type: "household", value: "Số 28", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 01 - Bùi Thị Xuân": { type: "household", value: "Số 3", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Bùi Thị Xuân": { type: "household", value: "Số 6", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 02 - Đường Ngô Sỹ Liên": { type: "household", value: "Phùng Thạch Hàn Ngân", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 01 - Đường Ngô Sỹ Liên": { type: "household", value: "Nguyễn Thái Linh", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Ngô Sỹ Liên": { type: "household", value: "Số 22", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Kiệt 35 - Đường Ngô Sỹ Liên": { type: "household", value: "Số 9", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Hai Bà Trưng": { type: "household", value: "Hoàng Thị Hằng (LD)", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Nguyễn Trãi": { type: "household", value: "Phan Anh Niêm", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Trần Hữu Dực": { type: "household", value: "Số 40", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Đặng Thai Mai": { type: "household", value: "Nguyễn Thị Hạnh", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Lê Hành": { type: "household", value: "Số 39", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Hùng Vương": { type: "household", value: "Số 12", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 22 - Hùng Vương": { type: "household", value: "Đoàn Quang Bào", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 30 - Hùng Vương": { type: "household", value: "Số 2", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Đường Lê Duẩn": { type: "household", value: "Số 14", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" },
    "Ngõ 171 Lê Duẩn": { type: "household", value: "Số 2", mapUrl: "https://assets.icheck.vn/image/2026/app/8/25/9de5f5b0f37a69ffcbc4c88918687809.png" }
  };

  await prisma.household.deleteMany({});
  
  const households = [];
  
  for (const [key, info] of Object.entries(extractedQrData)) {
    if (info.type === 'household') {
      households.push({
        headName: info.value,
        address: key,
        status: "Hộ bình thường",
        memberCount: Math.floor(Math.random() * 5) + 2,
        latitude: 50 + (Math.random() * 40 - 20),
        longitude: 50 + (Math.random() * 40 - 20),
      });
    }
  }

  await prisma.household.createMany({
    data: households
  });
  console.log(`Seeded ${households.length} households!`);
})();
