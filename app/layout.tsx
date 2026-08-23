import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Số Hóa Di Tích & Du Lịch Địa Phương",
  description: "Hệ thống số hóa thông tin di tích lịch sử, địa chỉ đỏ, điểm du lịch bằng mã QR",
  openGraph: {
    title: "Số Hóa Di Tích & Du Lịch Địa Phương",
    description: "Khám phá lịch sử và văn hóa địa phương qua mã QR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
