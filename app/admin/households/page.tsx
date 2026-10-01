"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HouseholdsAdminPage() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentHouse, setCurrentHouse] = useState<any>(null);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/households?khuVuc=all");
      const data = await res.json();
      setHouseholds(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa hộ này?")) return;
    try {
      await fetch(`/api/households/${id}`, { method: "DELETE" });
      fetchHouseholds();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentHouse.id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/households" : `/api/households/${currentHouse.id}`;
    
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentHouse,
          memberCount: parseInt(currentHouse.memberCount),
          latitude: parseFloat(currentHouse.latitude) || 50,
          longitude: parseFloat(currentHouse.longitude) || 50
        })
      });
      setIsEditing(false);
      fetchHouseholds();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = households.filter((h: any) => 
    h.headName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6">{currentHouse.id ? 'Sửa Hộ Gia Đình' : 'Thêm Hộ Mới (hoặc Tạo Thôn/Đường Mới)'}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên Hộ / Số nhà</label>
            <Input 
              required
              value={currentHouse.headName || ''}
              onChange={e => setCurrentHouse({...currentHouse, headName: e.target.value})}
              placeholder="VD: Nguyễn Phong Phú hoặc Số 29"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Khu Vực / Tên Thôn / Tên Đường</label>
            <Input 
              required
              value={currentHouse.address || ''}
              onChange={e => setCurrentHouse({...currentHouse, address: e.target.value})}
              placeholder="VD: Đường Trần Nguyên Hãn"
            />
            <p className="text-xs text-slate-500 mt-1">Lưu ý: Nếu nhập một khu vực mới tinh, hệ thống sẽ tự động coi đây là một thôn/khu vực mới.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Số Nhân Khẩu</label>
              <Input 
                type="number" required min="1"
                value={currentHouse.memberCount || ''}
                onChange={e => setCurrentHouse({...currentHouse, memberCount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hoàn Cảnh / Trạng Thái</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={currentHouse.status || 'Hộ bình thường'}
                onChange={e => setCurrentHouse({...currentHouse, status: e.target.value})}
              >
                <option value="Hộ bình thường">Hộ bình thường</option>
                <option value="Hộ cận nghèo">Hộ cận nghèo</option>
                <option value="Hộ nghèo">Hộ nghèo</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vĩ độ (Latitude)</label>
              <Input 
                type="number" step="any" required
                value={currentHouse.latitude || ''}
                onChange={e => setCurrentHouse({...currentHouse, latitude: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kinh độ (Longitude)</label>
              <Input 
                type="number" step="any" required
                value={currentHouse.longitude || ''}
                onChange={e => setCurrentHouse({...currentHouse, longitude: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
            <Button type="submit">Lưu Dữ Liệu</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản Lý Hộ Gia Đình</h1>
          <p className="text-slate-500 mt-1">Quản lý cư dân, thêm hộ mới hoặc tạo khu vực mới.</p>
        </div>
        <Button onClick={() => {
          setCurrentHouse({ memberCount: 4, status: 'Hộ bình thường', latitude: 50, longitude: 50 });
          setIsEditing(true);
        }} className="gap-2">
          <Plus size={16} /> Thêm Mới
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              className="pl-9 bg-white" 
              placeholder="Tìm tên chủ hộ hoặc khu vực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Tổng số: {filtered.length} hộ
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                <th className="p-4 font-semibold text-slate-600">Tên Chủ Hộ / Số Nhà</th>
                <th className="p-4 font-semibold text-slate-600">Khu Vực (Thôn/Đường)</th>
                <th className="p-4 font-semibold text-slate-600">Nhân Khẩu</th>
                <th className="p-4 font-semibold text-slate-600">Phân Loại</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Không tìm thấy hộ nào</td></tr>
              ) : (
                filtered.map((h: any) => (
                  <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{h.headName}</td>
                    <td className="p-4 text-slate-600 flex items-center gap-1">
                      <MapPin size={14} className="text-blue-500" /> {h.address}
                    </td>
                    <td className="p-4 text-slate-600">{h.memberCount} người</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        h.status === 'Hộ nghèo' ? 'bg-red-100 text-red-700' :
                        h.status === 'Hộ cận nghèo' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setCurrentHouse(h); setIsEditing(true); }} className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(h.id)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
