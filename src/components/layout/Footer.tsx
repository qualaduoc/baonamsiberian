import Link from "next/link";
import { Send } from "lucide-react";
import { getFooterSettings } from "@/services/footerService";

export default async function Footer() {
  const footerData = await getFooterSettings();

  return (
    <footer className="bg-surface-container-lowest w-full pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className={footerData.columns.length < 2 ? "md:col-span-2" : ""}>
          <h3 className="text-xl font-bold text-primary font-heading mb-6">{footerData.companyName || "Bảo Nam"}</h3>
          <p className="text-sm leading-relaxed text-on-surface-variant mb-6 whitespace-pre-wrap">
            {footerData.description}
          </p>
        </div>

        {/* Cột 2 & 3: Các Link (Tùy biến được từ mảng columns) */}
        {footerData.columns.map((col) => (
          <div key={col.id}>
            <h4 className="font-heading font-bold text-on-surface mb-6">{col.title}</h4>
            <ul className="space-y-4">
              {col.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cột 4: Newsletter */}
        <div>
          <h4 className="font-heading font-bold text-on-surface mb-6">{footerData.newsletterTitle}</h4>
          <p className="text-sm text-on-surface-variant mb-4">{footerData.newsletterDesc}</p>
          <div className="flex">
            <input className="bg-surface-container-high border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="Email của bạn" type="email" />
            <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:brightness-110 transition-all cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-outline/10 text-center">
        <p className="text-sm text-on-surface-variant">{footerData.copyrightText}</p>
      </div>
    </footer>
  );
}
