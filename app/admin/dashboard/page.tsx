"use client";
import { useEffect, useState } from "react";
import { CATEGORIES, CATEGORY_ICONS, CategoryKey } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { MapPin, Route as RouteIcon, Eye, QrCode, TrendingUp, Tags, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  totalPoints: number;
  totalRoutes: number;
  totalVisits: number;
  topPoints: { id: string; name: string; visitCount: number; category: string }[];
  categoryStats: { category: string; _count: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Đang tải thống kê...</p>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Bảng Điều Khiển</h1>
        <p className="text-muted-foreground mt-1">
          Tổng quan hệ thống số hóa di tích & du lịch
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Địa điểm",
            value: stats?.totalPoints ?? 0,
            icon: MapPin,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            title: "Tuyến Đường",
            value: stats?.totalRoutes ?? 0,
            icon: RouteIcon,
            color: "text-amber-600",
            bg: "bg-amber-100",
          },
          {
            title: "Lượt Xem",
            value: stats?.totalVisits ?? 0,
            icon: Eye,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            title: "Mã QR Đã Sinh",
            value: stats?.totalPoints ?? 0,
            icon: QrCode,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-md", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value.toLocaleString("vi-VN")}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Points */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Top Điểm Được Xem Nhiều</CardTitle>
            </div>
            <CardDescription>Các địa điểm di tích được quét mã QR nhiều nhất.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.topPoints?.length ? (
              <div className="space-y-4">
                {stats.topPoints.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm",
                        i === 0 ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : i === 1 ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : i === 2 ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : "bg-muted text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-medium truncate flex items-center gap-2">
                        <span>{CATEGORY_ICONS[p.category as CategoryKey]}</span>
                        {p.name}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {p.visitCount} lượt
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu lượt xem</p>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-primary" />
              <CardTitle>Phân Loại Điểm</CardTitle>
            </div>
            <CardDescription>Thống kê số lượng điểm theo từng loại.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.categoryStats?.length ? (
              <div className="space-y-4">
                {stats.categoryStats.map((c) => {
                  const maxCount = Math.max(...stats.categoryStats.map((x) => x._count));
                  const pct = maxCount > 0 ? (c._count / maxCount) * 100 : 0;
                  return (
                    <div key={c.category} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <span>{CATEGORY_ICONS[c.category as CategoryKey]}</span>
                          {CATEGORIES[c.category as CategoryKey] || c.category}
                        </span>
                        <span className="font-bold">{c._count}</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
