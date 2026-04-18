"use client";

import { useForm } from "react-hook-form";
import { useHydratedCart } from "@/features/cart/useHydratedCart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { processCheckout } from "@/app/actions/checkoutAction";
import toast from "react-hot-toast";
import { User, Phone, MapPin, Truck, CheckCircle2 } from "lucide-react";

type FormValues = {
  fullName: string;
  phone1: string;
  phone2: string;
  address: string;
};

export default function CheckoutForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const { isHydrated, items, clearCart, getTotalPrice } = useHydratedCart();
  const router = useRouter();

  if (!isHydrated) return null;

  const total = getTotalPrice();

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast.error('Giao dịch lỗi: Giỏ hàng trống.');
      return;
    }

    setLoading(true);
    const tsToast = toast.loading("Đang xử lý đơn hàng...");
    
    try {
      // Đóng gói FormData bảo mật cho Server Action
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone1", data.phone1);
      formData.append("phone2", data.phone2 || "");
      formData.append("address", data.address);
      
      const itemsData = items.map(i => ({ variantId: i.variantId, quantity: i.quantity }));
      
      // Gọi Server Action (Đảm bảo giá trị lấy trên Server không lấy ở Client)
      const res = await processCheckout(formData, JSON.stringify(itemsData));
      
      if (res?.error) {
         toast.error(res.error, { id: tsToast });
         setLoading(false);
      } else if (res?.success) {
         clearCart();
         toast.success('Đặt hàng xuất sắc! Đơn hàng đã ghi nhận.', { id: tsToast });
         router.push(`/checkout/success?orderId=${res.orderId}`);
      }
    } catch (error) {
       toast.error("Lỗi mất kết nối máy chủ. Vui lòng thử lại.", { id: tsToast });
       setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Form Đặt Hàng (Cột Trái) */}
      <div className="col-span-1 lg:col-span-7 bg-surface p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/5">
        <h2 className="text-2xl font-bold font-heading text-text mb-6">Thông Tin Giao Hàng</h2>
        
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
           <div className="flex flex-col gap-2 relative border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <User className="w-3 h-3"/> Họ và Tên (Bat buộc)
             </label>
             <input 
               {...register("fullName", { required: "Vui lòng nhập họ tên" })}
               className="bg-transparent border-none outline-none text-text text-base w-full"
               placeholder="Nhập đầy đủ họ và tên..."
             />
             {errors.fullName && <span className="absolute -bottom-6 left-0 text-sm text-rose-500">{errors.fullName.message}</span>}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
             <div className="flex flex-col gap-2 relative border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <Phone className="w-3 h-3"/> SĐT Liên Hệ (Bắt buộc)
               </label>
               <input 
                 {...register("phone1", { 
                    required: "Vui lòng nhập số điện thoại",
                    pattern: { value: /^[0-9]{10,11}$/, message: "SĐT không hợp lệ (10-11 số)" }
                 })}
                 className="bg-transparent border-none outline-none text-text text-base w-full"
                 placeholder="VD: 0988..."
               />
               {errors.phone1 && <span className="absolute -bottom-6 left-0 text-sm text-rose-500">{errors.phone1.message}</span>}
             </div>
             
             <div className="flex flex-col gap-2 relative border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Phone className="w-3 h-3"/> SĐT Dự Phòng
               </label>
               <input 
                 {...register("phone2")}
                 className="bg-transparent border-none outline-none text-text text-base w-full"
                 placeholder="VD: 0912..."
               />
             </div>
           </div>

           <div className="flex flex-col gap-2 relative border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 mt-2 transition-all">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3"/> Địa Chỉ Giao Hàng (Bắt buộc)
             </label>
             <textarea 
               {...register("address", { required: "Vui lòng nhập địa chỉ gồm Xã/Phường, Quận/Huyện, Tỉnh" })}
               className="bg-transparent border-none outline-none text-text text-base w-full min-h-[80px] resize-none"
               placeholder="Nhập số nhà, tên đường, Thôn Xóm, Quận Huyện, Thành Phố..."
             />
             {errors.address && <span className="absolute -bottom-6 left-0 text-sm text-rose-500">{errors.address.message}</span>}
           </div>
        </form>

        <div className="mt-8 flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
           <Truck className="w-6 h-6 text-blue-500 flex-shrink-0" />
           <p className="text-sm text-blue-700 leading-relaxed">
             Bộ phận kho sẽ lập tức xử lý và đóng gói theo chuẩn vệ sinh an toàn. Thông thường 
             hàng sẽ tới tay quý khách trong vòng 2 - 3 ngày làm việc tuỳ khu vực.
           </p>
        </div>
      </div>

      {/* Tóm tắt Đơn Hàng (Cột Phải) */}
      <div className="col-span-1 lg:col-span-5 bg-background border border-primary/10 rounded-3xl p-8 sticky top-28 h-max shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
         <h2 className="text-2xl font-bold font-heading text-text mb-6">Tóm Tắt Khách Đặt</h2>
         
         <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
           {items.map((item) => (
             <div key={item.variantId} className="flex gap-4 justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex gap-3 items-center">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded-lg" />}
                  <div className="flex flex-col">
                    <span className="font-semibold text-text text-sm line-clamp-1">{item.productName}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">
                      Phân loại: {item.variantName} x {item.quantity}
                    </span>
                    {item.orderCode && (
                      <span className="text-[10px] font-mono text-primary bg-primary/5 px-1 py-0.5 mt-1 rounded w-max font-bold">
                        MÃ SP: {item.orderCode}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-bold text-cta text-sm">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                </span>
             </div>
           ))}
         </div>

         <div className="border-t border-gray-200 pt-6 flex flex-col gap-3 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Thành tiền:</span>
              <span className="font-bold text-text">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí Vận Chuyển:</span>
              <span className="font-bold text-cta">0₫ (Miễn Phí Toàn Quốc)</span>
            </div>
            <div className="flex justify-between items-center text-lg md:text-xl font-bold border-t border-gray-100 pt-3 mt-1 tracking-tight">
              <span>Tổng Cộng:</span>
              <span className="text-3xl font-heading text-cta">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
            </div>
         </div>

         <button 
           type="submit" 
           form="checkout-form"
           disabled={loading || items.length === 0}
           className="btn-primary w-full flex justify-center items-center gap-2 py-4 text-base uppercase font-bold tracking-widest shadow-[0_8px_30px_rgb(5,150,105,0.2)] disabled:opacity-70 disabled:grayscale cursor-pointer"
         >
           {loading ? 'Đang Xử Lý...' : (
             <>Hoàn Tất Đặt Hàng <CheckCircle2 className="w-5 h-5" /></>
           )}
         </button>
         
         <p className="text-center text-xs mt-4 text-gray-400">
           Thanh toán bằng tiền mặt khi nhận hàng (COD). <br/> Hoặc chuyển khoản qua mã QR đính kèm sau khi đặt.
         </p>
      </div>
    </div>
  );
}
