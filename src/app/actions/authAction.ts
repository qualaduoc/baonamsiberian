"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const pass = formData.get("password") as string;

    if (!email || !pass) return { error: "Vui lòng điền đủ thông tin." };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceKey) return { error: "Cấu hình server chưa sẵn sàng." };

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error || !data.session) {
      console.error("Supabase Auth Error:", error);
      return { error: "Email hoặc mật khẩu không chính xác." };
    }

    // Gắn Cookie bảo mật HTTP-Only chứa Access Token từ Supabase Auth
    const cookieStore = await cookies();
    cookieStore.set("admin_token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
    });

    return { success: true };
  } catch (err) {
    console.error("Lỗi xác thực Server:", err);
    return { error: "Server bị gián đoạn. Không thể xác thực." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}
