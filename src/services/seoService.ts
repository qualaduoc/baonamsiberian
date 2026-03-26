import { getSupabase, getServiceSupabase } from "@/services/supabase";

export interface SeoSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  og_image: string;
  og_type: string;
  twitter_handle: string;
  google_verification: string;
  favicon_url: string;
  robots: string;
  canonical_base: string;
  extra_head_tags: string;
}

const DEFAULT_SEO: SeoSettings = {
  site_title: "Bảo Nam Siberian | Thực Phẩm Chức Năng Cao Cấp",
  site_description: "Bảo Nam Siberian - Đại lý phân phối thực phẩm chức năng cao cấp chiết xuất từ thảo dược Siberian. Giao hàng miễn phí toàn quốc.",
  site_keywords: "thực phẩm chức năng, Bảo Nam, Siberian, thảo dược, sức khỏe, bổ sung dinh dưỡng",
  og_image: "",
  og_type: "website",
  twitter_handle: "",
  google_verification: "",
  favicon_url: "",
  robots: "index, follow",
  canonical_base: "",
  extra_head_tags: "",
};

export async function getSeoSettings(): Promise<SeoSettings> {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .select("value")
    .eq("key", "seo_settings")
    .single();

  if (error || !data) return DEFAULT_SEO;

  try {
    return { ...DEFAULT_SEO, ...JSON.parse(data.value) };
  } catch {
    return DEFAULT_SEO;
  }
}

export async function updateSeoSettings(settings: Partial<SeoSettings>) {
  const supa = getServiceSupabase();
  const merged = { ...DEFAULT_SEO, ...settings };

  const { error } = await supa
    .from("site_settings")
    .upsert(
      { key: "seo_settings", value: JSON.stringify(merged), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) return { error: error.message };
  return { success: true };
}
