"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Search, Home, ChevronRight, List } from "lucide-react";
import { extractedQrData } from "@/lib/regionData";

export default function ThonThongMinh({ khuVuc }: { khuVuc: string }) {
  const [households, setHouseholds] = useState<any[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const regionInfo = extractedQrData[khuVuc];

  useEffect(() => {
    fetch(`/api/households?khuVuc=${encodeURIComponent(khuVuc)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHouseholds(data);
          if (regionInfo && regionInfo.type === 'household') {
            const match = data.find(h => h.address === khuVuc);
            if (match) setSelectedHouse(match);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch households:", err);
        setLoading(false);
      });
  }, []);

  const filteredHouseholds = households.filter((h) =>
    h.headName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "HỘ BÌNH THƯỜNG", count: households.filter(h => h.status === "Hộ bình thường").length.toString().padStart(2, '0'), color: "text-[#0047b3]", bg: "bg-[#f2f7ff]", border: "border-[#cce0ff]" },
    { label: "HỘ CẬN NGHÈO", count: households.filter(h => h.status === "Hộ cận nghèo").length.toString().padStart(2, '0'), color: "text-[#b37700]", bg: "bg-[#fffcf2]", border: "border-[#ffebb3]" },
    { label: "HỘ NGHÈO", count: households.filter(h => h.status === "Hộ nghèo").length.toString().padStart(2, '0'), color: "text-[#dc2626]", bg: "bg-[#fef2f2]", border: "border-[#fecaca]" },
    { label: "CHƯA PHÂN LOẠI", count: households.filter(h => h.status === "Chưa phân loại").length.toString().padStart(2, '0'), color: "text-[#64748b]", bg: "bg-[#f8fafc]", border: "border-[#e2e8f0]" },
  ];

  return (
    <div className="w-full h-screen bg-[#f1f3f4] flex justify-center items-center overflow-hidden font-sans">
      {/* Mobile container */}
      <div className="w-full max-w-md h-full bg-white relative shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#002b80] text-white p-4 flex items-center gap-2 z-10 shadow-md">
          <MapPin size={20} />
          <h1 className="text-lg font-bold line-clamp-1">{khuVuc}</h1>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden bg-[#eef0f2] select-none" ref={mapRef}>
          {/* Simulated Map Background with SVG Roads */}
          <motion.div 
            className="w-[1200px] h-[1200px] absolute cursor-grab active:cursor-grabbing"
            drag
            dragConstraints={mapRef}
            initial={{ x: -200, y: -100 }}
          >
            {regionInfo?.type === 'map' || regionInfo?.mapUrl ? (
              <img 
                src={regionInfo.type === 'map' ? regionInfo.value : regionInfo.mapUrl} 
                alt={khuVuc}
                className="w-full h-full absolute inset-0 object-contain opacity-90"
              />
            ) : (
              <>
                {/* Draw some roads to simulate map if no map image */}
                <svg className="w-full h-full absolute inset-0 opacity-50" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 100 0 L 300 1200" stroke="#ffffff" strokeWidth="30" fill="none" strokeLinecap="round" />
                  <path d="M 800 0 L 400 1200" stroke="#ffffff" strokeWidth="40" fill="none" strokeLinecap="round" />
                  <path d="M 0 400 L 1200 800" stroke="#ffffff" strokeWidth="25" fill="none" strokeLinecap="round" />
                  <path d="M 200 800 L 800 200" stroke="#ffffff" strokeWidth="20" fill="none" strokeLinecap="round" />
                  <rect x="250" y="300" width="150" height="150" fill="#e2e6e9" rx="10" />
                  <rect x="550" y="450" width="200" height="100" fill="#e2e6e9" rx="10" transform="rotate(30 550 450)" />
                  <rect x="650" y="700" width="100" height="120" fill="#e2e6e9" rx="10" transform="rotate(-15 650 700)" />
                </svg>

                {/* Other map markers (shops etc, just decorative) */}
                <div className="absolute left-[400px] top-[200px] flex items-center gap-1">
                  <div className="bg-sky-500 rounded-full p-1 text-white"><MapPin size={12}/></div>
                  <span className="text-sky-600 text-xs font-semibold bg-white/80 px-1 rounded">Đại Lý Bia - Nước Giải Khát</span>
                </div>
                <div className="absolute left-[550px] top-[150px] flex items-center gap-1">
                  <div className="bg-orange-400 rounded-full p-1 text-white"><MapPin size={12}/></div>
                  <span className="text-orange-600 text-xs font-semibold bg-white/80 px-1 rounded">Gấu Nhỏ Bakery</span>
                </div>
              </>
            )}

            {/* Households */}
            {households.map((house) => (
              <div 
                key={house.id} 
                className="absolute flex flex-col items-center gap-1 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: house.latitude * 10, top: house.longitude * 10 }}
                onClick={() => setSelectedHouse(house)}
              >
                {/* Marker Name Label */}
                <div className="bg-white px-3 py-1 rounded-full shadow-md border border-gray-100 text-sm font-semibold text-slate-800 whitespace-nowrap">
                  {house.headName}
                </div>
                {/* Marker Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white ${house.status === 'Hộ nghèo' ? 'bg-[#ef4444]' : 'bg-[#3b82f6]'}`}>
                  <Home size={16} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Popover for selected house */}
          <AnimatePresence>
            {selectedHouse && !showList && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-5 z-20 border border-slate-100"
              >
                <button 
                  onClick={() => setSelectedHouse(null)}
                  className="absolute top-4 right-4 bg-slate-100 p-1.5 rounded-full text-slate-500 hover:bg-slate-200 transition"
                >
                  <X size={16} />
                </button>
                <h2 className="text-xl font-bold text-slate-900 pr-8">{selectedHouse.headName}</h2>
                <p className="text-slate-600 mt-2 text-sm">
                  {selectedHouse.address} &middot; Số nhân khẩu: {selectedHouse.memberCount}
                </p>
                <div className="mt-4 inline-block">
                  <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white ${selectedHouse.status === 'Hộ nghèo' ? 'bg-[#ef4444]' : 'bg-[#3b82f6]'}`}>
                    {selectedHouse.status}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View List Button */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
            <button 
              onClick={() => setShowList(true)}
              className="bg-[#002b80] text-white px-6 py-3 rounded-full font-bold shadow-[0_8px_30px_rgba(0,43,128,0.4)] flex items-center gap-2 hover:bg-[#001a4d] transition-colors active:scale-95"
            >
              <List size={20} />
              Xem danh sách Hộ
            </button>
          </div>
          
          {/* Watermark Google - fake */}
          <div className="absolute bottom-2 left-2 z-10 opacity-70 pointer-events-none">
            <div className="text-slate-800 font-bold text-lg tracking-tighter">Google</div>
          </div>
        </div>

        {/* Bottom Sheet - Danh sách hộ */}
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute inset-0 z-50 bg-white flex flex-col rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] mt-12"
            >
              {/* Drag handle */}
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="px-5 py-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Danh sách hộ gia đình</h2>
                <button 
                  onClick={() => setShowList(false)}
                  className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="px-5 py-4 grid grid-cols-2 gap-3">
                {stats.map((s, i) => (
                  <div key={i} className={`${s.bg} ${s.border} border rounded-xl p-3 flex flex-col items-center justify-center`}>
                    <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
                    <div className={`text-[10px] font-bold ${s.color} mt-1 uppercase`}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-5 pb-20 space-y-3">
                {loading ? (
                  <div className="flex justify-center p-10 text-slate-500">Đang tải...</div>
                ) : filteredHouseholds.length === 0 ? (
                  <div className="flex justify-center p-10 text-slate-500">Không tìm thấy hộ nào.</div>
                ) : (
                  filteredHouseholds.map((house) => (
                    <div 
                      key={house.id} 
                      className="flex items-center justify-between p-4 bg-white border border-slate-100 shadow-sm rounded-2xl active:bg-slate-50 transition cursor-pointer"
                      onClick={() => {
                        setSelectedHouse(house);
                        setShowList(false);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#f2f7ff] flex items-center justify-center text-[#002b80]">
                          <Home size={20} />
                        </div>
                        <div className="font-bold text-slate-900 text-lg">{house.headName}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${house.status === 'Hộ nghèo' ? 'bg-[#ef4444]' : 'bg-[#3b82f6]'}`}>
                          {house.status}
                        </span>
                        <ChevronRight size={18} className="text-slate-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Search Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm tên chủ hộ..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
