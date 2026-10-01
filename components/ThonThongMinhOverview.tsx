"use client";

import React from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  normalCount: number;
  nearPoorCount: number;
  poorCount: number;
  mapUrl?: string;
  onViewMap: () => void;
}

export default function ThonThongMinhOverview({
  title,
  normalCount,
  nearPoorCount,
  poorCount,
  mapUrl,
  onViewMap,
}: Props) {
  const total = normalCount + nearPoorCount + poorCount;

  // SVG Chart calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  
  const normalPercent = total > 0 ? normalCount / total : 0;
  const poorPercent = total > 0 ? poorCount / total : 0;
  const nearPoorPercent = total > 0 ? nearPoorCount / total : 0;

  const normalStrokeDasharray = `${normalPercent * circumference} ${circumference}`;
  const poorStrokeDasharray = `${poorPercent * circumference} ${circumference}`;
  const nearPoorStrokeDasharray = `${nearPoorPercent * circumference} ${circumference}`;

  const normalOffset = 0;
  const poorOffset = -(normalPercent * circumference);
  const nearPoorOffset = poorOffset - (poorPercent * circumference);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10">
        <h1 className="text-blue-800 font-bold text-xl">Smart Village</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-800 mb-1">{title}</h2>
          <p className="text-slate-500 text-sm">Tổng quan dân cư</p>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 mb-6">Phân bố hộ gia đình</h3>
          
          <div className="flex justify-center mb-8 relative">
            <svg width="180" height="180" className="-rotate-90">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="24"
              />
              {total > 0 && (
                <>
                  {/* Normal (Blue) */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="#1d4ed8"
                    strokeWidth="24"
                    strokeDasharray={normalStrokeDasharray}
                    strokeDashoffset={normalOffset}
                  />
                  {/* Poor (Red) */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="24"
                    strokeDasharray={poorStrokeDasharray}
                    strokeDashoffset={poorOffset}
                  />
                  {/* Near Poor (Orange) */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="24"
                    strokeDasharray={nearPoorStrokeDasharray}
                    strokeDashoffset={nearPoorOffset}
                  />
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Tổng</span>
              <span className="text-3xl font-bold text-slate-900 leading-none">{total}</span>
            </div>
          </div>

          {total > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                  <span className="text-slate-600 text-sm">Hộ bình thường</span>
                </div>
                <span className="font-bold text-slate-900">{normalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-600 text-sm">Hộ nghèo</span>
                </div>
                <span className="font-bold text-slate-900">{poorCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-slate-600 text-sm">Hộ cận nghèo</span>
                </div>
                <span className="font-bold text-slate-900">{nearPoorCount}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 italic mt-8">
              *Chưa có dữ liệu phân loại
            </div>
          )}
        </div>

        {/* Map Card */}
        <div>
          <h3 className="font-bold text-slate-800 mb-4">Bản đồ làng xã</h3>
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 p-2">
            <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center group">
              {mapUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mapUrl} alt="Map" className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
              ) : (
                <div className="text-slate-400">Map Image placeholder</div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <Button 
                  onClick={onViewMap}
                  className="bg-blue-800 hover:bg-blue-900 text-white rounded-xl shadow-lg font-bold h-12 px-6 gap-2"
                >
                  <Map size={18} /> Xem bản đồ chi tiết
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
