"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, ArrowLeft, Search, X, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";
import { extractedQrData } from "@/lib/regionData";

// Dynamically import Leaflet Map to avoid SSR issues
const SmartVillageMap = dynamic(() => import('./SmartVillageMap'), { ssr: false });

export default function ThonThongMinh({ slugKhuVuc }: { slugKhuVuc?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Resolve actual khuVuc name from slug, or fallback to query param
  let initialKhuVuc = searchParams.get('khuVuc') || "";
  if (slugKhuVuc) {
    const foundEntry = Object.keys(extractedQrData).find(
      key => generateSlug(key) === slugKhuVuc
    );
    if (foundEntry) initialKhuVuc = foundEntry;
  }

  const [households, setHouseholds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch all households for interactive map
    fetch(`/api/households?khuVuc=all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHouseholds(data);
          if (initialKhuVuc) {
            const exists = data.some(h => h.address === initialKhuVuc);
            if (exists) {
              setSelectedAddress(initialKhuVuc);
            }
          }
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [initialKhuVuc]);

  const filteredHouseholds = households
    .filter(h => h.address === selectedAddress)
    .filter(h => h.headName.toLowerCase().includes(searchQuery.toLowerCase()));

  const normalCount = households.filter(h => h.address === selectedAddress && h.status === 'Hộ bình thường').length;
  const nearPoorCount = households.filter(h => h.address === selectedAddress && h.status === 'Hộ cận nghèo').length;
  const poorCount = households.filter(h => h.address === selectedAddress && h.status === 'Hộ nghèo').length;

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-blue-900/90 backdrop-blur-md text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={() => router.push('/quan-ly-khu-vuc')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <MapPin size={20} className="text-blue-200" />
        <h1 className="text-lg font-bold">
          {selectedAddress || initialKhuVuc || "Quản Lý Thôn Thông Minh"}
        </h1>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 w-full h-full relative z-0">
        {!loading ? (
          <SmartVillageMap 
            households={households} 
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress} 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Floating Button if no address is selected (Only for interactive map) */}
      {!selectedAddress && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <Button className="bg-blue-800 hover:bg-blue-900 rounded-full shadow-xl font-bold px-6 py-6 text-base" onClick={() => {
            if (households.length > 0) setSelectedAddress(households[0].address);
          }}>
            Danh sách Đường/Ngõ
          </Button>
        </div>
      )}

      {/* Bottom Sheet (Danh sách hộ gia đình) */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 flex flex-col",
        selectedAddress ? "translate-y-0 h-[65vh]" : "translate-y-full h-[65vh]"
      )}>
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setSelectedAddress(null)}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-5 py-2">
          <h2 className="text-xl font-bold text-slate-800">Danh sách hộ gia đình</h2>
          <button onClick={() => setSelectedAddress(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{normalCount}</div>
              <div className="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-wider">Hộ Bình Thường</div>
            </div>
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{nearPoorCount}</div>
              <div className="text-[10px] font-bold text-orange-600 uppercase mt-1 tracking-wider">Hộ Cận Nghèo</div>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{poorCount}</div>
              <div className="text-[10px] font-bold text-red-600 uppercase mt-1 tracking-wider">Hộ Nghèo</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">0</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">Chưa Phân Loại</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm kiếm tên chủ hộ..." 
              className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredHouseholds.map(h => (
              <div key={h.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Home size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">{h.headName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Users size={12} /> {h.memberCount} nhân khẩu
                    </p>
                  </div>
                </div>
                
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap",
                  h.status === 'Hộ nghèo' ? 'bg-red-50 text-red-600' :
                  h.status === 'Hộ cận nghèo' ? 'bg-orange-50 text-orange-600' :
                  'bg-blue-600 text-white'
                )}>
                  {h.status}
                </div>
              </div>
            ))}

            {filteredHouseholds.length === 0 && (
              <div className="text-center p-8 text-slate-500">
                Không tìm thấy hộ gia đình nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to generate URL-safe slugs
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}
