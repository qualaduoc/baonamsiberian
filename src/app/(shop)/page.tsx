import Link from "next/link";
import { ShieldCheck, Brain, Truck, Leaf, ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/services/productService";
import { getHeroSettings } from "@/services/heroService";
import { getFeaturedCategories } from "@/services/featuredCategoryService";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 60;

export default async function HomePage() {
  const [products, hero, featuredCats] = await Promise.all([
    getFeaturedProducts(), getHeroSettings(), getFeaturedCategories()
  ]);

  return (
    <>
      {/* Hero Section - Nội dung lấy từ Database, Admin chỉnh sửa được */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-primary-container text-on-primary-container text-sm font-bold mb-6 tracking-wide">
                {hero.badge_text}
              </span>
              <h1 className="font-heading text-5xl md:text-7xl font-extrabold leading-[1.1] text-on-surface mb-8">
                {hero.title_line1} <br />
                <span className="text-primary italic">{hero.title_highlight}</span> <br />
                {hero.title_line3}
              </h1>
              <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
                {hero.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={hero.cta_link} className="px-8 py-4 rounded-full glossy-gradient text-white font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                  {hero.cta_text}
                </Link>
                <Link href="#cam-ket" className="px-8 py-4 rounded-full border border-outline-variant/30 text-primary font-bold text-lg hover:bg-primary/5 transition-all">
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-xl overflow-hidden aspect-square shadow-2xl">
                <img className="w-full h-full object-cover" src={hero.image_url} alt="Thực phẩm chức năng cao cấp Bảo Nam" />
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-lg border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{hero.badge_icon_text}</p>
                      <p className="text-sm text-on-surface-variant">{hero.badge_subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Danh Mục Nổi Bật - Dynamic Bento Grid từ Database */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-heading text-4xl font-extrabold text-on-surface mb-4">Danh Mục Nổi Bật</h2>
              <p className="text-on-surface-variant">Chăm sóc từng khía cạnh trong cuộc sống của bạn.</p>
            </div>
            <Link href="/shop" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Xem tất cả <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredCats.map((cat, i) => {
              const isHero = i === 0;
              const isWide = i === 3;
              return (
                <Link
                  href={cat.slug?.startsWith('/') ? cat.slug : `/shop?category=${cat.slug || ''}`}
                  key={cat.id}
                  className={`relative block group overflow-hidden rounded-xl bg-surface-container-lowest ${
                    isHero ? "md:col-span-2 md:row-span-2 h-[500px]" : isWide ? "md:col-span-2 h-[238px]" : "h-[238px]"
                  }`}
                >
                  <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={cat.image_url} alt={cat.name} />
                  {isHero ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 p-8 w-full">
                        <h3 className="font-heading text-3xl font-bold text-white mb-2">{cat.name}</h3>
                        {cat.description && <p className="text-white/80 mb-6 max-w-xs">{cat.description}</p>}
                        <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm inline-block group-hover:bg-primary-container transition-colors">Khám phá</span>
                      </div>
                    </>
                  ) : isWide ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-transparent flex flex-col justify-center p-8 group-hover:from-green-900/80 transition-colors">
                        <h3 className="font-heading text-2xl font-bold text-white mb-2">{cat.name}</h3>
                        {cat.description && <p className="text-white/80 text-sm max-w-[200px]">{cat.description}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <h3 className="font-heading text-xl font-bold text-white text-center">{cat.name}</h3>
                      </div>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sản Phẩm Đang Hot */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-heading text-4xl font-extrabold text-on-surface mb-4">Sản Phẩm Đang Hot</h2>
          <div className="w-20 h-1.5 bg-primary-container mx-auto rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          )) : (
            <>
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 animate-pulse">
                  <div className="aspect-square bg-surface-container rounded-xl mb-6"></div>
                  <div className="h-3 bg-surface-container rounded w-1/3 mb-3"></div>
                  <div className="h-5 bg-surface-container rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-surface-container rounded w-full"></div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Cam Kết Bảo Nam - Why Choose Us */}
      <section id="cam-ket" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-surface-container rounded-xl overflow-hidden aspect-[4/5]">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY1lN76n1TGQX-whBhkDXWuoYXX-9KM7horPVvn79SRnKJ45AY3QVN_hJWF-g2Bwlxv7SaPkmxE8ZLzWy_VlvP0Vd-oSE567aC8ol4Tmd_C4i93IlZZi_5EeTgGeQQBVJUExoQAahBc8VHggtarKm6qI68jm2jNqHTs-F2lxJJPqc2km5pvZMaZ6jtO56z6xb6zmN2sOAKkt7-8lJEjKDdGRJAtwFWEBVO3UveVQWygsoB_JSGK02ysfpixPDydDSWbQjoQzozIXyK" alt="Tinh chất thảo dược" />
                </div>
                <div className="bg-surface-container-high rounded-xl overflow-hidden aspect-square">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNaTPeHXD1iQP0rx_YK5r9QDs173Y4u2F8ApfssJ0T3G4A2H6p-S8xCoUYzfWOUiuK2izBx3V4ZzjgmdWb26_PChbvAZQzCW63_Wjbxy-7rLBwI4nAabVNJGak3zcxIfcDlrxoIYlt-xozhN1cIPtPTa7DthD2lC9EiRb78YBWqP6xsv76sWiBLdP3PY-B0pOClQQG1tT1snbYlAO3DE426DCq2aUOgBI9cfK-Ycj4GbhpkshuCYDrrmLaedX7qZ4-lrzHHCqpm7zW" alt="Nghiên cứu" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-high rounded-xl overflow-hidden aspect-square">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUYb_k01pl6tU16pJRC6UXWSP8AsvZW_lVss3fpHRHuQ0rTfLIu5lZZqv4LSIRKUUilTOEwCwNAKqjrKgwMx0mrBsjNCz82UdYbPJLMeapt04Q_CsT2g29cHtybQ5YtYZ1uUXsDyM2TSW4FVZceFw73iG5Yna7r9V1aAAgIHAJugZVZV45T49YdANJs8SOlTnUoDf_FticOKfWyQ4r8SfA0dNZfcL6okPeHyBu-72TkK0oVMJclJ7-jWl59KfgsuLFqigGFYUS3jwl" alt="Sống khoẻ" />
                </div>
                <div className="bg-surface-container rounded-xl overflow-hidden aspect-[4/5]">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFlwRNIXe3j7sVNtzmufuvFT0BwSRoribB8UiNO5wdN-MvUOEqgmLSkybwwEv5jaDoK1rsQPuEy28lpVTkp_SAFyp_082Ka7EflOVfseqi1zf8cAPTcYl0S_EH1ttujVmYipEpBBNReegOzxwaDQ-4vhOCCUaKY8st44yGJ2yMg7aZeTupYDvjcUIbcrDx3SrkR7OrdKUlR9Eayzt298NsWwfTn2fyh9o55C-ZESXBdD4K2Jl90ePu8mrUhrVIqAtEo-bxo2OnfW__" alt="Thiên nhiên" />
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-heading text-4xl font-extrabold text-on-surface mb-8">
              Cam Kết Từ <br /><span className="text-primary">Bảo Nam Health</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-2">Chất Lượng Thượng Hạng</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Mỗi sản phẩm đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt và đạt chuẩn GMP quốc tế.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-2">Chuyên Gia Tư Vấn</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Đội ngũ bác sĩ và dược sĩ giàu kinh nghiệm sẵn sàng hỗ trợ bạn tìm ra giải pháp phù hợp nhất.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-2">Giao Hàng Tốc Hành</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Giao hàng nhanh chóng trên toàn quốc với đóng gói chuyên nghiệp, đảm bảo chất lượng nguyên vẹn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
