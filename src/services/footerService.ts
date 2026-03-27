import { getSupabase, getServiceSupabase } from "./supabase";

export interface FooterLink {
  id: string; // for React keys
  label: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterSettings {
  companyName: string;
  description: string;
  columns: FooterColumn[];
  newsletterTitle: string;
  newsletterDesc: string;
  copyrightText: string;
}

const DEFAULT_FOOTER: FooterSettings = {
  companyName: "Bảo Nam",
  description: "Hệ thống phân phối thực phẩm chức năng hàng đầu Việt Nam. Tận tâm vì sức khỏe cộng đồng với những sản phẩm chất lượng nhất.",
  columns: [
    {
      id: "col-1",
      title: "Liên Kết",
      links: [
        { id: "l1-1", label: "Về chúng tôi", href: "/about" },
        { id: "l1-2", label: "Chính sách bảo mật", href: "/privacy" },
        { id: "l1-3", label: "Điều khoản dịch vụ", href: "/terms" },
        { id: "l1-4", label: "Liên hệ hỗ trợ", href: "/contact" },
      ]
    },
    {
      id: "col-2",
      title: "Sản Phẩm",
      links: [
        { id: "l2-1", label: "Vitamin & Khoáng chất", href: "/shop" },
        { id: "l2-2", label: "Sức khỏe tim mạch", href: "/shop" },
        { id: "l2-3", label: "Hỗ trợ tiêu hóa", href: "/shop" },
        { id: "l2-4", label: "Làm đẹp & Collagen", href: "/shop" },
      ]
    }
  ],
  newsletterTitle: "Đăng Ký Bản Tin",
  newsletterDesc: "Nhận ưu đãi 10% cho đơn hàng đầu tiên của bạn.",
  copyrightText: "© 2024 Thực phẩm chức năng Bảo Nam. Bảo vệ sức khỏe của bạn."
};

export const getFooterSettings = async (): Promise<FooterSettings> => {
  try {
    const { data } = await getSupabase().from("site_settings").select("footer_settings").single();
    if (data?.footer_settings) {
      return { ...DEFAULT_FOOTER, ...data.footer_settings };
    }
  } catch (error) {
    console.error("Fetch footer settings error:", error);
  }
  return DEFAULT_FOOTER;
};

export const updateFooterSettings = async (settings: FooterSettings) => {
  try {
    const admin = getServiceSupabase();
    // upsert since id=1 is our single settings row
    const { error } = await admin.from("site_settings").upsert({
      id: 1,
      footer_settings: settings,
      updated_at: new Date().toISOString()
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
};
