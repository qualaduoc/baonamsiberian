import { getServiceSupabase } from "@/services/supabase";

export interface ZaloSettings {
  endpoint: string;
  api_key: string;
  is_active: boolean;
}

const DEFAULT_ZALO: ZaloSettings = {
  endpoint: "https://zl.aiphocap.vn/api/webhook/order",
  api_key: "",
  is_active: false,
};

export async function getZaloSettings(): Promise<ZaloSettings> {
  const supa = getServiceSupabase();
  const { data, error } = await supa
    .from("site_settings")
    .select("value")
    .eq("key", "zalo_settings")
    .single();

  if (error || !data) {
    return DEFAULT_ZALO;
  }

  try {
    return { ...DEFAULT_ZALO, ...JSON.parse(data.value) };
  } catch {
    return DEFAULT_ZALO;
  }
}

export async function updateZaloSettings(settings: Partial<ZaloSettings>) {
  const supa = getServiceSupabase();
  const merged = { ...DEFAULT_ZALO, ...settings };

  const { error } = await supa
    .from("site_settings")
    .upsert(
      { key: "zalo_settings", value: JSON.stringify(merged), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) return { error: error.message };
  return { success: true };
}
