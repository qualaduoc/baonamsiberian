"use server";

import { updateOrderStatus } from "@/services/adminService";
import { updateHeroSettings, type HeroSettings } from "@/services/heroService";
import { getServiceSupabase } from "@/services/supabase";
import { revalidatePath } from "next/cache";

// ========== HERO BANNER ==========
export async function updateHeroAction(formData: FormData) {
  const settings: Partial<HeroSettings> = {
    badge_text: formData.get("badge_text") as string,
    title_line1: formData.get("title_line1") as string,
    title_highlight: formData.get("title_highlight") as string,
    title_line3: formData.get("title_line3") as string,
    description: formData.get("description") as string,
    cta_text: formData.get("cta_text") as string,
    cta_link: formData.get("cta_link") as string,
    image_url: formData.get("image_url") as string,
    badge_icon_text: formData.get("badge_icon_text") as string,
    badge_subtitle: formData.get("badge_subtitle") as string,
  };
  const res = await updateHeroSettings(settings);
  revalidatePath("/");
  return res;
}

// ========== ĐƠN HÀNG ==========
export async function changeOrderStatusAction(orderId: string, newStatus: string) {
  const res = await updateOrderStatus(orderId, newStatus);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return res;
}

// ========== SẢN PHẨM ==========
export async function createProductAction(formData: FormData) {
  try {
    const supabase = getServiceSupabase();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const price = Number(formData.get("price")) || 0;
    const stock = Number(formData.get("stock")) || 100;
    const variantName = (formData.get("variantName") as string) || "Mặc định";

    if (!name || !slug) return { error: "Tên và Slug là bắt buộc." };

    // Chỉ insert cột đã tồn tại sẵn trong DB
    const { data, error } = await supabase
      .from("products")
      .insert({
        name, slug,
        description: description || null,
        category_id: categoryId || null,
        image_url: imageUrl || null,
      })
      .select("id")
      .single();

    if (error) return { error: error.message };

    // Tạo biến thể kèm giá (chỉ dùng cột cũ: name, price, stock)
    if (price > 0 && data) {
      const { error: vErr } = await supabase.from("product_variants").insert({
        product_id: data.id,
        name: variantName,
        price,
        stock,
      });
      if (vErr) console.error("Variant error:", vErr.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, productId: data.id };
  } catch { return { error: "Lỗi Server khi tạo sản phẩm." }; }
}

export async function updateProductAction(formData: FormData) {
  try {
    const supabase = getServiceSupabase();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!id || !name) return { error: "Thiếu thông tin." };

    const { error } = await supabase
      .from("products")
      .update({
        name, slug,
        description: description || null,
        category_id: categoryId || null,
        image_url: imageUrl || null,
      })
      .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch { return { error: "Lỗi Server khi cập nhật." }; }
}

export async function deleteProductAction(productId: string) {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    return { success: true };
  } catch { return { error: "Lỗi Server khi xoá." }; }
}

// ========== BIẾN THỂ ==========
export async function createVariantAction(formData: FormData) {
  try {
    const supabase = getServiceSupabase();
    const productId = formData.get("productId") as string;
    const name = formData.get("variantName") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    if (!productId || !name || !price) return { error: "Thiếu thông tin biến thể." };

    const { error } = await supabase.from("product_variants").insert({
      product_id: productId,
      name,
      price,
      stock: stock || 0,
    });

    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    return { success: true };
  } catch { return { error: "Lỗi Server khi tạo biến thể." }; }
}

export async function updateVariantAction(formData: FormData) {
  try {
    const supabase = getServiceSupabase();
    const id = formData.get("variantId") as string;
    const name = formData.get("variantName") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    if (!id) return { error: "Thiếu ID biến thể." };

    const { error } = await supabase
      .from("product_variants")
      .update({ name, price, stock })
      .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    return { success: true };
  } catch { return { error: "Lỗi Server khi cập nhật biến thể." }; }
}

export async function deleteVariantAction(variantId: string) {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase.from("product_variants").delete().eq("id", variantId);
    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    return { success: true };
  } catch { return { error: "Lỗi xoá biến thể." }; }
}

// ========== DANH MỤC ==========
export async function createCategoryAction(formData: FormData) {
  try {
    const supabase = getServiceSupabase();
    const name = formData.get("catName") as string;
    const slug = formData.get("catSlug") as string;
    if (!name || !slug) return { error: "Tên và Slug danh mục bắt buộc." };

    const { error } = await supabase.from("categories").insert({ name, slug });
    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    return { success: true };
  } catch { return { error: "Lỗi Server khi tạo danh mục." }; }
}

// ========== DANH MỤC NỔI BẬT ==========
export async function updateFeaturedCategoriesAction(categoriesJson: string) {
  try {
    const { updateFeaturedCategories } = await import("@/services/featuredCategoryService");
    const categories = JSON.parse(categoriesJson);
    const res = await updateFeaturedCategories(categories);
    revalidatePath("/");
    return res;
  } catch { return { error: "Lỗi Server khi cập nhật danh mục nổi bật." }; }
}

// ========== SEO SETTINGS ==========
export async function updateSeoAction(formData: FormData) {
  const { updateSeoSettings } = await import("@/services/seoService");
  const settings = {
    site_title: formData.get("site_title") as string,
    site_description: formData.get("site_description") as string,
    site_keywords: formData.get("site_keywords") as string,
    og_image: formData.get("og_image") as string,
    og_type: formData.get("og_type") as string,
    twitter_handle: formData.get("twitter_handle") as string,
    google_verification: formData.get("google_verification") as string,
    favicon_url: formData.get("favicon_url") as string,
    robots: formData.get("robots") as string,
    canonical_base: formData.get("canonical_base") as string,
    extra_head_tags: formData.get("extra_head_tags") as string,
  };
  const res = await updateSeoSettings(settings);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return res;
}

// ========== TELEGRAM SETTINGS ==========
export async function updateTelegramAction(formData: FormData) {
  const { updateTelegramSettings } = await import("@/services/telegramService");
  const settings = {
    bot_token: formData.get("bot_token") as string,
    chat_id: formData.get("chat_id") as string,
    is_active: formData.get("is_active") === "true",
  };
  const res = await updateTelegramSettings(settings);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return res;
}

export async function testTelegramAction(formData: FormData) {
  const token = formData.get("bot_token") as string;
  const chatId = formData.get("chat_id") as string;
  if (!token || !chatId) return { error: "Thiếu Bot Token hoặc Chat ID" };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ Cấu hình Telegram cho hệ thống Bảo Nam Siberian đã thành công!",
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      return { error: data.description || "Lỗi giao tiếp với Telegram API" };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
