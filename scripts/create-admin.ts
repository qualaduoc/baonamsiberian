// Script tạo Admin User qua Supabase Auth Admin API
// Chạy 1 lần duy nhất: npx tsx scripts/create-admin.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdmin() {
  const email = "admin@baonam.vn";
  const password = "admin123";

  console.log("🔧 Đang tạo Admin User qua Supabase Auth Admin API...");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);

  // Xóa user cũ nếu có (tránh conflict)
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);
  if (existing) {
    console.log("⚠️  User đã tồn tại, đang xóa để tạo lại...");
    await supabase.auth.admin.deleteUser(existing.id);
  }

  // Tạo user mới
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Tự động xác nhận email, không cần verify
  });

  if (error) {
    console.error("❌ Lỗi tạo Admin:", error.message);
    process.exit(1);
  }

  console.log("✅ Tạo Admin User thành công!");
  console.log(`   User ID: ${data.user.id}`);
  console.log("");
  console.log("📋 Thông tin đăng nhập:");
  console.log(`   URL:      http://localhost:3000/login`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
}

createAdmin();
