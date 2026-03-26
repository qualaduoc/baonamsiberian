"use client";

import { useState } from "react";
import { updateFeaturedCategoriesAction } from "@/app/actions/adminActions";
import { FeaturedCategory } from "@/services/featuredCategoryService";
import { Save, Plus, Trash2, Loader2, GripVertical, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const POSITION_LABELS = ["🖼️ Ảnh lớn (trái)", "📷 Ảnh nhỏ (giữa trên)", "📷 Ảnh nhỏ (giữa trên)", "🖼️ Ảnh rộng (dưới)"];

interface Props {
  initialCategories: FeaturedCategory[];
}

export default function FeaturedCategoriesManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<FeaturedCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
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
          <button onClick={addCategory} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
            <Plus className="w-4 h-4" /> Thêm
          </button>
          <button onClick={handleSave} disabled={loading} className="btn-primary !py-2 !px-5 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu
          </button>
        </div>
      </div>

      {/* Preview Bento layout */}
      <div className="grid grid-cols-4 gap-2 mb-6 h-48 rounded-xl overflow-hidden border border-outline-variant/10">
        {categories.slice(0, 4).map((c, i) => (
          <div
            key={c.id}
            className={`relative bg-surface-container overflow-hidden ${
              i === 0 ? "col-span-2 row-span-2" : i === 3 ? "col-span-2" : ""
            }`}
          >
            {c.image_url ? (
              <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5"><ImageIcon className="w-8 h-8 text-primary/20" /></div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-end p-2">
              <span className="text-white text-xs font-bold truncate">{c.name || `Danh mục ${i + 1}`}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit list */}
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
                    onChange={(e) => {
                      updateField(index, "name", e.target.value);
                      updateField(index, "slug", e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }}
                    placeholder="Tên danh mục *"
                    className="input !py-2"
                  />
                  <input
                    value={cat.slug}
                    onChange={(e) => updateField(index, "slug", e.target.value)}
                    placeholder="Slug (tự tạo)"
                    className="input !py-2 text-outline"
                  />
                </div>
                <input
                  value={cat.image_url}
                  onChange={(e) => updateField(index, "image_url", e.target.value)}
                  placeholder="URL ảnh nền *"
                  className="input !py-2 w-full"
                />
                <input
                  value={cat.description}
                  onChange={(e) => updateField(index, "description", e.target.value)}
                  placeholder="Mô tả ngắn (tuỳ chọn)"
                  className="input !py-2 w-full"
                />
              </div>
              <button onClick={() => removeCategory(index)} className="p-2 text-error hover:bg-error/5 rounded-lg cursor-pointer transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
