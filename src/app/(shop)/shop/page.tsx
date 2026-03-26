import { getAllProducts } from "@/services/productService";
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
  const products = await getAllProducts(query);

  return (
    <div className="min-h-screen bg-surface pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-heading text-4xl font-extrabold text-on-surface mb-2">Cửa Hàng</h1>
            <p className="text-on-surface-variant">Tìm kiếm hơn 100+ giải pháp thảo dược bảo vệ sức khỏe toàn diện.</p>
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
              placeholder="Nhập tên sản phẩm (VD: Khớp, Gan...)"
            />
            <button type="submit" className="hidden">Tìm</button>
          </form>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
            <Search className="w-12 h-12 mx-auto text-outline-variant/50 mb-4" />
            <h3 className="text-2xl font-bold font-heading text-on-surface mb-2">Chưa tìm thấy sản phẩm!</h3>
            <p className="text-on-surface-variant mb-8">Vui lòng thử điều chỉnh lại từ khóa tìm kiếm.</p>
            <Link href="/shop" className="btn-secondary">Khôi Phục Danh Sách</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
