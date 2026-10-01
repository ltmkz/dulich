"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Map, QrCode, ArrowRight, Home, X } from "lucide-react";
import { extractedQrData } from "@/lib/regionData";
import { generateSlug } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export default function QuanLyKhuVucPage() {
  const [qrModal, setQrModal] = useState<{ isOpen: boolean, title: string, url: string }>({
    isOpen: false,
    title: "",
    url: ""
  });
  
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const maps = Object.entries(extractedQrData).filter(([k, v]) => v.type === 'map');
  const households = Object.entries(extractedQrData).filter(([k, v]) => v.type === 'household');

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Quản Lý Thôn Thông Minh
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Hệ thống quản lý hộ nhân sự và sơ đồ địa giới. Quét mã QR tại từng hộ gia đình để tra cứu thông tin trên bản đồ số hóa.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Map className="text-blue-600" /> Sơ đồ Tổng quan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {maps.map(([key, info]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all group relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{key}</h3>
                <p className="text-slate-500 text-sm mb-4">Bản đồ địa giới hành chính</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Link 
                  href={`/khu-vuc/${generateSlug(key)}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors bg-blue-50 w-fit px-4 py-2 rounded-xl"
                >
                  Mở Bản Đồ <ArrowRight size={18} />
                </Link>
                <button 
                  onClick={() => setQrModal({
                    isOpen: true,
                    title: key,
                    url: `${origin}/khu-vuc/${generateSlug(key)}`
                  })}
                  className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-colors bg-purple-50 w-fit px-4 py-2 rounded-xl"
                >
                  <QrCode size={18} /> Lấy QR Code
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Home className="text-emerald-600" /> Quản Lý Hộ Gia Đình
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 font-semibold text-slate-600">STT</th>
                  <th className="p-4 font-semibold text-slate-600">Địa chỉ / Khu vực</th>
                  <th className="p-4 font-semibold text-slate-600">Tên Hộ / Số nhà</th>
                  <th className="p-4 font-semibold text-slate-600">Mã QR</th>
                  <th className="p-4 font-semibold text-slate-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {households.map(([key, info], idx) => (
                  <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500">{idx + 1}</td>
                    <td className="p-4 font-medium text-slate-800">{key}</td>
                    <td className="p-4 text-slate-600">{info.value}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <QrCode size={14} /> Có QR
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        href={`/khu-vuc/${generateSlug(key)}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Định vị <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Code Modal */}
        {qrModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setQrModal(prev => ({...prev, isOpen: false}))}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-800 text-center mb-2 leading-tight">
                Mã QR Code
              </h3>
              <p className="text-slate-500 text-center mb-6 font-medium text-sm">
                {qrModal.title}
              </p>
              
              <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-slate-100 mb-6 flex justify-center w-full">
                {qrModal.url ? (
                  <QRCodeSVG 
                    value={qrModal.url} 
                    size={200}
                    level="H"
                    includeMargin={false}
                    fgColor="#1e293b" 
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-slate-100 animate-pulse rounded-lg" />
                )}
              </div>
              
              <p className="text-xs text-slate-400 text-center px-4">
                Quét mã này bằng Camera hoặc ứng dụng quét mã QR trên điện thoại để mở bản đồ.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
