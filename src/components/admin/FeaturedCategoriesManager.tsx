"use client";

import { useState } from "react";
import { updateFeaturedCategoriesAction } from "@/app/actions/adminActions";
import { FeaturedCategory } from "@/services/featuredCategoryService";
import { Save, Plus, Trash2, Loader2, GripVertical, Image as ImageIcon, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const POSITION_LABELS = ["🖼️ Ảnh lớn (trái)", "📷 Ảnh nhỏ (giữa trên)", "📷 Ảnh nhỏ (giữa trên)", "🖼️ Ảnh rộng (dưới)"];

interface Props {
  initialCategories: FeaturedCategory[];
}

export default function FeaturedCategoriesManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<FeaturedCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();

  const updateField = (index: number, field: keyof FeaturedCategory, value: string | number) => {
    setCategories(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const addCategory = () => {
    if (categories.length >= 6) { toast.error("Tối đa 6 danh mục nổi bật."); return; }
    setCategories(prev => [...prev, {
      id: Date.now().toString(),
      name: "",
      slug: "",
      image_url: "",
      description: "",
      position: prev.length,
    }]);
  };

  const removeCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, position: i })));
  };

  const handleSave = async () => {
    const invalid = categories.find(c => !c.name || !c.image_url);
    if (invalid) { toast.error("Mỗi danh mục cần có Tên và URL ảnh."); return; }

    setLoading(true);
    const res = await updateFeaturedCategoriesAction(JSON.stringify(categories));
    setLoading(false);

    if (res?.error) toast.error(res.error);
    else { toast.success("Đã cập nhật Danh Mục Nổi Bật!"); router.refresh(); }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-on-surface">🌟 Danh Mục Nổi Bật</h3>
          <p className="text-sm text-on-surface-variant">Hiển thị trên trang chủ dạng Bento Grid. Tối đa 6 danh mục.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPreviewMode(!previewMode)} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
            <Eye className="w-4 h-4" /> {previewMode ? "Chỉnh sửa" : "Xem trước"}
          </button>
          {!previewMode && (
            <button onClick={addCategory} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
              <Plus className="w-4 h-4" /> Thêm
            </button>
          )}
          <button onClick={handleSave} disabled={loading} className="btn-primary !py-2 !px-5 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="mb-6 p-4 bg-surface rounded-xl border border-outline-variant/10">
          <p className="text-sm mb-4 font-bold text-on-surface">Giao diện Bento Grid trên Trang Chủ:</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pointer-events-none">
            {categories.map((cat, i) => {
              const isHero = i === 0;
              const isWide = i === 3;
              return (
                <div
                  key={cat.id || i}
                  className={`relative group overflow-hidden rounded-xl bg-surface-container-lowest ${
                    isHero ? "md:col-span-2 md:row-span-2 h-[500px]" : isWide ? "md:col-span-2 h-[238px]" : "h-[238px]"
                  }`}
                >
                  {cat.image_url ? (
                    <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" src={cat.image_url} alt={cat.name} />
                  ) : (
                    <div className="absolute inset-0 bg-outline-variant/20 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-outline-variant/50" />
                    </div>
                  )}

                  {isHero ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 p-8 w-full">
                        <h3 className="font-heading text-3xl font-bold text-white mb-2">{cat.name || 'Tên danh mục'}</h3>
                        {cat.description && <p className="text-white/80 mb-6 max-w-xs">{cat.description}</p>}
                        <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm inline-block">Khám phá</span>
                      </div>
                    </>
                  ) : isWide ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-center p-8">
                        <h3 className="font-heading text-2xl font-bold text-white mb-2">{cat.name || 'Tên danh mục'}</h3>
                        {cat.description && <p className="text-white/80 text-sm max-w-[200px]">{cat.description}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <h3 className="font-heading text-xl font-bold text-white text-center">{cat.name || 'Tên danh mục'}</h3>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((cat, index) => (
            <div key={cat.id} className="bg-surface p-4 rounded-xl border border-outline-variant/10 group">
              <div className="flex items-start gap-3">
                <div className="pt-2 text-outline-variant/30"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {POSITION_LABELS[index] || `Vị trí ${index + 1}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={cat.name}
                      onChange={(e) => updateField(index, "name", e.target.value)}
                      placeholder="Tên danh mục *"
                      className="input !py-2"
                    />
                    <input
                      value={cat.slug}
                      onChange={(e) => updateField(index, "slug", e.target.value)}
                      placeholder="Link đích (VD: /shop?category=xuong-khop)"
                      className="input !py-2 text-outline"
                    />
                  </div>
                  <input
                    value={cat.image_url}
                    onChange={(e) => updateField(index, "image_url", e.target.value)}
                    placeholder="URL ảnh nền *"
                    className="input !py-2 w-full"
                  />
                  <div className="relative">
                    <input
                      value={cat.description}
                      onChange={(e) => updateField(index, "description", e.target.value)}
                      maxLength={40}
                      placeholder="Mô tả ngắn (tối đa 40 ký tự)"
                      className="input !py-2 w-full pr-16"
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${(cat.description?.length || 0) >= 40 ? 'text-error' : 'text-outline-variant'}`}>
                      {cat.description?.length || 0}/40
                    </span>
                  </div>
                </div>
                <button onClick={() => removeCategory(index)} className="p-2 text-error hover:bg-error/5 rounded-lg cursor-pointer transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
