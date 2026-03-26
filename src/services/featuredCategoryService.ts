import { getSupabase } from "./supabase";

export interface FeaturedCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  position: number; // 'hero' | 'small-1' | 'small-2' | 'wide'
}

const DEFAULT_CATEGORIES: FeaturedCategory[] = [
  { id: "1", name: "Hệ Miễn Dịch", slug: "he-mien-dich", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtfb5ECCOFLLoKGw0M0krSM_OQLrVAozhAGARKJLYhDY4RNIq4rmD7uIizqzP7kKn7p9hxHg-V6f6rR5AsOsiMvB7XO6BMUEaaW8C08QNDMa-pAaGLc1hP3_jJgzk3hECoTH_DsUzw9ysAozOQy9jpo0j5FM3o2LXzl-Zc24CGvIdZj8k6uFSJ_u5JDx-gxHbCIDtkJAAbMoUEcTNh1ajrqK7meT0vmDeLCYZKPyZOUrZyvtbSBecFqwLB-7MODRXGgpsjsZbVIM7y", description: "Tăng cường sức đề kháng tự nhiên với chiết xuất từ thảo dược.", position: 0 },
  { id: "2", name: "Giảm Căng Thẳng", slug: "giam-cang-thang", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0qQgrza7Li19LcS8_5DajweSs6PKayaf-Owi16bIZwTRiBhVKuojmXrZ3WmTbt7zJgfEqdffrWHiGtIajtT43x48De2h1ZY-JHNtiusGRQHcyP2KyefcWV6oBP7h3ra08EX2iOCQSrF9gzNrnN9suAIqVt4NHiMAz7V9rwER3eTEcJLGZhL7UFmidbuSGCC5fbkyDcAPsThX5BjTwaPWZXSoCsCg8-GOEonlrAcJPtQ5eHrRo4YOJBd_eY4Jfbhcdf5UW4ONFWetJ", description: "", position: 1 },
  { id: "3", name: "Dinh Dưỡng Xanh", slug: "dinh-duong-xanh", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBErrJLglIJbvYMSoOmXQxXJDH-pEXwDcP7NsjF2xbZsbb6TxWLrO0jGeJOtgIRGBNSE2qiyl-sXjCvUkAcI0f4c25pGabkUtmIz961QBoJ2B-vYMxhjT5c1_WEUwL0BAwby3qUmceG4VH0SyDjfczR-NKwWiCPy1A9lMdztBs6jCSflR_Qe957BFgpK74PvH2DonRcIk7MvuMTMZ7AlFnFxCif7-Jp0py9E3-FOFPLtWkdFCZwx0SfZIcKzuMLx6Eu8_N5M9n_PEN7", description: "", position: 2 },
  { id: "4", name: "Chăm Sóc Da", slug: "cham-soc-da", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdRa1YGCEFxJdpI70i9hnSkx2GTYKKOIEBqpbn000VVZTWSznhSoTRmLx_9k5nfXl2c6umn5Ln9GS26w0e8vIULvWibsAWQIxlcscEaYot_uwBFECJ4nH_5d05tHjC9HocWSlVZF-Tm_nmHr87dwcjn1oRG92EGs6pcyT6q0lPliQ50puM5LE1TpRm8TM2PL2hdqibrIe_ePZ-1Nc7NTx5qw9cmgphH_OnfXVSlFTs1FEha-3aC8LIvuedDneEztz3F3Ava4fNLFsm", description: "Vẻ đẹp rạng ngời từ bên trong.", position: 3 },
];

export async function getFeaturedCategories(): Promise<FeaturedCategory[]> {
  try {
    const { data, error } = await getSupabase()
      .from("site_settings")
      .select("value")
      .eq("key", "featured_categories")
      .single();

    if (error || !data?.value) return DEFAULT_CATEGORIES;

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function updateFeaturedCategories(categories: FeaturedCategory[]) {
  try {
    const { getServiceSupabase } = await import("./supabase");
    const admin = getServiceSupabase();

    const { error } = await admin
      .from("site_settings")
      .upsert({ key: "featured_categories", value: JSON.stringify(categories), updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) return { error: error.message };
    return { success: true };
  } catch {
    return { error: "Lỗi server khi cập nhật danh mục nổi bật." };
  }
}
