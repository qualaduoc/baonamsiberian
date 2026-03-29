import { getSupabase, getServiceSupabase } from "./supabase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Fetch categories err:", error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function createCategory(data: { name: string; slug: string }) {
  const admin = getServiceSupabase();
  const { error } = await admin.from("categories").insert([data]);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCategory(id: string, data: { name: string; slug: string }) {
  const admin = getServiceSupabase();
  const { error } = await admin.from("categories").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCategory(id: string) {
  const admin = getServiceSupabase();
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
