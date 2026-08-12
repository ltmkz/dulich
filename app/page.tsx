import Link from "next/link";
import { Compass, MapPin, Map as MapIcon, QrCode, Route as RouteIcon, ShieldCheck, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20">
            <Compass className="h-6 w-6" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight hidden sm:block">
            Đoàn Thanh Niên Khe Sanh
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600 font-medium">Đăng Nhập</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-primary text-sm font-medium mb-8 border border-blue-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Dự án Công trình Thanh niên số hóa
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Số Hóa Di Tích & <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Du Lịch Địa Phương
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Khám phá lịch sử và văn hóa địa phương thông qua mã QR thông minh.
          Xây dựng cơ sở dữ liệu số hóa các di tích lịch sử, địa chỉ đỏ và tuyến đường tham quan trực quan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/admin/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 rounded-xl">
              <ShieldCheck className="h-5 w-5" /> Quản Trị Hệ Thống
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-white hover:bg-slate-50 transition-all gap-2 rounded-xl border-slate-200">
              <LogIn className="h-5 w-5 text-slate-500" /> Đăng Nhập Quản Lý
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 w-full animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          {[
            {
              icon: MapPin,
              title: "Điểm Di Tích",
              desc: "Thông tin lịch sử chi tiết, hình ảnh và vị trí.",
              color: "text-blue-600",
              bg: "bg-blue-100"
            },
            {
              icon: MapIcon,
              title: "Bản Đồ Trực Quan",
              desc: "Hiển thị vị trí tọa độ trực quan trên bản đồ.",
              color: "text-emerald-600",
              bg: "bg-emerald-100"
            },
            {
              icon: QrCode,
              title: "Quét Mã QR",
              desc: "Truy cập thông tin cực nhanh từ điện thoại.",
              color: "text-purple-600",
              bg: "bg-purple-100"
            },
            {
              icon: RouteIcon,
              title: "Tuyến Đường",
              desc: "Gắn kết các điểm thành tuyến tham quan.",
              color: "text-amber-600",
              bg: "bg-amber-100"
            },
          ].map((f, idx) => (
            <Card key={idx} className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-left flex flex-col gap-3">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-2`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-slate-800">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
