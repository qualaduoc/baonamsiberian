import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Instance dành cho người dùng vãng lai (Public read) - Dùng an toàn ở cả Server/Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Instance dành cho các tác vụ thay đổi dữ liệu yêu cầu quyền Admin, chạy TẠI SERVER ONLY
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('Thiếu SUPABASE_SERVICE_ROLE_KEY trong Server runtime.');
  }
  return createClient(supabaseUrl, serviceKey);
};
