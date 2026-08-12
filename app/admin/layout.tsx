"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MapPin,
  Route as RouteIcon,
  Map as MapIcon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  Compass
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Bảng Điều Khiển" },
  { href: "/admin/points", icon: MapPin, label: "Địa Điểm" },
  { href: "/admin/routes", icon: RouteIcon, label: "Tuyến Đường" },
  { href: "/admin/map", icon: MapIcon, label: "Bản Đồ Tổng Quan" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Compass className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r flex flex-col transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen",
          sidebarOpen ? "w-[300px]" : "w-[72px]"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b shrink-0">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
            <Compass className="h-6 w-6" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-bold text-sm whitespace-nowrap text-foreground">
                Đoàn xã Khe Sanh
              </div>
              <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                Số Hóa Di Tích & Du Lịch
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User info */}
        <div className="p-4 border-t">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                {session.user.name?.[0]?.toUpperCase() || "Đ"}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-semibold whitespace-nowrap truncate text-foreground">
                  {session.user.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session.user.role === "ADMIN" ? "Quản trị viên" : "Kiểm duyệt viên"}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10"
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b flex items-center px-6 gap-4 shrink-0 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground"
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
          <div className="flex-1" />
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/20 hover:bg-primary/5">
              <ExternalLink className="h-4 w-4" /> Xem trang web
            </Button>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
