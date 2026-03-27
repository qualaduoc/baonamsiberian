import { Award, Leaf, Users } from "lucide-react";
import type { Metadata } from "next";
import { getPagesSettings } from "@/services/pagesService";

export const metadata: Metadata = {
  title: "Về CHúng Tôi | Bảo Nam Supplements",
  description: "Bảo Nam là hệ thống phân phối thực phẩm chức năng hàng đầu Việt Nam. Tận tâm vì sức khỏe gia đình bạn.",
};

export default async function AboutPage() {
  const pagesData = await getPagesSettings();
  const { about } = pagesData;

  return (
    <div className="min-h-screen bg-surface pt-28 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Banner Về Chúng Tôi */}
        <div className="bg-primary text-white rounded-3xl p-12 text-center mb-16 shadow-lg shadow-primary/20 bg-gradient-to-br from-primary to-primary-dim relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-6 leading-tight whitespace-pre-wrap">{about.heroTitle}</h1>
            <p className="text-lg opacity-90 leading-relaxed font-medium whitespace-pre-wrap">{about.heroSubtitle}</p>
          </div>
        </div>

        {/* 3 Trụ Cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 text-center hover:-translate-y-2 transition-transform shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3 font-heading text-primary">Thuần Tự Nhiên</h3>
            <p className="text-on-surface-variant leading-relaxed">Luôn tiên phong lựa chọn các dòng sản phẩm chiết xuất từ dược liệu quý hiếm, hạn chế tối đa sử dụng tá dược.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 text-center hover:-translate-y-2 transition-transform shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3 font-heading text-primary">Nhập Khẩu Chính Hãng</h3>
            <p className="text-on-surface-variant leading-relaxed">Đầy đủ chứng nhận kiểm định quốc tế, mang lại hiệu quả thật sự, cam kết an toàn cho sức khỏe người dùng.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 text-center hover:-translate-y-2 transition-transform shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3 font-heading text-primary">Tư Vấn Tận Tâm</h3>
            <p className="text-on-surface-variant leading-relaxed">Đội ngũ chuyên viên không chỉ bán hàng mà còn đóng vai trò như những người bạn đồng hành dài hạn với sức khỏe của bạn.</p>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-16 shadow-sm border border-outline-variant/10 prose prose-lg max-w-none text-on-surface-variant">
          <h2 className="text-3xl font-black font-heading text-on-surface mb-8">{about.missionTitle}</h2>
          <div className="whitespace-pre-wrap font-medium text-lg text-on-surface/90 leading-relaxed mb-8">
            {about.missionContent}
          </div>
          <blockquote>
            "{about.quote}"
            <br />
            <cite className="text-primary font-bold mt-2 inline-block">— {about.quoteAuthor}</cite>
          </blockquote>
        </div>

      </div>
    </div>
  );
}
