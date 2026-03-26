import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[180px] md:text-[220px] font-heading font-black text-primary/5 leading-none select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl glossy-gradient flex items-center justify-center shadow-2xl shadow-primary/20 rotate-12">
              <Search className="w-12 h-12 text-white -rotate-12" />
            </div>
          </div>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-on-surface mb-4">
          Ôi! Trang Không Tồn Tại
        </h1>
        <p className="text-on-surface-variant text-lg mb-10 leading-relaxed max-w-md mx-auto">
          Có vẻ đường dẫn bạn truy cập đã bị thay đổi hoặc không còn tồn tại. Hãy quay lại để tiếp tục khám phá sản phẩm nhé!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 rounded-full glossy-gradient text-white font-bold text-base shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Về Trang Chủ
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 rounded-full border border-outline-variant/30 text-primary font-bold text-base hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Cửa Hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
