// Script tự chạy ALTER TABLE thêm cột mới qua Supabase REST SQL API
// Chạy: npx tsx scripts/migrate-db.ts

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PROJECT_REF = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

const SQL = `
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS original_price numeric;
UPDATE products SET is_active = true WHERE is_active IS NULL;

-- Tạo bảng site_settings nếu chưa có
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public read site_settings') THEN
    CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (key != 'telegram_settings');
  ELSE
    -- Recreate the policy just in case it exists to enforce security
    DROP POLICY "Public read site_settings" ON site_settings;
    CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (key != 'telegram_settings');
  END IF;
END $$;
INSERT INTO site_settings (key, value) VALUES ('hero_banner', '{}') ON CONFLICT (key) DO NOTHING;
`;

async function run() {
  console.log("🔧 Đang chạy migration Database...\n");

  // Supabase SQL API endpoint  
  const url = `${SUPABASE_URL}/rest/v1/rpc/`;

  // Thử qua pg REST API - gửi raw SQL qua fetch
  const sqlUrl = `https://${PROJECT_REF}.supabase.co/pg/query`;
  
  const res = await fetch(sqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "apikey": SERVICE_KEY,
    },
    body: JSON.stringify({ query: SQL }),
  });

  if (res.ok) {
    console.log("✅ Migration thành công!");
  } else {
    // Fallback: thử endpoint khác
    const sqlUrl2 = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
    const res2 = await fetch(sqlUrl2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "apikey": SERVICE_KEY,
      },
      body: JSON.stringify({ query: SQL }),
    });

    if (res2.ok) {
      console.log("✅ Migration thành công (via RPC)!");
    } else {
      console.log("⚠️  Không thể chạy migration tự động.");
      console.log("   Khầy cần chạy SQL bên dưới trên Supabase SQL Editor:\n");
      console.log("=".repeat(60));
      console.log(SQL);
      console.log("=".repeat(60));
    }
  }
}

run();
