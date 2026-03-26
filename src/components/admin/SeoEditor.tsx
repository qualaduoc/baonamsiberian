"use client";

import { useState } from "react";
import { SeoSettings } from "@/services/seoService";
import { Save, Loader2, Globe, Search, Share2, Code, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  seo: SeoSettings;
  updateAction: (formData: FormData) => Promise<any>;
}

export default function SeoEditor({ seo, updateAction }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateAction(new FormData(e.currentTarget));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success("Đã cập nhật SEO!"); router.refresh(); }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Basic SEO */}
      <div>
        <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4 text-base">
          <Search className="w-5 h-5 text-primary" /> Thông Tin SEO Cơ Bản
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tiêu Đề Trang (Title Tag)</label>
            <input name="site_title" defaultValue={seo.site_title} className="input w-full" placeholder="Bảo Nam | Thực Phẩm Chức Năng Cao Cấp" />
            <p className="text-xs text-on-surface-variant mt-1">Hiển thị trên tab trình duyệt và kết quả Google. Tối ưu 50-60 ký tự.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Mô Tả (Meta Description)</label>
            <textarea name="site_description" defaultValue={seo.site_description} className="input w-full min-h-[80px] resize-y" placeholder="Mô tả ngắn gọn về website..." />
            <p className="text-xs text-on-surface-variant mt-1">Hiển thị dưới tiêu đề trên Google. Tối ưu 150-160 ký tự.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Từ Khóa (Keywords)</label>
            <input name="site_keywords" defaultValue={seo.site_keywords} className="input w-full" placeholder="thực phẩm chức năng, Bảo Nam, thảo dược..." />
            <p className="text-xs text-on-surface-variant mt-1">Cách nhau bằng dấu phẩy. VD: thực phẩm chức năng, Bảo Nam, sức khỏe</p>
          </div>
        </div>
      </div>

      {/* Open Graph / Social */}
      <div>
        <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4 text-base">
          <Share2 className="w-5 h-5 text-primary" /> Chia Sẻ Mạng Xã Hội (Open Graph)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Ảnh Đại Diện (og:image)</label>
            <input name="og_image" defaultValue={seo.og_image} className="input w-full" placeholder="https://... URL ảnh khi share Facebook/Zalo" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Loại Trang (og:type)</label>
            <select name="og_type" defaultValue={seo.og_type} className="input w-full">
              <option value="website">Website</option>
              <option value="article">Article</option>
              <option value="product">Product</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Twitter Handle</label>
            <input name="twitter_handle" defaultValue={seo.twitter_handle} className="input w-full" placeholder="@baonam" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Canonical Base URL</label>
            <input name="canonical_base" defaultValue={seo.canonical_base} className="input w-full" placeholder="https://baonam.vn" />
          </div>
        </div>
      </div>

      {/* Technical SEO */}
      <div>
        <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4 text-base">
          <Shield className="w-5 h-5 text-primary" /> SEO Kỹ Thuật
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Google Verification Code</label>
            <input name="google_verification" defaultValue={seo.google_verification} className="input w-full" placeholder="ABC123xyz..." />
            <p className="text-xs text-on-surface-variant mt-1">Mã xác minh từ Google Search Console</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Robots Meta Tag</label>
            <select name="robots" defaultValue={seo.robots} className="input w-full">
              <option value="index, follow">index, follow (Google index bình thường)</option>
              <option value="noindex, follow">noindex, follow (Ẩn khỏi Google)</option>
              <option value="index, nofollow">index, nofollow (Index nhưng không theo link)</option>
              <option value="noindex, nofollow">noindex, nofollow (Ẩn hoàn toàn)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Favicon URL</label>
            <input name="favicon_url" defaultValue={seo.favicon_url} className="input w-full" placeholder="https://... URL icon tab trình duyệt" />
          </div>
        </div>
      </div>

      {/* Extra Head Tags */}
      <div>
        <h3 className="font-bold text-on-surface flex items-center gap-2 mb-4 text-base">
          <Code className="w-5 h-5 text-primary" /> Mã Bổ Sung (Nâng Cao)
        </h3>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thẻ HTML Bổ Sung (chèn vào &lt;head&gt;)</label>
          <textarea name="extra_head_tags" defaultValue={seo.extra_head_tags} className="input w-full min-h-[100px] resize-y font-mono text-sm" placeholder="<!-- Google Analytics, Facebook Pixel, v.v. -->" />
          <p className="text-xs text-on-surface-variant mt-1">Dán mã theo dõi Google Analytics, Facebook Pixel, TikTok Pixel... ở đây.</p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-surface border border-outline-variant/10 rounded-xl p-5">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Xem Trước Trên Google</p>
        <div className="max-w-xl">
          <p className="text-[#1a0dab] text-lg font-medium leading-tight hover:underline cursor-pointer">{seo.site_title || "Tiêu đề trang"}</p>
          <p className="text-[#006621] text-sm mt-1">{seo.canonical_base || "https://baonam.vn"}</p>
          <p className="text-[#545454] text-sm mt-1 line-clamp-2">{seo.site_description || "Mô tả ngắn..."}</p>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 !py-3 !px-6 cursor-pointer disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {loading ? "Đang lưu..." : "Lưu Cài Đặt SEO"}
      </button>
    </form>
  );
}
