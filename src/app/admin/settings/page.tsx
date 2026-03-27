import HeroEditor from "@/components/admin/HeroEditor";
import SeoEditor from "@/components/admin/SeoEditor";
import TelegramEditor from "@/components/admin/TelegramEditor";
import SettingsTabs from "@/components/admin/SettingsTabs";
import { getHeroSettings } from "@/services/heroService";
import { getSeoSettings } from "@/services/seoService";
import { getTelegramSettings } from "@/services/telegramService";
import { updateSeoAction } from "@/app/actions/adminActions";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [hero, seo, telegram] = await Promise.all([
    getHeroSettings(), 
    getSeoSettings(),
    getTelegramSettings()
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading text-on-surface mb-2">Cài Đặt Trang</h1>
      <p className="text-on-surface-variant mb-6">Quản lý giao diện trang chủ, SEO và kết nối bên ngoài.</p>

      <SettingsTabs
        heroContent={<HeroEditor hero={hero} />}
        seoContent={<SeoEditor seo={seo} updateAction={updateSeoAction} />}
        telegramContent={<TelegramEditor telegram={telegram} />}
      />
    </div>
  );
}
