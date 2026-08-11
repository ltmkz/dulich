"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, CATEGORY_ICONS, CategoryKey } from "@/lib/constants";
import { Suspense } from "react";
import { Loader2, Map as MapIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const AdminMap = dynamic(() => import("@/components/AdminMap"), { ssr: false });

interface Point {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  visitCount: number;
  route: { name: string; color: string } | null;
}

function MapPageContent() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId");
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoints = useCallback(() => {
    const params = new URLSearchParams();
    if (routeId) params.set("routeId", routeId);
    fetch(`/api/points?${params}`)
      .then((r) => r.json())
      .then((d) => { setPoints(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [routeId]);

  useEffect(() => { fetchPoints(); }, [fetchPoints]);

  return (
    <div className="fade-in space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <MapIcon className="h-8 w-8" /> Bản Đồ Tổng Quan
          </h1>
          <p className="text-muted-foreground mt-1">
            Hiển thị {points.length} điểm tham quan trên bản đồ
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_ICONS).map(([k, icon]) => (
            <Badge key={k} variant="secondary" className="bg-white hover:bg-slate-100 font-medium border shadow-sm">
              <span className="mr-1.5">{icon}</span> {CATEGORIES[k as CategoryKey]}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="flex-1 overflow-hidden min-h-[500px] border-slate-200 shadow-sm">
        <CardContent className="p-0 h-full relative z-0">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Đang tải bản đồ...</p>
            </div>
          ) : (
            <AdminMap points={points} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
