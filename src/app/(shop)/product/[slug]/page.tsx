import { getProductBySlug, getAllProducts } from "@/services/productService";
import { notFound } from "next/navigation";
import AddToCartForm from "@/components/product/AddToCartForm";
import { ShieldCheck, Leaf, ArrowLeft, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// SEO Meta Tags động: og, twitter, keywords, canonical
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return { title: "Sản phẩm không tồn tại | Bảo Nam" };
  }

  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map((v: any) => v.price))
    : 0;

  const priceStr = lowestPrice > 0
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(lowestPrice)
    : "";

  const desc = product.description || `Mua ${product.name} chính hãng tại Bảo Nam. Thực phẩm chức năng cao cấp chiết xuất từ thảo dược tự nhiên.`;
  const categoryName = product.category?.name || "Thực phẩm chức năng";

  return {
    title: `${product.name} ${priceStr} | Bảo Nam Supplements`,
    description: desc,
    keywords: [product.name, categoryName, "thực phẩm chức năng", "Bảo Nam", "thảo dược", "sức khỏe"].join(", "),
    alternates: {
      canonical: `/product/${resolvedParams.slug}`,
    },
    openGraph: {
      title: `${product.name} | Bảo Nam`,
      description: desc,
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
      siteName: "Bảo Nam Supplements",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} ${priceStr}`,
      description: desc,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

/** JSON-LD Product Schema cho Google Rich Snippets */
function ProductJsonLd({ product }: { product: any }) {
  const lowestPrice = product.variants?.length ? Math.min(...product.variants.map((v: any) => v.price)) : 0;
  const highestPrice = product.variants?.length ? Math.max(...product.variants.map((v: any) => v.price)) : 0;
  const inStock = product.variants?.some((v: any) => v.stock > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Thực phẩm chức năng ${product.name} - Bảo Nam Health`,
    image: product.image_url || "",
    brand: { "@type": "Brand", name: "Bảo Nam" },
    category: product.category?.name || "Thực phẩm chức năng",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      priceCurrency: "VND",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Bảo Nam Supplements" },
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="min-h-screen bg-surface pt-28 pb-32">
        <div className="max-w-7xl mx-auto px-6">

          <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary-dim mb-10 transition-colors bg-primary/5 px-4 py-2 rounded-full text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Quay lại Cửa Hàng
          </Link>

          <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-12 shadow-lg border border-outline-variant/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

              {/* Ảnh sản phẩm */}
              <div className="group space-y-4">
                <div className="aspect-[4/5] bg-surface rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <Package className="w-32 h-32 text-outline-variant/20 group-hover:scale-125 transition-transform duration-700" />
                  )}
                  {product.category && (
                    <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-on-surface text-sm font-bold px-4 py-2 rounded-full border border-outline-variant/10 shadow-sm tracking-widest uppercase">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Chi tiết sản phẩm */}
              <div className="flex flex-col pt-4">
                <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-on-surface mb-4 leading-tight tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full w-max mb-6">
                  <Sparkles className="w-5 h-5" /> 100% Khách hàng đánh giá phản hồi tốt
                </div>
                <div className="prose prose-lg text-on-surface-variant mb-8 leading-relaxed max-w-none">
                  {product.description || (
                    <p>
                      Đây là dòng sản phẩm cao cấp được bào chế đặc biệt với phương pháp sinh học tế bào giúp
                      phát huy công dụng tối đa của thảo dược thiên nhiên chuẩn châu Âu.
                      <br /><br />
                      • Hỗ trợ toàn diện cấu trúc màng tế bào. <br />
                      • Tăng sinh tái tạo ngay từ liệu trình đầu tiên. <br />
                      • An toàn tuyệt đối, không có tác dụng phụ.
                    </p>
                  )}
                </div>
                <hr className="border-outline-variant/10 mb-2" />
                <AddToCartForm product={product} />
                {/* Trust badges */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-outline-variant/10">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-outline-variant/10">
                    <Leaf className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-bold text-on-surface text-sm font-heading mb-1 uppercase tracking-wide">Thuần Tự Nhiên</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Không chứa dược chất tân dược nhân tạo và dư lượng kháng sinh.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-outline-variant/10">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-bold text-on-surface text-sm font-heading mb-1 uppercase tracking-wide">Bộ Y Tế Cấp Phép</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Số chứng nhận an toàn VSTP-2026/BN hợp quy toàn quốc.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
