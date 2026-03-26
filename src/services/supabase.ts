import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy init để tránh crash khi build-time (Vercel chưa inject env vars)
let _supabase: SupabaseClient | null = null;

/** Instance dành cho Public read - dùng anon key */
export const getSupabase = (): SupabaseClient => {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      // Build-time fallback: trả về dummy client, sẽ fail gracefully khi query
      return createClient('https://placeholder.supabase.co', 'ey-placeholder');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
};

// Backward-compatible export cho code cũ dùng `supabase` trực tiếp
// Dùng Proxy để lazy init khi truy cập property
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

/** Instance dành cho Admin operations - chạy TẠI SERVER ONLY */
export const getServiceSupabase = (): SupabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Thiếu SUPABASE env vars trong Server runtime.');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
