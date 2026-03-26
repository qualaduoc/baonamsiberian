"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getAdminClient() {
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Lấy danh sách users từ Supabase Auth */
export async function listUsersAction() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return { error: error.message };

    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email || "",
      role: u.user_metadata?.role || "admin",
      name: u.user_metadata?.name || "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at || null,
    }));

    return { users };
  } catch { return { error: "Lỗi server khi lấy danh sách user." }; }
}

/** Tạo user mới */
export async function createUserAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = (formData.get("role") as string) || "manager";

    if (!email || !password) return { error: "Email và mật khẩu bắt buộc." };
    if (password.length < 6) return { error: "Mật khẩu tối thiểu 6 ký tự." };

    const supabase = getAdminClient();
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
  } catch { return { error: "Lỗi server khi tạo user." }; }
}

/** Đổi mật khẩu (admin đổi cho chính mình hoặc user khác) */
export async function changePasswordAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!userId || !newPassword) return { error: "Thiếu thông tin." };
    if (newPassword.length < 6) return { error: "Mật khẩu tối thiểu 6 ký tự." };

    const supabase = getAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) return { error: error.message };
    return { success: true };
  } catch { return { error: "Lỗi server khi đổi mật khẩu." }; }
}

/** Cập nhật thông tin user (tên, role) */
export async function updateUserAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    if (!userId) return { error: "Thiếu User ID." };

    const supabase = getAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { name, role },
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
  } catch { return { error: "Lỗi server khi cập nhật user." }; }
}

/** Xoá user */
export async function deleteUserAction(userId: string) {
  try {
    if (!userId) return { error: "Thiếu User ID." };

    const supabase = getAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) return { error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
  } catch { return { error: "Lỗi server khi xoá user." }; }
}
