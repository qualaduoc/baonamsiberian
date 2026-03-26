import { createClient, SupabaseClient } from '@supabase/supabase-js';

/** Tạo Public Supabase client - chỉ gọi khi cần, KHÔNG tạo ở module-level */
export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('Supabase env vars chưa sẵn sàng (build-time). Trả về dummy client.');
    return createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder');
  }
  return createClient(url, key);
}

/** Tạo Admin Supabase client - SERVER ONLY */
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Thiếu SUPABASE env vars trong Server runtime.');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
