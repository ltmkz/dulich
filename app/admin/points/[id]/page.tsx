"use client";
import { useEffect, useState } from "react";
import { PointForm } from "@/components/PointForm";
import Image from "next/image";
import { use } from "react";
import { Loader2, Download, QrCode } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface Point {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string;
  routeId?: string | null;
  qrCodePath?: string;
  visitCount: number;
}

export default function EditPointPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [point, setPoint] = useState<Point | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/points/${id}`)
      .then((r) => r.json())
      .then((d) => { setPoint(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Đang tải dữ liệu điểm...</p>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        ❌ Không tìm thấy điểm
      </div>
    );
  }

  const images = JSON.parse(point.images || "[]") as string[];

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Chỉnh Sửa Địa Điểm</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Đang chỉnh sửa: <span className="font-medium text-foreground">{point.name}</span>
          </p>
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {point.visitCount} lượt xem
            </span>
          </div>
        </div>
        
        {point.qrCodePath && (
          <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center gap-2 shrink-0">
            <Image 
              src={point.qrCodePath} 
              alt="QR Code" 
              width={100} 
              height={100} 
              className="rounded-lg"
              unoptimized
            />
            <a href={point.qrCodePath} download className={buttonVariants({ variant: "outline", size: "sm", className: "w-full gap-2 h-8 text-xs" })}>
              <Download className="h-3 w-3" /> Tải QR
            </a>
          </div>
        )}
      </div>

      <PointForm
        mode="edit"
        initialData={{
          id: point.id,
          name: point.name,
          description: point.description,
          category: point.category,
          address: point.address,
          latitude: point.latitude,
          longitude: point.longitude,
          images,
          routeId: point.routeId,
        }}
      />
    </div>
  );
}
