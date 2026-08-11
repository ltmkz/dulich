"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapIcon, Pencil, Plus, Trash2, Route as RouteIcon } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Route {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  _count: { points: number };
}

const PRESET_COLORS = ["#005acc", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "", color: "#005acc" });
  const [creating, setCreating] = useState(false);

  // Edit state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", description: "", color: "" });
  const [editing, setEditing] = useState(false);

  const fetchRoutes = () => {
    fetch("/api/routes")
      .then((r) => r.json())
      .then((d) => { setRoutes(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreating(false);
    setIsCreateOpen(false);
    setCreateForm({ name: "", description: "", color: "#005acc" });
    fetchRoutes();
  };

  const handleEditClick = (route: Route) => {
    setEditForm({
      id: route.id,
      name: route.name,
      description: route.description || "",
      color: route.color,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);
    await fetch(`/api/routes/${editForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        description: editForm.description,
        color: editForm.color,
      }),
    });
    setEditing(false);
    setIsEditOpen(false);
    fetchRoutes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tuyến đường này?")) return;
    await fetch(`/api/routes/${id}`, { method: "DELETE" });
    fetchRoutes();
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tuyến Đường</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các tuyến tham quan, dã ngoại
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo Tuyến Mới
        </Button>
      </div>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Tạo Tuyến Đường Mới</DialogTitle>
              <DialogDescription>
                Thêm một tuyến đường mới để nhóm các điểm tham quan lại với nhau.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên tuyến <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="VD: Tuyến Di Tích Lịch Sử" 
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label>Màu sắc hiển thị trên bản đồ</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, color: c })}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{ background: c }}
                    >
                      {createForm.color === c && <div className="w-3 h-3 bg-white rounded-full" />}
                    </button>
                  ))}
                  <Input 
                    type="color" 
                    value={createForm.color} 
                    onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                    className="w-10 h-10 p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Mô tả (Tùy chọn)</Label>
                <Textarea 
                  id="desc" 
                  placeholder="Mô tả ngắn về tuyến đường..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Đang lưu..." : "Lưu Tuyến Đường"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Chỉnh Sửa Tuyến Đường</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin cho tuyến đường.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Tên tuyến <span className="text-destructive">*</span></Label>
                <Input 
                  id="edit-name" 
                  placeholder="VD: Tuyến Di Tích Lịch Sử" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label>Màu sắc hiển thị trên bản đồ</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, color: c })}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{ background: c }}
                    >
                      {editForm.color === c && <div className="w-3 h-3 bg-white rounded-full" />}
                    </button>
                  ))}
                  <Input 
                    type="color" 
                    value={editForm.color} 
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    className="w-10 h-10 p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-desc">Mô tả (Tùy chọn)</Label>
                <Textarea 
                  id="edit-desc" 
                  placeholder="Mô tả ngắn về tuyến đường..."
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={editing}>
                {editing ? "Đang cập nhật..." : "Cập Nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Các Tuyến</CardTitle>
          <CardDescription>
            Quản lý và chỉnh sửa thông tin các tuyến tham quan trên bản đồ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8 text-muted-foreground">⏳ Đang tải dữ liệu...</div>
          ) : routes.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-lg">
              <RouteIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Chưa có tuyến đường nào</h3>
              <p className="text-sm text-muted-foreground mb-4">Bạn chưa tạo tuyến đường nào. Hãy tạo tuyến đầu tiên!</p>
              <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Tạo Tuyến
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Màu</TableHead>
                    <TableHead>Tên Tuyến Đường</TableHead>
                    <TableHead>Số Điểm</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <div 
                          className="w-6 h-6 rounded-full shadow-sm border border-border" 
                          style={{ backgroundColor: route.color }} 
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{route.name}</div>
                        {route.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {route.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{route._count.points} điểm</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/map?routeId=${route.id}`}>
                            <Button variant="ghost" size="icon" title="Xem bản đồ">
                              <MapIcon className="h-4 w-4 text-primary" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Sửa tuyến"
                            onClick={() => handleEditClick(route)}
                          >
                            <Pencil className="h-4 w-4 text-amber-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Xóa tuyến"
                            onClick={() => handleDelete(route.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
