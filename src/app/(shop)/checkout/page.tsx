import CheckoutForm from "@/components/checkout/CheckoutForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Bảo Nam | Tiến Hành Đặt Hàng",
  description: "Xác nhận và nhập thông tin giao hàng."
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:text-cta mb-8 transition-colors bg-primary/5 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Trở Lại Sửa Giỏ
        </Link>
        
        <CheckoutForm />
        
      </div>
    </div>
  );
}
