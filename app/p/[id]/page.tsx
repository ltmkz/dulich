import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, CATEGORY_ICONS, CategoryKey } from "@/lib/constants";
import Image from "next/image";
import PublicMapClient from "@/components/PublicMapClient";
import { Navigation, Map as MapIcon, Info, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const point = await prisma.point.findUnique({
    where: { id, isActive: true },
    select: { name: true, description: true, images: true },
  });
  if (!point) return { title: "Không tìm thấy" };

  const imgs = JSON.parse(point.images || "[]") as string[];
  return {
    title: `${point.name} - Di Tích & Du Lịch Địa Phương`,
    description: point.description.slice(0, 160),
    openGraph: {
      title: point.name,
      description: point.description.slice(0, 160),
      images: imgs[0] ? [imgs[0]] : [],
    },
  };
}

export default async function PublicPointPage({ params }: Props) {
  const { id } = await params;

  const point = await prisma.point.findUnique({
    where: { id, isActive: true },
    include: {
      route: {
        include: {
          points: {
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
            select: { id: true, name: true, latitude: true, longitude: true, category: true },
          },
        },
      },
    },
  });

  if (!point) notFound();

  // Tăng lượt xem
  await prisma.point.update({ where: { id }, data: { visitCount: { increment: 1 } } });

  const images = JSON.parse(point.images || "[]") as string[];
  const catKey = point.category as CategoryKey;
  const mapsUrl = `https://maps.google.com/?q=${point.latitude},${point.longitude}`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Hero images */}
      {images.length > 0 ? (
        <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
          <Image
            src={images[0]}
            alt={point.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        </div>
      ) : (
        <div className="h-[240px] bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-8xl">
          {CATEGORY_ICONS[catKey]}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="relative z-10 -mt-16 md:-mt-24 mb-8 bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="mb-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-xs">
              <span className="mr-1.5 text-sm">{CATEGORY_ICONS[catKey]}</span> 
              {CATEGORIES[catKey]}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3 leading-tight">
            {point.name}
          </h1>
          <p className="text-slate-600 flex items-start gap-2 text-sm md:text-base">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <span>{point.address}</span>
          </p>
          
          {point.route && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Tuyến đường:</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-slate-50">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: point.route.color }}
                />
                <span className="font-medium">{point.route.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Image gallery */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 snap-x">
            {images.map((img, i) => (
              <div key={i} className="relative w-32 h-24 sm:w-40 sm:h-28 shrink-0 snap-start">
                <Image
                  src={img}
                  alt={`Ảnh ${i + 1}`}
                  fill
                  className="rounded-lg object-cover border shadow-sm"
                />
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
            <Button size="lg" className="w-full sm:w-auto gap-2 h-12 text-base">
              <Navigation className="h-5 w-5" /> Chỉ Đường Google Maps
            </Button>
          </a>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-12 px-8 flex-1 sm:flex-none w-full sm:w-auto gap-2 text-base bg-white outline-none">
                <MapIcon className="h-5 w-5 text-primary" /> Bản Đồ Khác
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Mở bằng ứng dụng</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <a 
                    href={`https://maps.apple.com/?q=${point.latitude},${point.longitude}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cursor-pointer flex items-center py-1 w-full outline-none"
                  >
                    🍎 Apple Maps
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a 
                    href={`https://waze.com/ul?ll=${point.latitude},${point.longitude}&navigate=yes`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cursor-pointer flex items-center py-1 w-full outline-none"
                  >
                    🚙 Waze
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a 
                    href={`geo:${point.latitude},${point.longitude}`} 
                    className="cursor-pointer flex items-center py-1 w-full outline-none"
                  >
                    📱 Ứng dụng mặc định (Mobile)
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-8">
          {/* Description */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <Info className="h-5 w-5 text-primary" /> Thông Tin Lịch Sử
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-slate prose-p:leading-relaxed max-w-none">
                <p className="whitespace-pre-wrap text-slate-700">{point.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <MapIcon className="h-5 w-5 text-primary" /> Vị Trí Trên Bản Đồ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px] w-full relative z-0">
                <PublicMapClient
                  point={{ lat: point.latitude, lng: point.longitude, name: point.name }}
                  routePoints={point.route?.points?.map((p) => ({
                    lat: p.latitude,
                    lng: p.longitude,
                    name: p.name,
                    id: p.id,
                    category: p.category,
                  }))}
                  routeColor={point.route?.color}
                />
              </div>
            </CardContent>
          </Card>

          {/* Route stops */}
          {point.route && point.route.points.length > 1 && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" 
                    style={{ backgroundColor: point.route.color }}
                  />
                  Các Điểm Trong Tuyến: {point.route.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {point.route.points.map((p, i) => {
                    const isCurrent = p.id === id;
                    return (
                      <a
                        key={p.id}
                        href={`/p/${p.id}`}
                        className="block transition-transform hover:-translate-y-0.5"
                      >
                        <div
                          className={`flex items-center gap-4 p-3 rounded-xl border ${
                            isCurrent 
                              ? "bg-primary/5 border-primary/30 shadow-sm" 
                              : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: point.route!.color }}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${isCurrent ? "text-primary" : "text-slate-900"}`}>
                              <span className="mr-1.5">{CATEGORY_ICONS[p.category as CategoryKey]}</span>
                              {p.name}
                            </div>
                            {isCurrent && (
                              <div className="text-[11px] font-semibold text-primary mt-0.5 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                BẠN ĐANG Ở ĐÂY
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
