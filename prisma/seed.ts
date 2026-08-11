import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Tạo admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ditich.vn" },
    update: {},
    create: {
      email: "admin@ditich.vn",
      password: hashedPassword,
      name: "Quản Trị Viên",
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin:", admin.email);

  // Tạo editor
  const editorPass = await bcrypt.hash("editor123", 10);
  const editor = await prisma.user.upsert({
    where: { email: "editor@ditich.vn" },
    update: {},
    create: {
      email: "editor@ditich.vn",
      password: editorPass,
      name: "Đội Thanh Niên",
      role: "EDITOR",
    },
  });
  console.log("✅ Created editor:", editor.email);

  // Tạo tuyến đường mẫu
  const route1 = await prisma.touristRoute.create({
    data: {
      name: "Tuyến Di Tích Lịch Sử",
      description: "Tuyến tham quan các di tích lịch sử và địa chỉ đỏ trong vùng",
      color: "#e94560",
    },
  });

  const route2 = await prisma.touristRoute.create({
    data: {
      name: "Tuyến Du Lịch Sinh Thái",
      description: "Khám phá vẻ đẹp thiên nhiên và văn hóa địa phương",
      color: "#27ae60",
    },
  });
  console.log("✅ Created routes");

  // Tạo điểm di tích mẫu
  const points = [
    {
      name: "Đình Làng Thạch Thất",
      description: "Đình làng Thạch Thất là một công trình kiến trúc cổ kính, được xây dựng từ thế kỷ XVII. Đây là nơi thờ phụng thành hoàng làng và là trung tâm sinh hoạt văn hóa của cộng đồng địa phương. Đình có kiến trúc truyền thống với mái ngói đỏ, cột gỗ và các họa tiết điêu khắc tinh xảo.",
      category: "HISTORICAL_SITE",
      address: "Thôn Thạch Thất, xã Đại Thành, huyện Quốc Oai, Hà Nội",
      latitude: 20.9878,
      longitude: 105.6234,
      routeId: route1.id,
    },
    {
      name: "Địa Chỉ Đỏ - Nhà Lưu Niệm",
      description: "Đây là nơi ghi dấu các sự kiện lịch sử quan trọng trong công cuộc kháng chiến bảo vệ Tổ quốc. Nhà lưu niệm lưu giữ nhiều hiện vật, tài liệu, hình ảnh quý giá về các anh hùng liệt sĩ đã chiến đấu và hy sinh vì độc lập dân tộc.",
      category: "RED_ADDRESS",
      address: "Số 15, đường Kháng Chiến, thị trấn Quốc Oai, Hà Nội",
      latitude: 20.9645,
      longitude: 105.6412,
      routeId: route1.id,
    },
    {
      name: "Chùa Thầy - Hương Sơn",
      description: "Chùa Thầy là một ngôi chùa cổ có lịch sử hơn 1000 năm, được xây dựng trên sườn núi Sài. Đây là một trong những danh lam thắng cảnh nổi tiếng của Hà Nội với cảnh sắc thiên nhiên hùng vĩ, hồ nước trong xanh và kiến trúc chùa chiền uy nghiêm.",
      category: "CULTURAL_HERITAGE",
      address: "Xã Sài Sơn, huyện Quốc Oai, Hà Nội",
      latitude: 20.9456,
      longitude: 105.6123,
      routeId: route2.id,
    },
    {
      name: "Điểm Du Lịch Hồ Quan Sơn",
      description: "Hồ Quan Sơn là một trong những hồ đẹp nhất vùng đồng bằng Bắc Bộ với diện tích mặt nước rộng lớn, bao quanh bởi núi đồi xanh tươi. Nơi đây còn được gọi là 'Hạ Long trên cạn' với nhiều hòn đảo nhỏ và hang động kỳ thú.",
      category: "TOURIST_SPOT",
      address: "Xã Hợp Tiến, huyện Mỹ Đức, Hà Nội",
      latitude: 20.6789,
      longitude: 105.7234,
      routeId: route2.id,
    },
    {
      name: "Nhà Văn Hóa Cộng Đồng",
      description: "Nhà văn hóa cộng đồng là trung tâm sinh hoạt văn hóa, thể thao và giáo dục của nhân dân địa phương. Đây là nơi tổ chức các hoạt động văn nghệ, thể thao, các buổi học tập, hội họp và giao lưu văn hóa.",
      category: "COMMUNITY_CENTER",
      address: "Trung tâm xã Bình Yên, huyện Thạch Thất, Hà Nội",
      latitude: 21.0123,
      longitude: 105.5678,
    },
  ];

  for (const pointData of points) {
    await prisma.point.create({
      data: {
        ...pointData,
        images: JSON.stringify([]),
        createdById: admin.id,
      },
    });
  }
  console.log("✅ Created", points.length, "sample points");

  console.log("\n🎉 Database seeded successfully!");
  console.log("---");
  console.log("👤 Admin: admin@ditich.vn / admin123");
  console.log("👤 Editor: editor@ditich.vn / editor123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
