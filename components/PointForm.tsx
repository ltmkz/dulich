"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CATEGORIES, CategoryKey } from "@/lib/constants";
import { Upload, X, Save, ArrowLeft, Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dynamic import để tránh SSR conflict với Leaflet
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

interface Route {
  id: string;
  name: string;
  color: string;
}

interface PointFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    category: string;
    address: string;
    latitude: number;
    longitude: number;
    images: string[];
    routeId?: string | null;
  };
  mode: "create" | "edit";
}

export function PointForm({ initialData, mode }: PointFormProps) {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<{
    name: string;
    description: string;
    category: string;
    address: string;
    latitude: number;
    longitude: number;
    images: string[];
    routeId: string;
  }>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "HISTORICAL_SITE",
    address: initialData?.address || "",
    latitude: initialData?.latitude || 10.8231,
    longitude: initialData?.longitude || 106.6297,
    images: initialData?.images || [],
    routeId: initialData?.routeId || "none",
  });

  useEffect(() => {
    fetch("/api/routes")
      .then((r) => r.json())
      .then(setRoutes)
      .catch(() => {});
  }, []);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newPaths: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { path } = await res.json();
        newPaths.push(path);
      }
    }

    setForm((f) => ({ ...f, images: [...f.images, ...newPaths] }));
    setUploadingImages(false);
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      routeId: form.routeId === "none" ? null : form.routeId,
    };

    const url = mode === "create" ? "/api/points" : `/api/points/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccess(mode === "create" ? "Đã tạo điểm thành công! Mã QR đã được sinh tự động." : "Đã cập nhật thành công!");
      setTimeout(() => router.push("/admin/points"), 1500);
    } else {
      const d = await res.json();
      setError(d.error || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {mode === "create" ? "Thêm Điểm Di Tích Mới" : "Chỉnh Sửa Điểm Di Tích"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "create" 
              ? "Điền thông tin chi tiết để thêm điểm tham quan mới vào hệ thống." 
              : "Cập nhật lại thông tin của địa điểm này."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-destructive/15 text-destructive border border-destructive/30 px-4 py-3 rounded-md mb-6 font-medium">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-3 rounded-md mb-6 font-medium flex items-center gap-2">
            ✅ {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thông tin chính */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cơ Bản</CardTitle>
                <CardDescription>Các thông tin hiển thị chính của địa điểm.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên điểm <span className="text-destructive">*</span></Label>
                  <Input 
                    id="name"
                    value={form.name} 
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
                    placeholder="VD: Đình làng Thạch Thất" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loại điểm <span className="text-destructive">*</span></Label>
                    <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORIES).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tuyến đường</Label>
                    <Select value={form.routeId} onValueChange={(v) => setForm((f) => ({ ...f, routeId: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tuyến đường" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Không thuộc tuyến nào —</SelectItem>
                        {routes.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ <span className="text-destructive">*</span></Label>
                  <Input 
                    id="address"
                    value={form.address} 
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} 
                    placeholder="VD: Thôn X, xã Y, huyện Z" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Mô tả / Thông tin lịch sử <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="desc"
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Mô tả chi tiết về lịch sử, ý nghĩa của địa điểm này..."
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hình Ảnh</CardTitle>
                <CardDescription>Tải lên các hình ảnh nổi bật của địa điểm này.</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImages ? (
                      <Loader2 className="w-8 h-8 mb-3 text-muted-foreground animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    )}
                    <p className="mb-2 text-sm text-muted-foreground font-medium">
                      {uploadingImages ? "Đang tải ảnh lên..." : "Nhấn để chọn ảnh"}
                    </p>
                    <p className="text-xs text-muted-foreground">Có thể chọn nhiều ảnh cùng lúc</p>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <Image 
                          src={img} 
                          alt={`Ảnh ${i + 1}`} 
                          width={96} 
                          height={96} 
                          className="rounded-lg object-cover w-24 h-24 border shadow-sm transition-transform group-hover:scale-105" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vị trí Bản đồ */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Vị Trí Bản Đồ</CardTitle>
                </div>
                <CardDescription>Nhấn vào bản đồ để chọn tọa độ chính xác.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg overflow-hidden border h-[300px] w-full relative z-0">
                  <MapPicker
                    lat={form.latitude}
                    lng={form.longitude}
                    onSelect={handleLocationSelect}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat" className="text-xs">Vĩ độ (Latitude)</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={form.latitude}
                      onChange={(e) => setForm((f) => ({ ...f, latitude: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng" className="text-xs">Kinh độ (Longitude)</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={form.longitude}
                      onChange={(e) => setForm((f) => ({ ...f, longitude: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy Bỏ
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === "create" ? "Lưu Điểm & Sinh QR" : "Lưu Thay Đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
