import React from "react";
import Link from "next/link";
import { Map, QrCode, ArrowRight, Home } from "lucide-react";
import { extractedQrData } from "@/lib/regionData";
import { generateSlug } from "@/components/ThonThongMinh";

export default function QuanLyKhuVucPage() {
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
              <Link 
                href={`/khu-vuc/${generateSlug(key)}`}
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors bg-blue-50 w-fit px-4 py-2 rounded-xl"
              >
                Mở Bản Đồ <ArrowRight size={18} />
              </Link>
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
      </div>
    </div>
  );
}
