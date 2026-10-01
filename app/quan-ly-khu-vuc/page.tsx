import React from "react";
import Link from "next/link";
import { Map, QrCode, ArrowRight } from "lucide-react";

const khuVucList = [
  { id: 1, name: "Sơ đồ địa giới - Thôn Lương Lễ", shortLink: "https://qr-i.io/axkmgsys" },
  { id: 2, name: "Sơ đồ địa giới - Thôn 3A", shortLink: "https://qr-i.io/2lcnmdj3" },
  { id: 3, name: "Thôn Lương Lễ - xã Khe Sanh", shortLink: "https://qr-i.io/nzxowp32" },
  { id: 4, name: "Thôn 3A - Xã Khe Sanh", shortLink: "https://qr-i.io/ofu6m556" },
  { id: 5, name: "Xóm Tà Đủ - Thôn Lương Lễ", shortLink: "https://qr-i.io/d3diwa1g" },
  { id: 6, name: "Xóm 5 - Thôn Lương Lễ", shortLink: "https://qr-i.io/0kkjc9ub" },
  { id: 7, name: "Xóm 4 - Thôn Lương Lễ", shortLink: "https://qr-i.io/ovd4fyj9" },
  { id: 8, name: "Xóm 3 - Thôn Lương Lễ", shortLink: "https://qr-i.io/08keaoq8" },
  { id: 9, name: "Xóm 2 - Thôn Lương Lễ", shortLink: "https://qr-i.io/0lcac9ie" },
  { id: 10, name: "Xóm 1 - Thôn Lương Lễ", shortLink: "https://qr-i.io/3g5lpotu" },
  { id: 11, name: "Đường Trần Nguyên Hãn", shortLink: "https://qr-i.io/8c5ewtex" },
  { id: 12, name: "Đường Hồ Sỹ Thản", shortLink: "https://qr-i.io/i25jt5hv" },
  { id: 13, name: "Đường Nguyễn Văn Linh", shortLink: "https://qr-i.io/0v0bya2a" },
  { id: 14, name: "Ngõ 01 - Hà Huy Tập", shortLink: "https://qr-i.io/q5ekbcre" },
  { id: 15, name: "Đường Hà Huy Tập", shortLink: "https://qr-i.io/e8ibk4he" },
  { id: 16, name: "Ngõ 01 - Bùi Thị Xuân", shortLink: "https://qr-i.io/hqf01r9e" },
  { id: 17, name: "Đường Bùi Thị Xuân", shortLink: "https://qr-i.io/4nu26m6c" },
  { id: 18, name: "Ngõ 02 - Đường Ngô Sỹ Liên", shortLink: "https://qr-i.io/6mn26njy" },
  { id: 19, name: "Ngõ 01 - Đường Ngô Sỹ Liên", shortLink: "https://qr-i.io/0skxvo5y" },
  { id: 20, name: "Đường Ngô Sỹ Liên", shortLink: "https://qr-i.io/9sryu432" },
  { id: 21, name: "Kiệt 35 - Đường Ngô Sỹ Liên", shortLink: "https://qr-i.io/mcfj2834" },
  { id: 22, name: "Đường Hai Bà Trưng", shortLink: "https://qr-i.io/a5yqhnbg" },
  { id: 23, name: "Đường Nguyễn Trãi", shortLink: "https://qr-i.io/20nvyaba" },
  { id: 24, name: "Đường Trần Hữu Dực", shortLink: "https://qr-i.io/eonrjcn7" },
  { id: 25, name: "Đường Đặng Thai Mai", shortLink: "https://qr-i.io/6ipzcry1" },
  { id: 26, name: "Đường Lê Hành", shortLink: "https://qr-i.io/mg808uog" },
  { id: 27, name: "Đường Hùng Vương", shortLink: "https://qr-i.io/k81sdmqi" },
  { id: 28, name: "Ngõ 22 - Hùng Vương", shortLink: "https://qr-i.io/kfq5td3m" },
  { id: 29, name: "Ngõ 30 - Hùng Vương", shortLink: "https://qr-i.io/puagwn3o" },
  { id: 30, name: "Đường Lê Duẩn", shortLink: "https://qr-i.io/95mi0ox7" },
  { id: 31, name: "Ngõ 171 Lê Duẩn", shortLink: "https://qr-i.io/2og4ivp0" }
];

export default function QuanLyKhuVucPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Quản Lý Thôn Thông Minh
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Danh sách tất cả các khu vực, đường, ngõ, và thôn xóm được hỗ trợ hệ thống quét mã QR thông minh. Chọn một khu vực để xem chi tiết danh sách hộ gia đình và bản đồ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {khuVucList.map((khuVuc) => (
            <div 
              key={khuVuc.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 p-6 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  {khuVuc.name.includes("Sơ đồ") ? <Map size={24} /> : <QrCode size={24} />}
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  Mã QR: {khuVuc.shortLink.split('/').pop()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                {khuVuc.name}
              </h2>
              
              <p className="text-slate-500 text-sm mb-6">
                Chức năng quản lý hộ nhân sự, phân loại hộ gia đình theo từng xóm/đường.
              </p>

              <Link 
                href={`/thon-thong-minh?khuVuc=${encodeURIComponent(khuVuc.name)}`}
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors"
              >
                Xem bản đồ
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
