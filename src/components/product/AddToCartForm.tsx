"use client";

import { useState } from "react";
import { useCartStore } from "@/features/cart/cartStore";
import { Product } from "@/services/productService";
import { Minus, Plus, ShoppingCart, Zap, Info, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
}

export default function AddToCartForm({ product }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants?.[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const handleDecrease = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const handleIncrease = () => { if (selectedVariant && quantity < selectedVariant.stock) setQuantity(quantity + 1); };

  const doAddToCart = () => {
    if (!selectedVariant) { toast.error("Vui lòng chọn phân loại sản phẩm."); return false; }
    if (selectedVariant.stock < 1) { toast.error("Sản phẩm tạm thời hết hàng."); return false; }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity,
      stock: selectedVariant.stock,
      imageUrl: product.image_url || undefined,
    });
    return true;
  };

  const handleAddToCart = () => {
    if (doAddToCart()) {
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (doAddToCart()) {
      toast.success("Đang chuyển đến trang thanh toán...");
      router.push("/cart");
    }
  };

  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="mt-10 p-8 bg-amber-50 border border-amber-200 rounded-2xl">
        <p className="text-amber-700 font-semibold text-lg flex items-center gap-2">
          <Info className="w-6 h-6" /> Sản phẩm đang cập nhật giá. Liên hệ ngay để được tư vấn!
        </p>
        <a href="tel:0123456789" className="mt-4 inline-block btn-primary !py-3 !px-8 !rounded-xl text-base">📞 Gọi Ngay: 0123.456.789</a>
      </div>
    );
  }

  const hasDiscount = selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price;
  const discountPct = hasDiscount ? Math.round((1 - selectedVariant!.price / selectedVariant!.original_price!) * 100) : 0;
  const totalPrice = selectedVariant ? selectedVariant.price * quantity : 0;

  return (
    <div className="mt-10 flex flex-col gap-8">

      {/* ===== KHỐI GIÁ LỚN ===== */}
      <div className="bg-gradient-to-br from-primary/5 to-surface border-2 border-primary/15 rounded-3xl p-8 sm:p-10">
        {/* Giá nổi bật */}
        <div className="flex items-baseline gap-4 flex-wrap mb-2">
          <span className="text-5xl sm:text-6xl font-black font-heading text-primary tracking-tight leading-none">
            {selectedVariant ? fmtVND(selectedVariant.price) : "---"}
          </span>
          {hasDiscount && (
            <>
              <span className="text-on-surface-variant line-through text-xl">{fmtVND(selectedVariant!.original_price!)}</span>
              <span className="text-sm font-black text-white bg-error px-3 py-1.5 rounded-full animate-pulse shadow-md shadow-error/20">GIẢM {discountPct}%</span>
            </>
          )}
        </div>
        {selectedVariant && (
          <p className="text-on-surface-variant text-sm">Giá đã bao gồm VAT · Miễn phí giao hàng toàn quốc</p>
        )}
      </div>

      {/* ===== CHỌN QUY CÁCH ===== */}
      {product.variants.length > 0 && (
        <div className="flex flex-col gap-4">
          <label className="font-bold text-on-surface text-base uppercase tracking-wider flex items-center gap-2">
            📦 Chọn Quy Cách
            <span className="text-xs font-normal text-on-surface-variant normal-case tracking-normal">({product.variants.length} lựa chọn)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => { setSelectedVariantId(v.id); setQuantity(1); }}
                className={`relative p-5 rounded-2xl font-medium transition-all duration-200 border-2 cursor-pointer text-left
                  ${selectedVariantId === v.id
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                    : "border-outline-variant/15 bg-surface-container-lowest hover:border-primary/30 hover:shadow-md"
                  }
                  ${v.stock < 1 ? "opacity-40 !cursor-not-allowed !border-error/20 !bg-error/5" : ""}
                `}
                disabled={v.stock < 1}
              >
                {selectedVariantId === v.id && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
                <span className="block text-base font-bold text-on-surface">{v.name}</span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-lg font-black text-primary">{fmtVND(v.price)}</span>
                  {v.original_price && v.original_price > v.price && (
                    <span className="text-xs font-bold text-on-surface-variant line-through">{fmtVND(v.original_price)}</span>
                  )}
                </div>
                {v.stock < 1 ? (
                  <span className="block text-xs text-error font-bold mt-1">Hết hàng</span>
                ) : (
                  <span className="block text-xs text-on-surface-variant mt-1">Còn {v.stock} sản phẩm</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== SỐ LƯỢNG ===== */}
      <div className="flex flex-col gap-3">
        <label className="font-bold text-on-surface text-base uppercase tracking-wider">🔢 Số Lượng</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-lowest border-2 border-outline-variant/20 rounded-2xl overflow-hidden">
            <button onClick={handleDecrease} disabled={quantity <= 1} className="px-5 py-4 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-30 border-r border-outline-variant/15"><Minus className="w-6 h-6" /></button>
            <span className="text-2xl font-black w-20 text-center text-on-surface tabular-nums">{quantity}</span>
            <button onClick={handleIncrease} disabled={selectedVariant ? quantity >= selectedVariant.stock : true} className="px-5 py-4 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-30 border-l border-outline-variant/15"><Plus className="w-6 h-6" /></button>
          </div>
          {selectedVariant && quantity > 1 && (
            <div className="bg-primary/5 px-4 py-2 rounded-xl">
              <span className="text-sm text-on-surface-variant">Tổng: </span>
              <span className="text-lg font-black text-primary">{fmtVND(totalPrice)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== NÚT MUA HÀNG ===== */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleBuyNow}
          disabled={!selectedVariant || selectedVariant.stock < 1}
          className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl glossy-gradient text-white font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 hover:shadow-primary/40 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-7 h-7" /> MUA NGAY
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock < 1}
          className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 border-primary text-primary font-bold text-lg uppercase tracking-wider hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-6 h-6" /> Thêm Vào Giỏ Hàng
        </button>
      </div>

      {/* ===== CAM KẾT ===== */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Truck className="w-6 h-6 text-primary" /></div>
          <span className="text-xs font-bold text-on-surface leading-tight">Giao Hàng<br/>Miễn Phí</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-primary" /></div>
          <span className="text-xs font-bold text-on-surface leading-tight">Chính Hãng<br/>100%</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><RotateCcw className="w-6 h-6 text-primary" /></div>
          <span className="text-xs font-bold text-on-surface leading-tight">Đổi Trả<br/>7 Ngày</span>
        </div>
      </div>

    </div>
  );
}
