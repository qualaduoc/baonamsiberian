import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getPagesSettings } from "@/services/pagesService";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | Bảo Nam Supplements",
  description: "Trang thông tin về chính sách bảo mật dữ liệu và quyền riêng tư dành cho khách hàng của Bảo Nam.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getPagesSettings();

  return (
    <div className="min-h-screen bg-surface pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/10">
          
          <div className="flex flex-col items-center mb-10 text-center border-b border-outline-variant/10 pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-heading text-on-surface">Chính Sách Bảo Mật</h1>
          </div>

          <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed whitespace-pre-wrap font-medium">
            {settings.privacyContent}
          </div>

        </div>
      </div>
    </div>
  );
}
