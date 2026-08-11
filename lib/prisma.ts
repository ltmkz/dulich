import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Tự động thêm ?pgbouncer=true&connection_limit=1 vào DATABASE_URL khi chạy trên Vercel (production)
// để tránh lỗi "prepared statement already exists" với Supabase pgbouncer
function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || "";
  if (process.env.NODE_ENV === "production" && url.includes("supabase.co")) {
    // Đổi port 5432 (direct) sang 6543 (pooler) nếu cần
    url = url.replace(":5432/", ":6543/");
    // Thêm các tham số pgbouncer nếu chưa có
    const separator = url.includes("?") ? "&" : "?";
    if (!url.includes("pgbouncer=true")) {
      url += `${separator}pgbouncer=true`;
    }
    if (!url.includes("connection_limit=")) {
      url += `&connection_limit=1`;
    }
  }
  return url;
}

function makePrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
