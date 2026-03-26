import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env_check: {},
    db_connection: null,
    auth_test: null,
  };

  // 1. Kiểm tra biến môi trường
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  results.env_check = {
    NEXT_PUBLIC_SUPABASE_URL: url ? `✅ ${url}` : "❌ MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `✅ ...${anonKey.slice(-10)}` : "❌ MISSING",
    SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `✅ ...${serviceKey.slice(-10)}` : "❌ MISSING",
  };

  // 2. Test kết nối DB bằng anon key
  if (url && anonKey) {
    try {
      const supabase = createClient(url, anonKey);
      const { data, error } = await supabase.from("products").select("id, name").limit(3);
      results.db_connection = {
        status: error ? "❌ FAILED" : "✅ OK",
        error: error?.message || null,
        product_count: data?.length ?? 0,
        sample: data?.map((p: any) => p.name) || [],
      };
    } catch (err: any) {
      results.db_connection = { status: "❌ EXCEPTION", error: err.message };
    }
  } else {
    results.db_connection = { status: "❌ SKIPPED", reason: "Missing env vars" };
  }

  // 3. Test auth bằng service key
  if (url && serviceKey) {
    try {
      const adminClient = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 5 });
      results.auth_test = {
        status: error ? "❌ FAILED" : "✅ OK",
        error: error?.message || null,
        user_count: data?.users?.length ?? 0,
        users: data?.users?.map((u: any) => ({ email: u.email, role: u.role })) || [],
      };
    } catch (err: any) {
      results.auth_test = { status: "❌ EXCEPTION", error: err.message };
    }
  } else {
    results.auth_test = { status: "❌ SKIPPED", reason: "Missing service key" };
  }

  return NextResponse.json(results, { status: 200 });
}
