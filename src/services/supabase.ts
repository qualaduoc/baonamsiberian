import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Instance dành cho người dùng vãng lai (Public read) - Dùng an toàn ở cả Server/Client
// Khi build trên Vercel, env chưa sẵn sàng → dùng placeholder để tránh crash
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Instance dành cho các tác vụ thay đổi dữ liệu yêu cầu quyền Admin, chạy TẠI SERVER ONLY
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || !supabaseUrl) {
    throw new Error('Thiếu SUPABASE_SERVICE_ROLE_KEY hoặc SUPABASE_URL trong Server runtime.');
  }
  return createClient(supabaseUrl, serviceKey);
};
