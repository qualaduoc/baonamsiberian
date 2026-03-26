import { getSupabase } from "./supabase";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  badge: string | null;
  is_active: boolean;
  category: Category | null;
  variants: ProductVariant[];
}

const PRODUCT_SELECT = `
  *,
  category:categories(id, name, slug),
  variants:product_variants(*)
`;

function mapProduct(item: any): Product {
  return {
    ...item,
    category: Array.isArray(item.category) ? item.category[0] : item.category,
  };
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await getSupabase()
    .from("products")
    .select(PRODUCT_SELECT)
    .limit(8);

  if (error) { console.error("Fetch featured:", error); return []; }
  return (data || []).map(mapProduct);
};

export const getAllProducts = async (searchQuery?: string): Promise<Product[]> => {
  let query = getSupabase().from("products").select(PRODUCT_SELECT);
  if (searchQuery) query = query.ilike("name", `%${searchQuery}%`);

  const { data, error } = await query;
  if (error) { console.error("Fetch all:", error); return []; }
  return (data || []).map(mapProduct);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await getSupabase()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) { console.error("Fetch by slug:", error); return null; }
  return mapProduct(data);
};
