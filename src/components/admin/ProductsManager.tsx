"use client";

import {
  createProductAction, updateProductAction, deleteProductAction,
  createVariantAction, updateVariantAction, deleteVariantAction,
  createCategoryAction
} from "@/app/actions/adminActions";
import { scrapeSiberianAction } from "@/app/actions/scraperAction";
import { useState } from "react";
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
    if (!scrapeUrl) return toast.error("Vui lòng nhập link Siberian Health cần lấy!");
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
              <DownloadCloud className="w-4 h-4" /> ⚡ Cài đặt nhanh bằng Link Siberian Health
            </h4>
            <div className="flex gap-2 relative z-10">
              <input 
                value={scrapeUrl} 
                onChange={(e) => setScrapeUrl(e.target.value)} 
                placeholder="Dán link sản phẩm (Ví dụ: https://vn.siberianhealth.com/...)" 
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
          
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-4 flex items-center justify-between">
             <div className="font-bold text-on-surface-variant">🔍 Lọc Nhanh ({filteredProducts.length} SP)</div>
             <input type="text" placeholder="Tìm tên sản phẩm..." className="input max-w-sm w-full bg-surface" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
              <Box className="w-12 h-12 mx-auto text-outline-variant/30 mb-4" />
              <h3 className="text-xl font-semibold text-on-surface">Không tìm thấy sản phẩm!</h3>
              <p className="text-sm text-outline mt-2">Đổi danh mục bên trái hoặc đổi từ khoá tìm kiếm.</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-5 hover:border-primary/20 transition-all group">
                {/* Header SP */}
                {editId === p.id ? (
                  <form onSubmit={(e) => handleAction(updateProductAction, e, "Cập nhật thành công!", () => setEditId(null))} className="space-y-4">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="firstVariantId" value={p.variants[0]?.id || ""} />
                    
                    <div className="bg-primary/5 p-4 rounded-xl mb-4 border border-primary/10">
                      <h4 className="font-bold text-sm text-primary mb-3">📍 Thông tin Giá (Quy cách mặc định / đầu tiên)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input name="price" type="number" defaultValue={p.variants[0]?.price} className="input bg-white" placeholder="Giá bán hiện tại *" required />
                        <input name="originalPrice" type="number" defaultValue={p.variants[0]?.original_price || ""} className="input bg-white" placeholder="Giá gốc (Gạch ngang)" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input name="name" defaultValue={p.name} className="input" placeholder="Tên SP" required />
                      <input name="slug" defaultValue={p.slug} className="input" placeholder="Slug" />
                      <select name="categoryId" defaultValue={p.category?.id || ""} className="input"><option value="">-- Danh mục --</option>{treeCategories.map((c) => <option key={c.id} value={c.id}>{"\u00A0\u00A0".repeat(c.depth)}{c.depth > 0 ? "↳ " : ""}{c.name}</option>)}</select>
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
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-20 h-20 rounded-xl object-cover shadow-sm bg-surface" /> : <div className="w-20 h-20 bg-surface rounded-xl flex items-center justify-center shadow-inner"><Box className="w-7 h-7 text-outline-variant/30" /></div>}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-on-surface leading-tight">{p.name}</h3>
                          {!p.is_active && <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-md font-bold shrink-0">ĐÃ ẨN</span>}
                          {p.badge && <span className="text-[10px] bg-secondary-container text-on-surface px-2 py-0.5 rounded-md font-bold shrink-0 border border-secondary/20">{p.badge}</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-on-surface-variant mb-2">
                          <span className="font-mono bg-surface-container px-1 py-0.5 border border-outline-variant/10 rounded">/{p.slug}</span>
                          {p.category && <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-full inline-flex items-center border border-primary/10">📖 {p.category.name}</span>}
                        </div>
                        {p.short_description && <p className="text-sm text-on-surface-variant/80 border-l-2 border-outline-variant/20 pl-2 italic line-clamp-1">{p.short_description}</p>}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 shrink-0 md:items-end w-full md:w-auto mt-2 md:mt-0">
                      <button onClick={() => setEditId(p.id)} className="flex-1 md:flex-none btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center justify-center gap-1.5 hover:bg-surface-container-highest"><Pencil className="w-4 h-4" /> Sửa SP</button>
                      <button onClick={() => setVariantForId(variantForId === p.id ? null : p.id)} className={`flex-1 md:flex-none !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${variantForId === p.id ? "bg-primary text-on-primary shadow" : "btn-secondary hover:bg-surface-container-highest"}`}><Tag className="w-4 h-4" /> Kho & Giá</button>
                      <button onClick={async () => { if (confirm(`Chắc chắn xoá "${p.name}"?\nSẽ xoá luôn cả ảnh và báo giá liên quan!`)) { const r = await deleteProductAction(p.id); r?.error ? toast.error(r.error) : (toast.success("Đã xoá."), router.refresh()); }}} className="p-2 text-error hover:bg-error/10 rounded-lg group-hover:opacity-100 opacity-50 md:opacity-100 transition-all cursor-pointer bg-error/5 md:bg-transparent" title="Xoá Sản Phẩm"><Trash2 className="w-5 h-5 mx-auto" /></button>
                    </div>
                  </div>
                )}

                {/* Form thêm biến thể Nhỏ Gọn */}
                {variantForId === p.id && (
                  <form onSubmit={(e) => handleAction(createVariantAction, e, "Thêm mức kho thành công!", () => setVariantForId(null))} className="bg-primary/5 p-4 rounded-xl mt-4 border border-primary/20 shadow-inner">
                    <input type="hidden" name="productId" value={p.id} />
                    <h5 className="font-bold text-primary text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><Plus className="w-3 h-3" /> Thêm mức giá / phân loại mới</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <input name="variantName" required placeholder="Tên (VD: Lọ 60V)" className="input !py-2 col-span-2" />
                      <input name="price" type="number" required placeholder="Giá bán" className="input !py-2 bg-white" />
                      <input name="originalPrice" type="number" placeholder="Giá gốc" className="input !py-2 opacity-80" />
                      <input name="stock" type="number" required placeholder="Kho (Cái)" className="input !py-2 bg-white" />
                    </div>
                    <div className="flex gap-2 justify-end mt-3">
                      <button type="button" onClick={() => setVariantForId(null)} className="btn-secondary !py-1.5 !px-4 text-xs font-bold">Thoát</button>
                      <button type="submit" disabled={loading} className="btn-primary !py-1.5 !px-5 !rounded-lg text-xs cursor-pointer">{loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Lưu Phân Loại"}</button>
                    </div>
                  </form>
                )}

                {/* Danh Sách Biến Thể */}
                {p.variants.length > 0 && (
                  <div className="mt-4 pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {p.variants.map((v) => (
                        <div key={v.id}>
                          {editVariantId === v.id ? (
                            <form onSubmit={(e) => handleAction(updateVariantAction, e, "Lưu kho thành công!", () => setEditVariantId(null))} className="bg-surface p-3 rounded-xl border-2 border-primary/40 shadow-sm relative z-10">
                              <input type="hidden" name="variantId" value={v.id} />
                              <label className="text-[10px] font-bold text-outline-variant mb-1 uppercase tracking-widest block">Quy cách đóng gói</label>
                              <input name="variantName" defaultValue={v.name} className="input !py-1.5 !px-2.5 w-full text-sm font-medium mb-2 border-primary/20" />
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <div><label className="text-[10px] font-bold text-outline-variant mb-0.5 block">Giá bán</label><input name="price" type="number" defaultValue={v.price} className="input !py-1.5 px-2 text-sm text-primary font-bold w-full border-primary/20 bg-primary/5" /></div>
                                <div><label className="text-[10px] font-bold text-outline-variant mb-0.5 block">Giá gốc</label><input name="originalPrice" type="number" defaultValue={v.original_price || ""} className="input !py-1.5 px-2 text-sm w-full" /></div>
                                <div><label className="text-[10px] font-bold text-outline-variant mb-0.5 block">Tồn Kho</label><input name="stock" type="number" defaultValue={v.stock} className="input !py-1.5 px-2 text-sm w-full" /></div>
                              </div>
                              <div className="flex gap-2">
                                <button type="submit" className="flex-1 text-xs btn-primary !py-1.5 !rounded-lg cursor-pointer flex items-center justify-center gap-1"><Save className="w-3 h-3"/> Ok</button>
                                <button type="button" onClick={() => setEditVariantId(null)} className="text-xs btn-secondary !py-1.5 px-3 !rounded-lg cursor-pointer">Huỷ</button>
                              </div>
                            </form>
                          ) : (
                            <div className={`flex justify-between items-center px-3 py-2.5 rounded-xl border ${v.stock === 0 ? "border-error/30 bg-error/5 opacity-75" : "border-outline-variant/15 bg-surface"}`}>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-on-surface text-sm line-clamp-1">{v.name}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getStockColor(v.stock)}`}>
                                    {v.stock === 0 ? "Hết Hàng" : `Kho: ${v.stock}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                  <span className="font-bold text-primary">{fmtVND(v.price)}</span>
                                  {v.original_price && <span className="text-xs text-outline line-through">{fmtVND(v.original_price)}</span>}
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 ml-2 border-l border-outline-variant/10 pl-2 shrink-0">
                                <button onClick={() => setEditVariantId(v.id)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={async () => { if (confirm("Xoá giá trị này?")) { const r = await deleteVariantAction(v.id); r?.error ? toast.error(r.error) : (toast.success("Đã xoá."), router.refresh()); }}} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
