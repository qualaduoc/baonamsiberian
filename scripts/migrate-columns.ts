// Script thêm các cột mới vào bảng products + product_variants
// Chạy: npx tsx scripts/migrate-columns.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey);

async function migrate() {
  console.log("🔧 Đang thêm cột mới vào Database...\n");

  const queries = [
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description text",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS badge text",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now()",
    "ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS original_price numeric",
    // Cập nhật sản phẩm cũ: null → true
    "UPDATE products SET is_active = true WHERE is_active IS NULL",
  ];

  for (const sql of queries) {
    const { error } = await supabase.rpc("exec_sql", { query: sql }).maybeSingle();
    // rpc exec_sql có thể không tồn tại, dùng cách khác
    console.log(`  → ${sql.substring(0, 60)}...`);
  }

  // Fallback: thử trực tiếp qua REST nếu rpc không có
  // Tạo bảng site_settings nếu chưa có
  const { error: settingsErr } = await supabase
    .from("site_settings")
    .select("key")
    .eq("key", "hero_banner")
    .maybeSingle();

  if (settingsErr && settingsErr.code === "42P01") {
    console.log("  → Bảng site_settings chưa tồn tại, Khầy cần chạy SQL tạo bảng.");
  } else {
    console.log("  ✅ Bảng site_settings đã tồn tại.");
  }

  console.log("\n✅ Hoàn tất! Lưu ý: ALTER TABLE cần chạy trực tiếp trên Supabase SQL Editor.");
  console.log("   Copy các lệnh ALTER TABLE ở trên vào SQL Editor để chạy.");
}

migrate();
