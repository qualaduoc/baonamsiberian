import { getServiceSupabase } from "@/services/supabase";

export interface TelegramSettings {
  bot_token: string;
  chat_id: string;
  is_active: boolean;
}

const DEFAULT_TELEGRAM: TelegramSettings = {
  bot_token: "",
  chat_id: "",
  is_active: true,
};

// Use getServiceSupabase to bypass RLS since 'telegram_settings' is restricted from public read
export async function getTelegramSettings(): Promise<TelegramSettings> {
  const supa = getServiceSupabase();
  const { data, error } = await supa
    .from("site_settings")
    .select("value")
    .eq("key", "telegram_settings")
    .single();

  if (error || !data) {
    // Fallback to Env variables if DB is empty
    const envToken = process.env.TELEGRAM_BOT_TOKEN;
    const envChatId = process.env.TELEGRAM_CHAT_ID;
    
    return {
      bot_token: envToken || "",
      chat_id: envChatId || "",
      is_active: true,
    };
  }

  try {
    return { ...DEFAULT_TELEGRAM, ...JSON.parse(data.value) };
  } catch {
    return DEFAULT_TELEGRAM;
  }
}

export async function updateTelegramSettings(settings: Partial<TelegramSettings>) {
  const supa = getServiceSupabase();
  const merged = { ...DEFAULT_TELEGRAM, ...settings };

  const { error } = await supa
    .from("site_settings")
    .upsert(
      { key: "telegram_settings", value: JSON.stringify(merged), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) return { error: error.message };
  return { success: true };
}
