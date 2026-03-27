import { getSupabase, getServiceSupabase } from "./supabase";

export interface PagesSettings {
  about: {
    heroTitle: string;
    heroSubtitle: string;
    missionTitle: string;
    missionContent: string;
    quote: string;
    quoteAuthor: string;
  };
  privacyContent: string;
  termsContent: string;
  contact: {
    hotline: string;
    zaloUrl: string;
    email: string;
    workTime: string;
    address: string;
    mapName: string;
  };
}

const DEFAULT_PAGES: PagesSettings = {
  about: {
    heroTitle: "Về Bảo Nam\nHành Trình Chăm Sóc Sức Khỏe",
    heroSubtitle: "Chúng tôi không chỉ bán thực phẩm chức năng. Chúng tôi kiến tạo nên một tiêu chuẩn sức khỏe toàn diện và thuần tự nhiên cho cộng đồng.",
    missionTitle: "Tầm Nhìn & Sứ Mệnh",
    missionContent: "Khởi nguồn từ khao khát mang đến giải pháp sức khỏe an toàn không phụ thuộc thuốc tây, Bảo Nam Supplements ra đời với mục tiêu duy nhất là bảo vệ lá chắn sinh học từ sâu bên trong tế bào.\n\nMỗi sản phẩm lên kệ đều được nghiên cứu, trải nghiệm trực tiếp và lọc qua những bài kiểm tra gắt gao nhất về tính sinh khả dụng. Chúng tôi kiên định nói KHÔNG với gian lận và thành phần độc hại.",
    quote: "Sức khỏe của bạn, danh dự của chúng tôi. Tại Bảo Nam, chúng tôi phân phối bằng cả cái Tâm và Tầm.",
    quoteAuthor: "Founder",
  },
  privacyContent: "Cảm ơn quý khách đã truy cập website.\n\n1. Mục đích thu thập thông tin:\n- Xác nhận đơn đặt hàng.\n- Giao hàng và hỗ trợ khách hàng.\n\n2. Bảo mật thông tin:\nBảo Nam cam kết KHÔNG BÁN, KHÔNG CHIA SẺ thông tin cá nhân của khách hàng cho bên thứ ba.\n\n3. Quyền lợi:\nBạn hoàn toàn có quyền yêu cầu cập nhật hoặc xóa dữ liệu của mình bằng cách liên hệ Hotline.",
  termsContent: "Bằng việc truy cập và mua hàng, bạn đồng ý:\n\n1. Trách nhiệm y khoa:\nSản phẩm KHÔNG PHẢI LÀ THUỐC VÀ KHÔNG CÓ TÁC DỤNG THAY THẾ THUỐC CHỮA BỆNH.\n\n2. Đặt hàng:\nChúng tôi có quyền từ chối giao dịch nếu phát hiện gian lận.\n\n3. Đổi trả:\nMiễn phí 1 đổi 1 nếu lỗi do vận chuyển hoặc nhà sản xuất. Hàng đã bóc tem không áp dụng hoàn tiền.",
  contact: {
    hotline: "086.888.XXXX",
    zaloUrl: "https://zalo.me/...",
    email: "hotro@baonamsiberian.vn",
    workTime: "08:00 AM - 10:00 PM (Thứ 2 - CN)",
    address: "Tầng 9, Tòa tháp Công Nghệ A, 1 Lê Duẩn, Q.1",
    mapName: "Trung Tâm Lưu Trữ TPCN Bảo Nam",
  }
};

export const getPagesSettings = async (): Promise<PagesSettings> => {
  try {
    const { data } = await getSupabase().from("site_settings").select("pages_settings").single();
    if (data?.pages_settings) {
      return { ...DEFAULT_PAGES, ...data.pages_settings };
    }
  } catch (error) {
    console.error("Fetch pages settings error:", error);
  }
  return DEFAULT_PAGES;
};

export const updatePagesSettings = async (settings: PagesSettings) => {
  try {
    const admin = getServiceSupabase();
    const { error } = await admin.from("site_settings").upsert({
      id: 1,
      pages_settings: settings,
      updated_at: new Date().toISOString()
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
};
