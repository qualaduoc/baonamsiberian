import HeroEditor from "@/components/admin/HeroEditor";
import SeoEditor from "@/components/admin/SeoEditor";
import TelegramEditor from "@/components/admin/TelegramEditor";
import ZaloEditor from "@/components/admin/ZaloEditor";
import NavbarEditor from "@/components/admin/NavbarEditor";
import FooterEditor from "@/components/admin/FooterEditor";
import PagesEditor from "@/components/admin/PagesEditor";
import FeaturedCategoriesManager from "@/components/admin/FeaturedCategoriesManager";
import SettingsTabs from "@/components/admin/SettingsTabs";
import { getHeroSettings } from "@/services/heroService";
import { getSeoSettings } from "@/services/seoService";
import { getTelegramSettings } from "@/services/telegramService";
import { getZaloSettings } from "@/services/zaloService";
import { getNavbarSettings } from "@/services/navbarService";
import { getFooterSettings } from "@/services/footerService";
import { getPagesSettings } from "@/services/pagesService";
import { getFeaturedCategories } from "@/services/featuredCategoryService";
import { updateSeoAction } from "@/app/actions/adminActions";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [hero, seo, telegram, zalo, navbar, footer, pages, featuredCats] = await Promise.all([
    getHeroSettings(), 
    getSeoSettings(),
    getTelegramSettings(),
    getZaloSettings(),
    getNavbarSettings(),
    getFooterSettings(),
    getPagesSettings(),
    getFeaturedCategories()
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading text-on-surface mb-2">Cài Đặt Trang</h1>
      <p className="text-on-surface-variant mb-6">Quản lý giao diện, Navigation, SEO và kết nối bên ngoài.</p>

      <SettingsTabs
        heroContent={<HeroEditor hero={hero} />}
        seoContent={<SeoEditor seo={seo} updateAction={updateSeoAction} />}
        navbarContent={<NavbarEditor initialNav={navbar} />}
        footerContent={<FooterEditor initialSettings={footer} />}
        pagesContent={<PagesEditor initialSettings={pages} />}
        telegramContent={<TelegramEditor telegram={telegram} />}
        zaloContent={<ZaloEditor zalo={zalo} />}
        categoriesContent={<FeaturedCategoriesManager initialCategories={featuredCats} />}
      />
    </div>
  );
}
