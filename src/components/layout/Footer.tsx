import Link from "next/link";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-xl font-bold text-primary font-heading mb-6">Bảo Nam</h3>
          <p className="text-sm leading-relaxed text-on-surface-variant mb-6">
            Hệ thống phân phối thực phẩm chức năng hàng đầu Việt Nam. Tận tâm vì sức khỏe cộng đồng với những sản phẩm chất lượng nhất.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-bold text-on-surface mb-6">Liên Kết</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Về chúng tôi</Link></li>
            <li><Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Chính sách bảo mật</Link></li>
            <li><Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Điều khoản dịch vụ</Link></li>
            <li><Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Liên hệ hỗ trợ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold text-on-surface mb-6">Sản Phẩm</h4>
          <ul className="space-y-4">
            <li><Link href="/shop" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Vitamin & Khoáng chất</Link></li>
            <li><Link href="/shop" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Sức khỏe tim mạch</Link></li>
            <li><Link href="/shop" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Hỗ trợ tiêu hóa</Link></li>
            <li><Link href="/shop" className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Làm đẹp & Collagen</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold text-on-surface mb-6">Đăng Ký Bản Tin</h4>
          <p className="text-sm text-on-surface-variant mb-4">Nhận ưu đãi 10% cho đơn hàng đầu tiên của bạn.</p>
          <div className="flex">
            <input className="bg-surface-container-high border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="Email của bạn" type="email" />
            <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:brightness-110 transition-all cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-outline/10 text-center">
        <p className="text-sm text-on-surface-variant">© 2024 Thực phẩm chức năng Bảo Nam. Bảo vệ sức khỏe của bạn.</p>
      </div>
    </footer>
  );
}
