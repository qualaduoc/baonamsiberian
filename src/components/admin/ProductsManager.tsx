"use client";

import {
  createProductAction, updateProductAction, deleteProductAction,
  createVariantAction, updateVariantAction, deleteVariantAction,
  createCategoryAction
} from "@/app/actions/adminActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Loader2, Box, Tag, Pencil, X, Save, Eye, EyeOff } from "lucide-react";
import { toSlug } from "@/utils/toSlug";

interface Category { id: string; name: string; slug: string }
interface Variant { id: string; name: string; price: number; original_price: number | null; stock: number }
interface Product { id: string; name: string; slug: string; description: string | null; short_description: string | null; image_url: string | null; badge: string | null; is_active: boolean; category: Category | null; variants: Variant[] }

interface Props { products: Product[]; categories: Category[] }

export default function ProductsManager({ products, categories }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [variantForId, setVariantForId] = useState<string | null>(null);
  const [editVariantId, setEditVariantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSlug, setNewProductSlug] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const handleAction = async (action: (fd: FormData) => Promise<any>, e: React.FormEvent<HTMLFormElement>, msg: string, resetFn?: () => void) => {
    e.preventDefault();
    setLoading(true);
    const res = await action(new FormData(e.currentTarget));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success(msg); resetFn?.(); router.refresh(); }
  };

  return (
    <div>
      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => setShowNew(!showNew)} className="btn-primary flex items-center gap-2 !py-3 !px-5 !rounded-xl cursor-pointer"><Plus className="w-4 h-4" /> Thêm Sản Phẩm</button>
        <button onClick={() => setShowCat(!showCat)} className="btn-secondary flex items-center gap-2 !py-3 !px-5 !rounded-xl cursor-pointer"><Tag className="w-4 h-4" /> Thêm Danh Mục</button>
      </div>

      {/* Form Danh Mục + Danh Mục Con */}
      {showCat && (
        <form onSubmit={(e) => handleAction(createCategoryAction, e, "Tạo danh mục thành công!", () => { setShowCat(false); setNewCatName(""); setNewCatSlug(""); })} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 mb-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Tạo Danh Mục Mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="catName" required placeholder="Tên danh mục *" className="input"
              value={newCatName}
              onChange={(e) => { setNewCatName(e.target.value); setNewCatSlug(toSlug(e.target.value)); }}
            />
            <input
              name="catSlug" required placeholder="Slug (tự tạo)" className="input text-outline"
              value={newCatSlug}
              onChange={(e) => setNewCatSlug(e.target.value)}
            />
            <select name="parentId" className="input">
              <option value="">— Không có danh mục cha (gốc) —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>↳ {c.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-4 !py-2 !px-6 !rounded-lg cursor-pointer">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu Danh Mục"}</button>
        </form>
      )}

      {/* Form Tạo SP Mới */}
      {showNew && (
        <form onSubmit={(e) => handleAction(createProductAction, e, "Tạo sản phẩm thành công!", () => { setShowNew(false); setNewProductName(""); setNewProductSlug(""); })} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 mb-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Tạo Sản Phẩm Mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="name" required placeholder="Tên sản phẩm *" className="input"
              value={newProductName}
              onChange={(e) => { setNewProductName(e.target.value); setNewProductSlug(toSlug(e.target.value)); }}
            />
            <input
              name="slug" required placeholder="Slug (tự tạo từ tên)" className="input text-outline"
              value={newProductSlug}
              onChange={(e) => setNewProductSlug(e.target.value)}
            />
            <select name="categoryId" className="input"><option value="">-- Chọn danh mục --</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input name="imageUrl" placeholder="URL ảnh sản phẩm" className="input" />
          </div>

          {/* GIÁ & KHO — Nhập ngay khi tạo SP */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4">
            <h4 className="font-bold text-sm text-primary mb-3 uppercase tracking-wider">💰 Thiết Lập Giá Bán</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input name="price" type="number" required placeholder="Giá bán *" className="input !py-2" />
              <input name="stock" type="number" defaultValue={100} placeholder="Tồn kho" className="input !py-2" />
              <input name="variantName" placeholder="Quy cách (VD: Hộp 30 viên)" className="input !py-2" defaultValue="Mặc định" />
            </div>
          </div>

          <textarea name="description" placeholder="Mô tả chi tiết công dụng sản phẩm..." className="input w-full min-h-[80px] resize-y" />
          <button type="submit" disabled={loading} className="btn-primary mt-4 !py-2 !px-6 !rounded-lg cursor-pointer">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo Sản Phẩm"}</button>
        </form>
      )}

      {/* Danh sách SP */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
          <Box className="w-12 h-12 mx-auto text-outline-variant/30 mb-4" /><h3 className="text-xl font-semibold text-on-surface">Chưa có sản phẩm!</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-6">
              {/* Header SP */}
              {editId === p.id ? (
                <form onSubmit={(e) => handleAction(updateProductAction, e, "Cập nhật thành công!", () => setEditId(null))} className="space-y-4">
                  <input type="hidden" name="id" value={p.id} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input name="name" defaultValue={p.name} className="input" placeholder="Tên SP" required />
                    <input name="slug" defaultValue={p.slug} className="input" placeholder="Slug" />
                    <select name="categoryId" defaultValue={p.category?.id || ""} className="input"><option value="">-- Danh mục --</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                    <input name="badge" defaultValue={p.badge || ""} className="input" placeholder="Nhãn (Bán chạy, -20%...)" />
                    <input name="imageUrl" defaultValue={p.image_url || ""} className="input" placeholder="URL ảnh" />
                    <input name="short_description" defaultValue={p.short_description || ""} className="input" placeholder="Mô tả ngắn" />
                    <select name="is_active" defaultValue={String(p.is_active)} className="input">
                      <option value="true">✅ Đang bán</option>
                      <option value="false">🚫 Ẩn sản phẩm</option>
                    </select>
                  </div>
                  <textarea name="description" defaultValue={p.description || ""} className="input w-full min-h-[60px] resize-y" placeholder="Mô tả chi tiết" />
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="btn-primary !py-2 !px-5 !rounded-lg text-sm cursor-pointer flex items-center gap-1"><Save className="w-3 h-3" /> Lưu</button>
                    <button type="button" onClick={() => setEditId(null)} className="btn-secondary !py-2 !px-5 !rounded-lg text-sm cursor-pointer flex items-center gap-1"><X className="w-3 h-3" /> Huỷ</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {p.image_url ? <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-outline-variant/10" /> : <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center"><Box className="w-6 h-6 text-primary/30" /></div>}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-on-surface">{p.name}</h3>
                        {!p.is_active && <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-full font-bold">ẨN</span>}
                        {p.badge && <span className="text-[10px] bg-tertiary-container text-on-surface px-2 py-0.5 rounded-full font-bold">{p.badge}</span>}
                      </div>
                      <span className="text-xs text-outline font-mono">/{p.slug}</span>
                      {p.category && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{p.category.name}</span>}
                      {p.short_description && <p className="text-xs text-on-surface-variant mt-1">{p.short_description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(p.id)} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1"><Pencil className="w-3 h-3" /> Sửa</button>
                    <button onClick={() => setVariantForId(variantForId === p.id ? null : p.id)} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1"><Plus className="w-3 h-3" /> Giá</button>
                    <button onClick={async () => { if (confirm(`Chắc chắn xoá "${p.name}"?`)) { const r = await deleteProductAction(p.id); r?.error ? toast.error(r.error) : (toast.success("Đã xoá."), router.refresh()); }}} className="p-2 text-error hover:bg-error/5 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              )}

              {/* Form thêm biến thể */}
              {variantForId === p.id && (
                <form onSubmit={(e) => handleAction(createVariantAction, e, "Thêm giá thành công!", () => setVariantForId(null))} className="bg-surface p-4 rounded-xl mb-4 border border-outline-variant/10">
                  <input type="hidden" name="productId" value={p.id} />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <input name="variantName" required placeholder="Tên (Hộp 30 viên)" className="input !py-2" />
                    <input name="price" type="number" required placeholder="Giá bán" className="input !py-2" />
                    <input name="stock" type="number" required placeholder="Tồn kho" className="input !py-2" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary mt-3 !py-2 !px-5 !rounded-lg text-sm cursor-pointer">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu Giá"}</button>
                </form>
              )}

              {/* Biến thể */}
              {p.variants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {p.variants.map((v) => (
                    <div key={v.id}>
                      {editVariantId === v.id ? (
                        <form onSubmit={(e) => handleAction(updateVariantAction, e, "Đã cập nhật!", () => setEditVariantId(null))} className="bg-surface p-3 rounded-xl border border-primary/20 space-y-2">
                          <input type="hidden" name="variantId" value={v.id} />
                          <input name="variantName" defaultValue={v.name} className="input !py-1.5 w-full text-sm" />
                          <div className="grid grid-cols-3 gap-2">
                            <input name="price" type="number" defaultValue={v.price} className="input !py-1.5 text-sm" placeholder="Giá bán" />
                            <input name="original_price" type="number" defaultValue={v.original_price || ""} className="input !py-1.5 text-sm" placeholder="Giá gốc" />
                            <input name="stock" type="number" defaultValue={v.stock} className="input !py-1.5 text-sm" placeholder="Kho" />
                          </div>
                          <div className="flex gap-1">
                            <button type="submit" className="text-xs btn-primary !py-1 !px-3 !rounded cursor-pointer">Lưu</button>
                            <button type="button" onClick={() => setEditVariantId(null)} className="text-xs btn-secondary !py-1 !px-3 !rounded cursor-pointer">Huỷ</button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between items-center bg-surface px-4 py-3 rounded-xl border border-outline-variant/10 group">
                          <div>
                            <span className="font-medium text-on-surface text-sm">{v.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-primary text-sm">{fmtVND(v.price)}</span>
                              {v.original_price && <span className="text-xs text-outline line-through">{fmtVND(v.original_price)}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-outline">Kho: {v.stock}</span>
                            <button onClick={() => setEditVariantId(v.id)} className="opacity-0 group-hover:opacity-100 p-1 text-primary hover:bg-primary/5 rounded cursor-pointer transition-all"><Pencil className="w-3 h-3" /></button>
                            <button onClick={async () => { if (confirm("Xoá giá này?")) { const r = await deleteVariantAction(v.id); r?.error ? toast.error(r.error) : (toast.success("Đã xoá."), router.refresh()); }}} className="opacity-0 group-hover:opacity-100 p-1 text-error hover:bg-error/5 rounded cursor-pointer transition-all"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
