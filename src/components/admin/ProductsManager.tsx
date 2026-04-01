"use client";

import {
  createProductAction, updateProductAction, deleteProductAction,
  createVariantAction, updateVariantAction, deleteVariantAction,
  createCategoryAction
} from "@/app/actions/adminActions";
import { scrapeSiberianAction } from "@/app/actions/scraperAction";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Loader2, Box, Tag, Pencil, X, Save, Eye, EyeOff, DownloadCloud } from "lucide-react";
import { toSlug } from "@/utils/toSlug";

interface Category { id: string; name: string; slug: string; parent_id?: string | null }
interface Variant { id: string; name: string; price: number; original_price: number | null; stock: number }
interface Product { id: string; name: string; slug: string; description: string | null; short_description: string | null; image_url: string | null; badge: string | null; is_active: boolean; category: Category | null; variants: Variant[] }

interface Props { products: Product[]; categories: Category[] }

export default function ProductsManager({ products, categories }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [variantForId, setVariantForId] = useState<string | null>(null);
  const [editVariantId, setEditVariantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSlug, setNewProductSlug] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Scraper states
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapedOriginalPrice, setScrapedOriginalPrice] = useState("");
  const [scrapedImage, setScrapedImage] = useState("");
  const [scrapedDesc, setScrapedDesc] = useState("");

  const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const buildTree = (cats: Category[], parentId: string | null = null, depth: number = 0): (Category & { depth: number })[] => {
    return cats.filter(c => (c.parent_id || null) === parentId).flatMap(c => [{ ...c, depth }, ...buildTree(cats, c.id, depth + 1)]);
  };
  const treeCategories = buildTree(categories);

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategoryId === "ALL" || p.category?.id === selectedCategoryId;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-white bg-error";
    if (stock <= 10) return "text-[#9a3412] bg-[#ffedd5] border border-[#fdba74]";
    return "text-success bg-success/10 border border-success/20";
  };

  const handleAction = async (action: (fd: FormData) => Promise<any>, e: React.FormEvent<HTMLFormElement>, msg: string, resetFn?: () => void) => {
    e.preventDefault();
    setLoading(true);
    const res = await action(new FormData(e.currentTarget));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success(msg); resetFn?.(); router.refresh(); }
  };

  const handleScrape = async () => {
    if (!scrapeUrl) return toast.error("Vui lòng nhập link cần lấy!");
    setScraping(true);
    const toastId = toast.loading("Đang bóc tách dữ liệu AI...");
    const res = await scrapeSiberianAction(scrapeUrl);
    setScraping(false);
    
    if (res?.error) {
      toast.error(res.error, { id: toastId });
    } else if (res?.data) {
      toast.success("Bóc tách thành công! Vui lòng kiểm tra lại.", { id: toastId });
      setNewProductName(res.data.name);
      setNewProductSlug(toSlug(res.data.name));
      setScrapedOriginalPrice(res.data.price?.toString() || "");
      setScrapedImage(res.data.image_url || "");
      setScrapedDesc(res.data.short_description || "");
      setScrapeUrl(""); // Clear
    }
  };

  return (
    <div>
      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => setShowNew(!showNew)} className="btn-primary flex items-center gap-2 !py-3 !px-5 !rounded-xl cursor-pointer"><Plus className="w-4 h-4" /> Thêm Sản Phẩm</button>
      </div>

      {/* Form Tạo SP Mới */}
      {showNew && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg">Tạo Sản Phẩm Mới</h3>
             <button type="button" onClick={() => setShowNew(false)} className="p-2 hover:bg-surface-container-high rounded-full"><X className="w-4 h-4" /></button>
          </div>

          {/* AI Scraper Tool */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 relative overflow-hidden">
            <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
              <DownloadCloud className="w-4 h-4" /> ⚡ Cài đặt nhanh bằng Link Sản Phẩm
            </h4>
            <div className="flex gap-2 relative z-10">
              <input 
                value={scrapeUrl} 
                onChange={(e) => setScrapeUrl(e.target.value)} 
                placeholder="Dán link sản phẩm (Siberian, Amway, Herbalife...)" 
                className="input flex-1 bg-white" 
              />
              <button 
                type="button" 
                onClick={handleScrape} 
                className="btn-primary flex items-center gap-2 whitespace-nowrap !py-2 !px-4" 
                disabled={scraping}
              >
                {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />} Rút Trích Dữ Liệu
              </button>
            </div>
            {scraping && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center font-bold text-primary animate-pulse">Đang vượt rào lấy dữ liệu...</div>}
          </div>

          <form onSubmit={(e) => handleAction(createProductAction, e, "Tạo sản phẩm thành công!", () => { 
            setShowNew(false); setNewProductName(""); setNewProductSlug(""); setScrapedOriginalPrice(""); setScrapedImage(""); setScrapedDesc(""); 
          })}>
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
              <select name="categoryId" className="input"><option value="">-- Chọn danh mục --</option>{treeCategories.map((c) => <option key={c.id} value={c.id}>{"\u00A0\u00A0".repeat(c.depth)}{c.depth > 0 ? "↳ " : ""}{c.name}</option>)}</select>
              <input 
                name="imageUrl" placeholder="URL ảnh sản phẩm" className="input" 
                value={scrapedImage} onChange={e => setScrapedImage(e.target.value)}
              />
            </div>

            {/* GIÁ & KHO — Nhập ngay khi tạo SP */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-sm text-primary mb-3 uppercase tracking-wider">💰 Thiết Lập Giá Bán</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input 
                  name="price" type="number" required placeholder="Giá bán *" className="input !py-2" 
                />
                <input 
                  name="originalPrice" type="number" placeholder="Giá gốc (Gạch ngang)" className="input !py-2" 
                  value={scrapedOriginalPrice} onChange={e => setScrapedOriginalPrice(e.target.value)}
                />
                <input name="stock" type="number" defaultValue={100} placeholder="Tồn kho" className="input !py-2" />
                <input name="variantName" placeholder="Quy cách (VD: Hộp 30 viên)" className="input !py-2" defaultValue="Mặc định" />
              </div>
            </div>

            <textarea 
              name="description" placeholder="Mô tả chi tiết công dụng sản phẩm..." className="input w-full min-h-[80px] resize-y" 
              value={scrapedDesc} onChange={e => setScrapedDesc(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary mt-4 !py-2 !px-6 !rounded-lg cursor-pointer">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu Sản Phẩm Mới"}</button>
          </form>
        </div>
      )}

      {/* Layout Danh Sách Sản Phẩm */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* SIDEBAR LỌC DANH MỤC */}
        <div className="w-full lg:w-1/4 sm:w-1/3 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-4 sticky top-4 shrink-0">
          <h3 className="font-bold text-lg mb-4 text-on-surface">📦 Bộ Lọc Danh Mục</h3>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setSelectedCategoryId("ALL")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-between
                ${selectedCategoryId === "ALL" ? "bg-primary text-on-primary shadow-md" : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"}`}
              >
                <span>Tất Cả Sản Phẩm</span>
                <span className="bg-surface/20 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">{products.length}</span>
              </button>
            </li>
            {treeCategories.map((c) => {
              const countCats = products.filter(p => p.category?.id === c.id).length;
              return (
                <li key={c.id}>
                  <button 
                    onClick={() => setSelectedCategoryId(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-between
                    ${selectedCategoryId === c.id ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"}`}
                    style={{ marginLeft: `${c.depth * 12}px`, width: `calc(100% - ${c.depth * 12}px)` }}
                  >
                    <span className="truncate pr-2">{c.depth > 0 && <span className="text-outline-variant/50 mr-1">↳</span>}{c.name}</span>
                    {countCats > 0 && <span className="bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded-md text-[10px] font-bold">{countCats}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* NỘI DUNG SẢN PHẨM BÊN PHẢI */}
        <div className="w-full lg:w-3/4 sm:w-2/3 flex-1 flex flex-col gap-4">
          
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 flex flex-col md:flex-row items-center justify-between border-b border-outline-variant/10 gap-4 bg-surface-container/20">
               <div className="font-bold text-on-surface-variant whitespace-nowrap">🔍 Quản Lý {filteredProducts.length} Sản Phẩm</div>
               <input type="text" placeholder="Tìm kiếm theo Tên hoặc Slug..." className="input max-w-sm w-full bg-surface" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Box className="w-12 h-12 mx-auto text-outline-variant/30 mb-4" />
                <h3 className="text-xl font-semibold text-on-surface">Không tìm thấy sản phẩm!</h3>
                <p className="text-sm text-outline mt-2">Đổi danh mục bên trái hoặc đổi từ khoá tìm kiếm.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container/30 border-b border-outline-variant/10 text-xs uppercase tracking-wider text-outline font-bold">
                      <th className="p-3 w-12 text-center">Ảnh</th>
                      <th className="p-3">Thông tin Sản Phẩm</th>
                      <th className="p-3">Danh Mục</th>
                      <th className="p-3">Kho & Giá (Gốc)</th>
                      <th className="p-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {filteredProducts.map((p) => (
                      <React.Fragment key={p.id}>
                        {/* Hàng Sửa Sản Phẩm (Mở rộng toàn bảng) */}
                        {editId === p.id ? (
                          <tr>
                            <td colSpan={5} className="p-0 border-b-2 border-primary/20">
                              <form onSubmit={(e) => handleAction(updateProductAction, e, "Cập nhật thành công!", () => setEditId(null))} className="p-5 bg-primary/5">
                                <input type="hidden" name="id" value={p.id} />
                                <input type="hidden" name="firstVariantId" value={p.variants[0]?.id || ""} />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                  <input name="name" defaultValue={p.name} className="input bg-white" placeholder="Tên SP *" required />
                                  <input name="slug" defaultValue={p.slug} className="input bg-white text-outline" placeholder="Slug (Ví dụ: ten-sp)" />
                                  <select name="categoryId" defaultValue={p.category?.id || ""} className="input bg-white">
                                    <option value="">-- Thuộc danh mục --</option>
                                    {treeCategories.map((c) => <option key={c.id} value={c.id}>{"\u00A0\u00A0".repeat(c.depth)}{c.depth > 0 ? "↳ " : ""}{c.name}</option>)}
                                  </select>
                                  <input name="imageUrl" defaultValue={p.image_url || ""} className="input bg-white" placeholder="URL Ảnh" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                  <input name="badge" defaultValue={p.badge || ""} className="input bg-white" placeholder="Nhãn (VD: Bán chạy)" />
                                  <input name="short_description" defaultValue={p.short_description || ""} className="input bg-white" placeholder="Mô tả cực ngắn" />
                                  <select name="is_active" defaultValue={String(p.is_active)} className="input bg-white">
                                    <option value="true">✅ Đang bán (Hiển thị on Web)</option>
                                    <option value="false">🚫 Ẩn sản phẩm này</option>
                                  </select>
                                </div>

                                <div className="p-4 bg-white rounded-xl mb-4 border border-outline-variant/20 shadow-sm">
                                  <h4 className="font-bold text-xs text-primary mb-3 uppercase tracking-wider">💰 Chỉnh nhanh giá Variant mặc định</h4>
                                  <div className="grid grid-cols-2 gap-3 max-w-md">
                                    <div><label className="text-[10px] text-outline font-bold">Giá bán hiện tại</label><input name="price" type="number" defaultValue={p.variants[0]?.price} className="input bg-surface" required /></div>
                                    <div><label className="text-[10px] text-outline font-bold">Giá gốc (Gạch bỏ)</label><input name="originalPrice" type="number" defaultValue={p.variants[0]?.original_price || ""} className="input bg-surface" /></div>
                                  </div>
                                </div>

                                <textarea name="description" defaultValue={p.description || ""} className="input w-full min-h-[80px] bg-white resize-y mb-4" placeholder="Mô tả chi tiết dài dằng dặc..." />
                                
                                <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => setEditId(null)} className="btn-secondary !py-2 !px-6 !rounded-lg text-sm cursor-pointer">Huỷ Bỏ</button>
                                  <button type="submit" disabled={loading} className="btn-primary !py-2 !px-6 !rounded-lg text-sm cursor-pointer"><Save className="w-4 h-4 mr-1 inline" /> Lưu Biến Động</button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        ) : (
                          <tr className={`hover:bg-surface-container/20 transition-colors group ${!p.is_active ? 'opacity-60 bg-surface-container/10' : ''}`}>
                            {/* Cột 1: Ảnh */}
                            <td className="p-3 align-top text-center border-l-2 border-transparent group-hover:border-primary">
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-xl shadow-sm border border-outline-variant/10 mx-auto bg-white" />
                              ) : (
                                <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center mx-auto border border-outline-variant/10"><Box className="w-5 h-5 text-outline-variant/40" /></div>
                              )}
                            </td>
                            {/* Cột 2: Thông tin */}
                            <td className="p-3 align-top">
                              <div className="font-bold text-sm text-on-surface leading-snug mb-0.5 line-clamp-1">
                                {p.name}
                                {!p.is_active && <span className="ml-2 text-[9px] bg-error/10 text-error px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Ẩn</span>}
                                {p.badge && <span className="ml-2 text-[9px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded border border-secondary/20">{p.badge}</span>}
                              </div>
                              <div className="text-[11px] text-on-surface-variant font-mono opacity-60">/{p.slug}</div>
                            </td>
                            {/* Cột 3: Danh mục */}
                            <td className="p-3 align-top">
                              {p.category ? (
                                <span className="text-[11px] font-medium bg-surface-container-high px-2 py-1 rounded inline-flex text-on-surface-variant">
                                  📖 {p.category.name}
                                </span>
                              ) : <span className="text-outline-variant text-xs">—</span>}
                            </td>
                            {/* Cột 4: Biến thể đầu tiên (Kho/Giá) */}
                            <td className="p-3 align-top">
                              {p.variants[0] ? (
                                <div>
                                  <div className="font-bold text-sm text-primary mb-1">{fmtVND(p.variants[0].price)}</div>
                                  <div className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getStockColor(p.variants[0].stock)}`}>
                                    {p.variants[0].stock === 0 ? "HẾT KHO" : `KHO: ${p.variants[0].stock}`}
                                  </div>
                                  {p.variants.length > 1 && <span className="ml-2 text-[10px] items-center text-outline-variant font-bold">+{p.variants.length - 1} Quy cách khác</span>}
                                </div>
                              ) : <span className="text-outline-variant text-xs font-italic">Chưa có giá</span>}
                            </td>
                            {/* Cột 5: Nút Bấm Thao tác */}
                            <td className="p-3 align-middle text-right w-32">
                              {/* Ẩn bớt độ màu đi, di chuột vào row mới sáng */}
                              <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setVariantForId(variantForId === p.id ? null : p.id)} title="Cài đặt Nhiều Phân Loại, Kho chứa" className={`p-1.5 rounded transition ${variantForId === p.id ? 'bg-primary text-white shadow' : 'hover:bg-primary/10 text-primary'}`}>
                                  <Tag className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditId(p.id)} title="Chỉnh Sửa Sản Phẩm (Tên, Ảnh,...)" className="p-1.5 hover:bg-surface-container-high text-on-surface-variant rounded transition">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={async () => { if (confirm(`Chắc chắn xoá tận gốc "${p.name}"?`)) { const r = await deleteProductAction(p.id); r?.error ? toast.error(r.error) : (toast.success("Đã xoá."), router.refresh()); }}} title="Xoá Bỏ Tuyệt Đối" className="p-1.5 hover:bg-error/10 text-error rounded transition">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* ROW HIỂN THỊ VARIANTS BOX NẾU ĐƯỢC CHỌN */}
                        {variantForId === p.id && !editId && (
                          <tr>
                            <td colSpan={5} className="p-0 border-b border-primary/10">
                              <div className="bg-surface border-l-4 border-primary/40 m-2 rounded-xl shadow-inner p-4 animate-in fade-in slide-in-from-top-2">
                                <form onSubmit={(e) => handleAction(createVariantAction, e, "Thêm mức kho thành công!")} className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-lg border border-outline-variant/10 shadow-sm mb-4">
                                  <input type="hidden" name="productId" value={p.id} />
                                  <span className="font-bold text-primary text-xs shrink-0 bg-primary/10 px-2 py-1 rounded">➕ Loại Mới</span>
                                  <input name="variantName" required placeholder="Tên loại (VD: Hộp Lớn)" className="input !py-1.5 flex-1 min-w-[120px]" />
                                  <input name="price" type="number" required placeholder="Giá Khuyến Mãi" className="input !py-1.5 w-full md:w-32" />
                                  <input name="originalPrice" type="number" placeholder="Giá Gốc" className="input !py-1.5 w-full md:w-32 opacity-80" />
                                  <input name="stock" type="number" required placeholder="Tồn" className="input !py-1.5 w-full md:w-24" />
                                  <button type="submit" disabled={loading} className="btn-primary !py-1.5 !px-4 !rounded-lg text-xs shrink-0 whitespace-nowrap">Lưu Phân Loại</button>
                                </form>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {p.variants.map((v) => (
                                    <div key={v.id}>
                                      {editVariantId === v.id ? (
                                        <form onSubmit={(e) => handleAction(updateVariantAction, e, "Lưu kho thành công!", () => setEditVariantId(null))} className="bg-primary/5 p-3 rounded-lg border border-primary/30 relative shadow-sm">
                                          <input type="hidden" name="variantId" value={v.id} />
                                          <input name="variantName" defaultValue={v.name} className="input !py-1 !px-2 w-full text-xs font-medium mb-2 border-primary/20 bg-white" placeholder="Tên quy cách" />
                                          <div className="flex gap-2 mb-2">
                                            <div className="flex-1"><label className="text-[9px] text-outline font-bold">Giá bán</label><input name="price" type="number" defaultValue={v.price} className="input !py-1 !px-2 text-xs w-full bg-white" /></div>
                                            <div className="flex-1"><label className="text-[9px] text-outline font-bold">Giá Cũ</label><input name="originalPrice" type="number" defaultValue={v.original_price || ""} className="input !py-1 !px-2 text-xs w-full bg-white" /></div>
                                            <div className="w-16"><label className="text-[9px] text-outline font-bold">Tồn</label><input name="stock" type="number" defaultValue={v.stock} className="input !py-1 !px-2 text-xs w-full bg-white text-center" /></div>
                                          </div>
                                          <div className="flex gap-2">
                                            <button type="submit" className="flex-1 text-[10px] btn-primary !py-1 !rounded cursor-pointer">Lưu</button>
                                            <button type="button" onClick={() => setEditVariantId(null)} className="flex-1 text-[10px] btn-secondary !py-1 !rounded cursor-pointer">Huỷ</button>
                                          </div>
                                        </form>
                                      ) : (
                                        <div className={`flex justify-between items-center p-3 rounded-lg border bg-white ${v.stock === 0 ? "border-error/30 opacity-75 grayscale-[0.3]" : "border-outline-variant/10 hover:border-outline-variant/30"}`}>
                                           <div>
                                             <div className="flex items-center gap-1.5 mb-1">
                                               <span className="font-bold text-on-surface text-xs line-clamp-1">{v.name}</span>
                                               <span className={`px-1 rounded-[4px] text-[8px] font-black uppercase ${getStockColor(v.stock)}`}>
                                                 {v.stock === 0 ? "HẾT" : `x${v.stock}`}
                                               </span>
                                             </div>
                                             <div className="flex items-end gap-2 text-xs">
                                               <span className="font-black text-primary">{fmtVND(v.price)}</span>
                                               {v.original_price && <span className="text-[10px] text-outline line-through mb-[1px]">{fmtVND(v.original_price)}</span>}
                                             </div>
                                           </div>
                                           <div className="flex gap-1 ml-2 border-l border-outline-variant/10 pl-2">
                                             <button onClick={() => setEditVariantId(v.id)} className="p-1.5 hover:bg-surface-container rounded transition-colors text-on-surface-variant"><Pencil className="w-3.5 h-3.5"/></button>
                                             <button onClick={async () => { if (confirm("Chắc chắn xoá giá này?")) { const r = await deleteVariantAction(v.id); r?.error ? toast.error(r.error) : (toast.success("Đã xoá."), router.refresh()); }}} className="p-1.5 hover:bg-error/10 rounded transition-colors text-error/80"><Trash2 className="w-3.5 h-3.5"/></button>
                                           </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
