import ProductsManager from "@/components/admin/ProductsManager";
import { getServiceSupabase } from "@/services/supabase";

export const revalidate = 15;

async function getProductsWithVariants() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(`*, category:categories(id, name, slug), variants:product_variants(*)`)
    .order("created_at", { ascending: false });

  if (error) { console.error("Fetch products admin:", error); return []; }
  return (data || []).map((p: any) => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category
  }));
}

async function getCategories() {
  const supabase = getServiceSupabase();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProductsWithVariants(), getCategories()]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading text-text mb-8">Quản Lý Sản Phẩm & Kho</h1>
      <ProductsManager products={products} categories={categories} />
    </div>
  );
}
