import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Tự động thêm ?pgbouncer=true vào DATABASE_URL khi chạy trên Vercel (production)
// để tránh lỗi "prepared statement already exists" với Supabase
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || "";
  if (
    process.env.NODE_ENV === "production" &&
    url.includes("supabase.co") &&
    !url.includes("pgbouncer=true")
  ) {
    return url.includes("?")
      ? `${url}&pgbouncer=true`
      : `${url}?pgbouncer=true`;
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
