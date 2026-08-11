"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CATEGORY_ICONS, CategoryKey } from "@/lib/constants";
import { 
  Plus, 
  Search, 
  MapPin, 
  Eye, 
  Pencil, 
  Trash2, 
  Download, 
  RefreshCw,
  MoreVertical
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Point {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  visitCount: number;
  qrCodePath: string | null;
  images: string;
  isActive: boolean;
  route: { name: string; color: string } | null;
  createdBy: { name: string };
  createdAt: string;
}

export default function PointsPage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPoints = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter && categoryFilter !== "all") params.set("category", categoryFilter);
    fetch(`/api/points?${params}`)
      .then((r) => r.json())
      .then((d) => { setPoints(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { 
    // Debounce search slightly
    const timer = setTimeout(() => fetchPoints(), 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa điểm này? Hành động này không thể hoàn tác.")) return;
    setDeletingId(id);
    await fetch(`/api/points/${id}`, { method: "DELETE" });
    setDeletingId(null);
    fetchPoints();
  };

  const handleRegenerateQR = async (id: string) => {
    await fetch(`/api/points/${id}/qr`, { method: "POST" });
    fetchPoints();
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Điểm Di Tích</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý {points.length} điểm tham quan trong hệ thống
          </p>
        </div>
        <Link href="/admin/points/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Thêm Điểm Mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Danh Sách Điểm</CardTitle>
          <CardDescription>
            Tìm kiếm, phân loại và quản lý tất cả các địa điểm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tên, địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-[220px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại hình</SelectItem>
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center p-12 text-muted-foreground">⏳ Đang tải dữ liệu...</div>
          ) : points.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-lg">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Không tìm thấy điểm nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thử thay đổi bộ lọc hoặc thêm một điểm mới.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Ảnh</TableHead>
                      <TableHead>Tên điểm & Tọa độ</TableHead>
                      <TableHead>Phân loại</TableHead>
                      <TableHead>Tuyến đường</TableHead>
                      <TableHead className="text-center">Lượt xem</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {points.map((point) => {
                      const imgs = JSON.parse(point.images || "[]") as string[];
                      return (
                        <TableRow key={point.id}>
                          <TableCell>
                            {imgs[0] ? (
                              <Image
                                src={imgs[0]}
                                alt={point.name}
                                width={48}
                                height={48}
                                className="rounded-md object-cover w-12 h-12 border"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xl border">
                                {CATEGORY_ICONS[point.category as CategoryKey]}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-foreground">{point.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal bg-background">
                              <span className="mr-1">{CATEGORY_ICONS[point.category as CategoryKey]}</span>
                              {CATEGORIES[point.category as CategoryKey]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {point.route ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2.5 h-2.5 rounded-full" 
                                  style={{ backgroundColor: point.route.color }}
                                />
                                <span className="text-sm">{point.route.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-medium">
                              {point.visitCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground outline-none">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                  <Link href={`/p/${point.id}`} target="_blank" className="cursor-pointer flex items-center w-full outline-none">
                                    <Eye className="mr-2 h-4 w-4" /> Xem trang Public
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/admin/points/${point.id}`} className="cursor-pointer flex items-center w-full outline-none">
                                    <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa điểm
                                  </Link>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                {point.qrCodePath ? (
                                  <DropdownMenuItem>
                                    <a href={point.qrCodePath} download target="_blank" className="cursor-pointer font-medium text-primary flex items-center w-full outline-none">
                                      <Download className="mr-2 h-4 w-4" /> Tải mã QR
                                    </a>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleRegenerateQR(point.id)}
                                    className="cursor-pointer font-medium text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4" /> Sinh mã QR
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(point.id)}
                                  disabled={deletingId === point.id}
                                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Xóa điểm
                                </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
