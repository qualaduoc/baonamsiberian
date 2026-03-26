"use client";

import { useHydratedCart } from '@/features/cart/useHydratedCart';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { isHydrated, items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useHydratedCart();

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="animate-spin text-primary rounded-full border-t-2 border-b-2 border-primary w-12 h-12"></div>
      </div>
    );
  }

  const total = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 rotate-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/5">
           <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-4xl font-bold font-heading text-text mb-4 text-center">Giỏ Hàng Trống</h2>
        <p className="text-gray-500 text-lg mb-10 text-center max-w-md leading-relaxed">
          Hiện tại bạn chưa chọn mua sản phẩm thảo dược nào. Hãy dạo quanh cửa hàng để tìm giải pháp phù hợp nhé.
        </p>
        <Link href="/shop" className="btn-primary shadow-[0_4px_20px_rgba(5,150,105,0.3)] min-w-[200px] text-center uppercase tracking-wide">
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl lg:text-5xl font-bold font-heading text-text tracking-tight">
            Giỏ Hàng Của Bạn <span className="text-primary/40 font-normal">({totalItems})</span>
          </h1>
          <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-cta transition-colors text-sm font-semibold uppercase tracking-wide">
            <ArrowLeft className="w-4 h-4" /> Mua thêm sản phẩm
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Danh Sách Sản Phẩm (Bên Trái) */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <div className="bg-surface rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/5">
              
              {/* Table Header (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-widest">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-3 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Tạm tính</div>
              </div>

              {/* Items */}
              <div className="flex flex-col divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.variantId} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center group">
                    
                    {/* Ảnh & Tên */}
                    <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                       <Link href={`/product/${item.productId}`} className="w-24 h-24 bg-primary/5 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                         {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         ) : (
                           <HeartPulse className="w-8 h-8 text-primary/20" />
                         )}
                       </Link>
                       <div className="flex flex-col gap-1">
                         <h3 className="font-bold text-lg text-text hover:text-primary transition-colors line-clamp-2">
                           {item.productName}
                         </h3>
                         <span className="text-sm bg-background border border-gray-100 px-3 py-1 rounded-full w-max text-gray-500 uppercase font-medium text-xs">
                           Phân loại: {item.variantName}
                         </span>
                         <span className="text-primary font-bold mt-2 md:hidden">
                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                         </span>
                       </div>
                    </div>

                    {/* Số Lượng */}
                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                       <div className="flex items-center justify-between bg-background border border-gray-200 rounded-xl px-1 w-[120px]">
                         <button 
                           onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                           disabled={item.quantity <= 1}
                           className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                         >
                           <Minus className="w-4 h-4" />
                         </button>
                         <span className="text-base font-bold text-text">{item.quantity}</span>
                         <button 
                           onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                           disabled={item.quantity >= item.stock}
                           className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                       </div>
                    </div>

                    {/* Tổng tiền & Xoá */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-6 text-right">
                       <span className="font-bold text-xl text-text hidden md:block">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                       </span>
                       <button 
                         onClick={() => removeItem(item.variantId)}
                         className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Box (Bên Phải) */}
          <div className="lg:w-1/3">
            <div className="bg-surface rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/5 sticky top-28">
               <h2 className="text-2xl font-bold font-heading text-text mb-8 border-b border-primary/10 pb-4">Đơn Hàng Ước Tính</h2>
               
               <div className="flex flex-col gap-4 text-gray-600 mb-8">
                 <div className="flex justify-between items-center text-lg">
                   <span>Tổng phụ:</span>
                   <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                 </div>
                 <div className="flex justify-between items-center text-lg">
                   <span>Phí giao hàng:</span>
                   <span className="font-medium text-cta bg-cta/10 px-3 py-1 rounded-full text-sm uppercase">Miễn phí toàn quốc</span>
                 </div>
                 <div className="flex justify-between items-center text-lg">
                   <span>Chiết khấu:</span>
                   <span className="font-medium text-gray-400">0₫</span>
                 </div>
               </div>

               <div className="flex justify-between items-end border-t border-gray-100 pt-6 mb-8">
                 <span className="text-xl font-bold text-text">Tổng tiền:</span>
                 <span className="text-4xl font-bold text-cta drop-shadow-sm font-heading">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                 </span>
               </div>

               <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-5 !rounded-2xl shadow-[0_4px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)] transition-all uppercase tracking-wider group cursor-pointer">
                 Tiến Hành Đặt Hàng <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <p className="text-center text-xs text-gray-400 mt-6 flex flex-col gap-2">
                 <span>Hỗ trợ mọi phương thức chuyển khoản hoặc tiền mặt khi nhận hàng (COD).</span>
                 <span className="text-primary font-medium">Bảo mật thông tin thanh toán tuyệt đối.</span>
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
