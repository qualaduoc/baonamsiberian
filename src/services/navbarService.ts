import { getSupabase, getServiceSupabase } from "./supabase";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: Omit<NavItem, 'children'>[];
}

const DEFAULT_NAV: NavItem[] = [
  { id: "1", label: "Trang Chủ", href: "/" },
  { id: "2", label: "Cửa Hàng", href: "/shop" },
  { id: "3", label: "Liên Hệ", href: "#" },
];

export async function getNavbarSettings(): Promise<NavItem[]> {
  try {
    const { data, error } = await getSupabase()
      .from("site_settings")
      .select("value")
      .eq("key", "navbar_settings")
      .single();

    if (error || !data?.value) return DEFAULT_NAV;

    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_NAV;
  } catch {
    return DEFAULT_NAV;
  }
}

export async function updateNavbarSettings(navItems: NavItem[]) {
  try {
    const admin = getServiceSupabase();

    const { error } = await admin
      .from("site_settings")
      .upsert({ key: "navbar_settings", value: JSON.stringify(navItems), updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (error) return { error: error.message };
    return { success: true };
  } catch {
    return { error: "Lỗi server khi cập nhật Menu Navbar." };
  }
}
