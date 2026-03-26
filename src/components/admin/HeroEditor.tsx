"use client";

import { updateHeroAction } from "@/app/actions/adminActions";
import { HeroSettings } from "@/services/heroService";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Loader2, Image, Type, FileText } from "lucide-react";

interface Props {
  hero: HeroSettings;
}

export default function HeroEditor({ hero }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateHeroAction(fd);
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success("Đã cập nhật Hero Banner!"); router.refresh(); }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1">
            <Type className="w-3 h-3" /> Nhãn Badge
          </label>
          <input name="badge_text" defaultValue={hero.badge_text} className="input w-full" />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nút CTA</label>
          <input name="cta_text" defaultValue={hero.cta_text} className="input w-full" />
        </div>
      </div>

      {/* Title Lines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Dòng Tiêu Đề 1</label>
          <input name="title_line1" defaultValue={hero.title_line1} className="input w-full" />
        </div>
        <div>
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Dòng Nổi Bật (In nghiêng)</label>
          <input name="title_highlight" defaultValue={hero.title_highlight} className="input w-full !border-primary/30" />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Dòng Tiêu Đề 3</label>
          <input name="title_line3" defaultValue={hero.title_line3} className="input w-full" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1">
          <FileText className="w-3 h-3" /> Mô Tả Ngắn
        </label>
        <textarea name="description" defaultValue={hero.description} className="input w-full min-h-[80px] resize-y" />
      </div>

      {/* Image + Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1">
            <Image className="w-3 h-3" /> URL Ảnh Hero
          </label>
          <input name="image_url" defaultValue={hero.image_url} className="input w-full" />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Link CTA</label>
          <input name="cta_link" defaultValue={hero.cta_link} className="input w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Huy Hiệu Ảnh (Dòng 1)</label>
          <input name="badge_icon_text" defaultValue={hero.badge_icon_text} className="input w-full" />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Huy Hiệu Ảnh (Dòng 2)</label>
          <input name="badge_subtitle" defaultValue={hero.badge_subtitle} className="input w-full" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 !py-3 !px-6 cursor-pointer disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
      </button>
    </form>
  );
}
