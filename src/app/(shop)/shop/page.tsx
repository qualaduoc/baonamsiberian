import { getAllProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Search } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query ? String(resolvedParams.query) : "";
  const catSlug = resolvedParams?.category ? String(resolvedParams.category) : "";

  const rawProducts = await getAllProducts(query);
  const categories = await getCategories();

  const catMap = new Map();
  categories.forEach(c => catMap.set(c.id, c));

  const selectedCat = categories.find(c => c.slug === catSlug);

  const products = rawProducts
    .map(p => {
      if (p.category) {
        const parentCat = p.category.parent_id ? catMap.get(p.category.parent_id) : null;
        return {
          ...p,
          category: {
            ...p.category,
            parentName: parentCat ? parentCat.name : undefined
          }
        };
      }
      return p;
    })
    .filter(p => {
      if (!selectedCat) return true;
      if (!p.category) return false;
      return p.category.slug === catSlug || p.category.parent_id === selectedCat.id;
    });

  return (
    <div className="min-h-screen bg-surface pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-heading text-4xl font-extrabold text-on-surface mb-2">Cửa Hàng</h1>
            <p className="text-on-surface-variant">Tìm kiếm giải pháp thảo dược bảo vệ sức khỏe toàn diện.</p>
          </div>
          <form className="relative max-w-md w-full" method="GET">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-outline" />
            </div>
            <input
              name="query"
              type="search"
              defaultValue={query}
              className="input w-full pl-11"
              placeholder="Nhập tên sản phẩm (VD: Gan, Mắt...)"
            />
            {catSlug && <input type="hidden" name="category" value={catSlug} />}
            <button type="submit" className="hidden">Tìm</button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Lọc Danh Mục */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 sticky top-24 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-on-surface mb-4">Danh Mục Sản Phẩm</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/shop" className={`block px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${!catSlug ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}>
                    Tất Cả Sản Phẩm
                  </Link>
                </li>
                {categories.filter(c => !c.parent_id).map(parent => {
                  const isParentActive = parent.slug === catSlug;
                  const children = categories.filter(c => c.parent_id === parent.id);
                  const hasActiveChild = children.some(c => c.slug === catSlug);
                  const isExpanded = isParentActive || hasActiveChild;
                  
                  return (
                    <li key={parent.id} className="pt-2 border-t border-outline-variant/10 mt-2">
                      <Link href={`/shop?category=${parent.slug}`} className={`block px-3 py-2 rounded-xl text-sm font-bold transition-all ${isParentActive ? "bg-primary/10 text-primary border border-primary/20" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"}`}>
                        {parent.name}
                      </Link>
                      {children.length > 0 && (
                        <ul className={`ml-4 mt-2 space-y-1 border-l-2 border-outline-variant/10 pl-2 transition-all ${isExpanded ? "block animate-in fade-in" : "hidden"}`}>
                          {children.map(child => {
                            const isChildActive = child.slug === catSlug;
                            return (
                              <li key={child.id}>
                                <Link href={`/shop?category=${child.slug}`} className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isChildActive ? "text-primary font-bold bg-primary/5" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"}`}>
                                  {child.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          {/* Grid Sản Phẩm */}
          <div className="flex-1 w-full">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
                <Search className="w-12 h-12 mx-auto text-outline-variant/50 mb-4" />
                <h3 className="text-2xl font-bold font-heading text-on-surface mb-2">Chưa tìm thấy sản phẩm!</h3>
                <p className="text-on-surface-variant mb-8">Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
                <Link href="/shop" className="btn-secondary">Hiển Thị Tất Cả SP</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
