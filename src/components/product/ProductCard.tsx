"use client";

import Link from "next/link";
import { ShoppingCart, Package, Zap } from "lucide-react";
import { useCartStore } from "@/features/cart/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    short_description?: string | null;
    badge?: string | null;
    category?: { name: string; parentName?: string } | null;
    variants?: { id: string; name: string; price: number; original_price?: number | null; stock: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const variants = product.variants || [];
  const lowestPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
  const originalPrice = variants.length > 0
    ? variants.reduce((max, v) => Math.max(max, v.original_price || 0), 0)
    : 0;
  const hasDiscount = originalPrice > 0 && originalPrice > lowestPrice;
  const discountPct = hasDiscount ? Math.round((1 - lowestPrice / originalPrice) * 100) : 0;
  let categoryName = product.category?.name || "Thực phẩm chức năng";
  if (product.category?.parentName) {
    categoryName = `${product.category.parentName} > ${categoryName}`;
  }
  const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const firstVariant = variants[0];
  const inStock = firstVariant && firstVariant.stock > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || !inStock) { toast.error("Sản phẩm tạm hết hàng."); return; }
    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: firstVariant.name,
      price: firstVariant.price,
      quantity: 1,
      stock: firstVariant.stock,
      imageUrl: product.image_url || undefined,
    });
    toast.success(`Đã thêm "${product.name}" vào giỏ!`);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block p-6 pb-0">
        <div className="relative aspect-square mb-5 bg-surface rounded-xl overflow-hidden flex items-center justify-center">
          {product.image_url ? (
            <img className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" src={product.image_url} alt={product.name} />
          ) : (
            <Package className="w-16 h-16 text-outline-variant/30" />
          )}
          {product.badge && (
            <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
              product.badge.includes("-") ? "bg-error text-white" :
              product.badge === "Mới" ? "bg-primary text-white" :
              "bg-tertiary-container text-on-surface"
            }`}>
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 right-3 text-[10px] font-black text-white bg-error px-2 py-1 rounded-full shadow-sm">-{discountPct}%</span>
          )}
        </div>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{categoryName}</p>
        <h4 className="font-heading font-bold text-base text-on-surface mb-1 line-clamp-2 leading-snug">{product.name}</h4>
        {product.short_description && (
          <p className="text-xs text-on-surface-variant mb-2 line-clamp-2">{product.short_description}</p>
        )}
      </Link>

      {/* Giá + Nút */}
      <div className="px-6 pb-5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] text-on-surface-variant line-through">{fmtVND(originalPrice)}</span>
            )}
            <span className="text-lg font-black text-primary">
              {lowestPrice > 0 ? fmtVND(lowestPrice) : "Liên hệ"}
            </span>
          </div>
          {lowestPrice > 0 && inStock && (
            <button
              onClick={handleQuickAdd}
              title="Thêm nhanh vào giỏ"
              className="w-11 h-11 rounded-full glossy-gradient text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
