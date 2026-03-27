import { Phone, Mail, MapPin, MessageSquare, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getPagesSettings } from "@/services/pagesService";

export const metadata: Metadata = {
  title: "Liên Hệ | Bảo Nam Supplements",
  description: "Trung tâm dịch vụ chăm sóc khách hàng của Bảo Nam. Hotline, Email và Địa chỉ Cửa hàng trực quan.",
};

export default async function ContactPage() {
  const pagesData = await getPagesSettings();
  const { contact } = pagesData;

  return (
    <div className="min-h-screen bg-surface pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-on-surface mb-6">Liên Hệ Với Thuốc Bảo Nam</h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">Đội ngũ Bác Sĩ Cố Vấn và Chuyên Viên Y Tế đã sẵn sàng đồng hành, giải mã mọi căn nguyên lo âu liên đới đến Bảng Thành Phần, Chỉ Định cũng như Hệ Miễn Dịch của bạn.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Thông tin Contact */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black font-heading text-on-surface mb-6">Thông Tin Trực Tuyến</h2>
            
            <div className="flex items-start gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-lg">Hotline Toàn Quốc 24/7</h4>
                <p className="text-on-surface-variant text-sm mt-1 mb-2">Trung tâm tư vấn Đơn hàng & Y Tế: Gọi để hỏi đáp Miễn Phí, Chốt đơn Ngay.</p>
                <a href={`tel:${contact.hotline.replace(/\D/g,'')}`} className="text-xl font-black text-primary font-heading tracking-widest hover:underline">{contact.hotline}</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#0068FF]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-[#0068FF]" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-lg">Chăm Sóc Khách Hàng Zalo OA</h4>
                <p className="text-on-surface-variant text-sm mt-1 mb-2">Nhắn tin Zalo với Bộ phận Kỹ Sư Công Nghệ Trực Đơn Hàng tự động của Bảo Nam.</p>
                <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center bg-[#0068FF] hover:brightness-110 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all shadow-md shadow-[#0068FF]/30">Nhắn Qua Zalo Ngay</a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
                <Mail className="w-6 h-6 text-on-surface-variant mb-2" />
                <h4 className="font-bold text-on-surface">Email</h4>
                <p className="text-primary font-medium break-all">{contact.email}</p>
              </div>
              <div className="flex flex-col gap-2 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
                <Clock className="w-6 h-6 text-on-surface-variant mb-2" />
                <h4 className="font-bold text-on-surface">Thời gian làm việc</h4>
                <p className="text-on-surface-variant">{contact.workTime}</p>
              </div>
            </div>

          </div>

          {/* Contact Form Góp Ý */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-xl border border-outline-variant/10 border-t-8 border-t-primary relative overflow-hidden">
            <h2 className="text-2xl font-black font-heading text-on-surface mb-2">Để Lại Lời Nhắn</h2>
            <p className="text-on-surface-variant mb-8 text-sm">Chúng tôi sẽ gọi hoặc phản hồi qua Email trong thời gian ngắn nhất (Tối đa 6 Tiếng).</p>
            
            <form className="space-y-5" action="/">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Họ Tên Quý Khách</label>
                <input required className="input w-full bg-surface" placeholder="Nguyễn Văn A" name="name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Số điện thoại liên lạc</label>
                <input type="tel" required className="input w-full bg-surface" placeholder="098..." name="phone" />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Vấn Đề / Góp Ý</label>
                <textarea required className="input w-full bg-surface min-h-[120px] resize-y" placeholder="Quý khách muốn báo trễ đơn, tư vấn bệnh xương khớp, hay đổi trả vì sản phẩm hư?..." name="message" />
              </div>
              
              <button type="submit" formAction={async () => { "use server" }} className="w-full btn-primary !py-4 !rounded-2xl flex items-center justify-center gap-2 mt-4 text-lg">
                <MessageSquare className="w-5 h-5" /> Gửi Yêu Cầu Liên Hệ
              </button>
            </form>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="mt-20">
          <h2 className="text-2xl font-black font-heading text-on-surface mb-6 text-center">Trực Tiếp Tham Quan Tổng Kho</h2>
          <div className="w-full h-96 bg-surface-container-highest rounded-3xl border border-outline-variant/20 flex flex-col items-center justify-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
            <MapPin className="w-16 h-16 text-primary mb-4 relative z-10" />
            <span className="font-bold text-on-surface text-xl relative z-10">{contact.mapName}</span>
            <span className="text-on-surface-variant mt-2 relative z-10">{contact.address}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
