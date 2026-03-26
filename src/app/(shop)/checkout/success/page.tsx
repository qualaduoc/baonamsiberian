import Link from "next/link";
import { CheckCircle2, ArrowRight, Truck, Mail, PhoneCall } from "lucide-react";

export const metadata = {
  title: "Bảo Nam | Đặt Hàng Thành Công",
};

interface SuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams?.orderId 
     ? String(resolvedParams.orderId) 
     : "UNKNOWN_ORDER_ID";

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-20 relative font-sans">
      
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cta/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="bg-surface relative z-10 w-full max-w-2xl rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-primary/5 flex flex-col items-center text-center">
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
          <CheckCircle2 className="w-12 h-12 text-cta absolute" />
          <div className="w-full h-full border-4 border-cta/20 rounded-full animate-ping opacity-50"></div>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold font-heading text-text mb-4 text-cta">Đặt Hàng Xuất Sắc!</h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto mb-8">
          Đơn hàng <span className="font-mono bg-gray-100 px-2 py-1 flex-inline rounded text-primary">{orderId}</span> của bạn đã được ghi nhận. 
          Bộ phận kho đang bắt đầu xử lý đóng gói và bàn giao cho đơn vị vận chuyển.
        </p>

        <div className="w-full flex flex-col sm:flex-row justify-center gap-6 p-6 bg-primary/5 rounded-2xl mb-10 border border-primary/10">
           <div className="flex flex-col items-center gap-2">
             <Truck className="w-6 h-6 text-primary" />
             <span className="text-sm font-semibold uppercase text-text tracking-wide">Nhận Hàng (1-3 Ngày)</span>
           </div>
           <div className="hidden sm:block w-[1px] h-10 bg-primary/20"></div>
           <div className="flex flex-col items-center gap-2">
             <PhoneCall className="w-6 h-6 text-primary" />
             <span className="text-sm font-semibold uppercase text-text tracking-wide">Xác Nhận Qua ĐT</span>
           </div>
           <div className="hidden sm:block w-[1px] h-10 bg-primary/20"></div>
           <div className="flex flex-col items-center gap-2">
             <Mail className="w-6 h-6 text-primary" />
             <span className="text-sm font-semibold uppercase text-text tracking-wide">Nhận Hoá Đơn Email</span>
           </div>
        </div>

        <Link href="/shop" className="btn-primary flex items-center justify-center gap-3 py-4 px-10 text-lg rounded-2xl uppercase tracking-wider font-bold shadow-[0_8px_30px_rgb(5,150,105,0.3)] hover:-translate-y-1 transition-all">
          XEM THÊM SẢN PHẨM KHÁC <ArrowRight className="w-6 h-6" />
        </Link>
      </div>

    </div>
  );
}
