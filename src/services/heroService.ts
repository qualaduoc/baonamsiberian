import { getServiceSupabase, getSupabase } from "@/services/supabase";

export interface HeroSettings {
  badge_text: string;
  title_line1: string;
  title_highlight: string;
  title_line3: string;
  description: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  badge_icon_text: string;
  badge_subtitle: string;
}

const DEFAULT_HERO: HeroSettings = {
  badge_text: "PHONG CÁCH SỐNG KHỎE",
  title_line1: "Đánh Thức",
  title_highlight: "Sức Sống",
  title_line3: "Từ Thiên Nhiên",
  description: "Khám phá bộ sưu tập thực phẩm chức năng cao cấp được chiết xuất từ thảo dược quý hiếm, mang lại giải pháp chăm sóc sức khỏe toàn diện và an toàn.",
  cta_text: "Mua Sắm Ngay",
  cta_link: "/shop",
  image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD404CzodQbr9Ln0m38Gnu2o2o6NUm1Az3jb8zGv54khaMIwUFmuwa3icqLHa6TLm_UcdNNSOTwKaNmzhiZgWHJMUYTqqzvlxzUiyLMJZzuIpwn_AdwiIeC5HU-6i_7q2OHzc6RpHUKPUXbn3rAng58rXdkchk25RMoGgX2H9HC5IHV-hsyj4fBBqxGhS8mMXtTfHMe6Xn_xht3oRGVdgsfTu7--YPYhr_Swe6uGdDTC9bmVi6MLd1sJNwRymoGeKCpkWGAkqV_y1pI",
  badge_icon_text: "100% Tự Nhiên",
  badge_subtitle: "Chứng nhận organic quốc tế",
};

// Fetch Hero Settings (Public - dùng anon key)
export async function getHeroSettings(): Promise<HeroSettings> {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .select("value")
    .eq("key", "hero_banner")
    .single();

  if (error || !data) return DEFAULT_HERO;

  try {
    return { ...DEFAULT_HERO, ...JSON.parse(data.value) };
  } catch {
    return DEFAULT_HERO;
  }
}

// Cập nhật Hero Settings (Admin only - dùng service key)
export async function updateHeroSettings(settings: Partial<HeroSettings>) {
  const supa = getServiceSupabase();

  const merged = { ...DEFAULT_HERO, ...settings };

  const { error } = await supa
    .from("site_settings")
    .upsert(
      { key: "hero_banner", value: JSON.stringify(merged), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    console.error("Lỗi cập nhật Hero:", error);
    return { error: error.message };
  }
  return { success: true };
}
