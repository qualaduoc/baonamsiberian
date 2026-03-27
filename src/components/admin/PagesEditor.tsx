"use client";

import { useState } from "react";
import { PagesSettings } from "@/services/pagesService";
import { Save, Loader2, Info, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePagesAction } from "@/app/actions/adminActions";

interface Props {
  initialSettings: PagesSettings;
}

const TABS = [
  { key: "about", label: "Về Chúng Tôi" },
  { key: "privacy", label: "Chính Sách Bảo Mật" },
  { key: "terms", label: "Điều Khoản Dịch Vụ" },
  { key: "contact", label: "Liên Hệ" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function PagesEditor({ initialSettings }: Props) {
  const [settings, setSettings] = useState<PagesSettings>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const handleUpdateAbout = (field: keyof PagesSettings["about"], value: string) => {
    setSettings({ ...settings, about: { ...settings.about, [field]: value } });
  };

  const handleUpdateContact = (field: keyof PagesSettings["contact"], value: string) => {
    setSettings({ ...settings, contact: { ...settings.contact, [field]: value } });
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updatePagesAction(JSON.stringify(settings));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else toast.success("Đã cập nhật các Trang Tĩnh!");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-outline-variant/10 gap-4">
        <div>
          <h3 className="font-bold text-lg text-on-surface">Cấu Hình Các Trang Phụ (Trang Tĩnh)</h3>
          <p className="text-sm text-on-surface-variant">Sửa nội dung Giới thiệu, Chính sách, Điều khoản và Liên hệ.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-primary !px-6 !py-2.5 flex items-center gap-2 border-none">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Lưu Toàn Bộ
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-surface border-r border-outline-variant/10 p-4 shrink-0">
          <ul className="space-y-2">
            {TABS.map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${
                    activeTab === tab.key
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container-high border border-transparent"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && <CheckCircle2 className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 bg-surface-container-lowest">
          
          {activeTab === "about" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h4 className="font-bold text-lg text-on-surface border-b border-outline-variant/10 pb-3 mb-6">Trang "Về Chúng Tôi" (/about)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-2">Tiêu đề Hero Banner</label>
                  <input value={settings.about.heroTitle} onChange={e => handleUpdateAbout("heroTitle", e.target.value)} className="input !w-full" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-2">Mô tả Hero Banner</label>
                  <textarea value={settings.about.heroSubtitle} onChange={e => handleUpdateAbout("heroSubtitle", e.target.value)} className="input !w-full min-h-[80px]" />
                </div>
                <div className="col-span-1 md:col-span-2 border-t border-outline-variant/10 my-2"></div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-2">Tiêu đề Tầm Nhìn & Sứ Mệnh</label>
                  <input value={settings.about.missionTitle} onChange={e => handleUpdateAbout("missionTitle", e.target.value)} className="input !w-full" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-2">Nội dung Sứ Mệnh (Cho phép xuống dòng)</label>
                  <textarea value={settings.about.missionContent} onChange={e => handleUpdateAbout("missionContent", e.target.value)} className="input !w-full min-h-[150px]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Câu nói trích dẫn</label>
                  <textarea value={settings.about.quote} onChange={e => handleUpdateAbout("quote", e.target.value)} className="input !w-full min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Tên người trích dẫn (Founder)</label>
                  <input value={settings.about.quoteAuthor} onChange={e => handleUpdateAbout("quoteAuthor", e.target.value)} className="input !w-full" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3 mb-6">
                <h4 className="font-bold text-lg text-on-surface">Trang "Chính Sách Bảo Mật" (/privacy)</h4>
                <div className="group relative">
                  <Info className="w-4 h-4 text-on-surface-variant cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-on-surface text-surface text-xs p-2 rounded shadow-xl z-10 text-center">
                    Bạn có thể xuống dòng bẳng nút Enter. Website sẽ tự động ngắt dòng hiển thị cho khách đọc.
                  </div>
                </div>
              </div>
              <textarea 
                value={settings.privacyContent} 
                onChange={e => setSettings({ ...settings, privacyContent: e.target.value })} 
                className="input !w-full font-mono text-sm leading-relaxed" 
                style={{ minHeight: "350px" }}
              />
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h4 className="font-bold text-lg text-on-surface border-b border-outline-variant/10 pb-3 mb-6">Trang "Điều Khoản Dịch Vụ" (/terms)</h4>
              <textarea 
                value={settings.termsContent} 
                onChange={e => setSettings({ ...settings, termsContent: e.target.value })} 
                className="input !w-full font-mono text-sm leading-relaxed" 
                style={{ minHeight: "350px" }}
              />
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h4 className="font-bold text-lg text-on-surface border-b border-outline-variant/10 pb-3 mb-6">Trang "Liên Hệ Hỗ Trợ" (/contact)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Hotline Toàn Quốc</label>
                  <input value={settings.contact.hotline} onChange={e => handleUpdateContact("hotline", e.target.value)} className="input !w-full" placeholder="086.888.xxxx" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Email hỗ trợ</label>
                  <input value={settings.contact.email} onChange={e => handleUpdateContact("email", e.target.value)} className="input !w-full" placeholder="hotro@...vn" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Thời gian làm việc</label>
                  <input value={settings.contact.workTime} onChange={e => handleUpdateContact("workTime", e.target.value)} className="input !w-full" placeholder="08:00 AM - 10:00 PM..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Link Zalo OA trực đơn</label>
                  <input value={settings.contact.zaloUrl} onChange={e => handleUpdateContact("zaloUrl", e.target.value)} className="input !w-full" placeholder="https://zalo.me/..." />
                </div>
                <div className="col-span-1 md:col-span-2 border-t border-outline-variant/10 my-2"></div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-2">Địa chỉ cửa hàng/văn phòng</label>
                  <input value={settings.contact.address} onChange={e => handleUpdateContact("address", e.target.value)} className="input !w-full" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface mb-2">Tên vị trí (Hiển thị trên bản đồ ảo)</label>
                  <input value={settings.contact.mapName} onChange={e => handleUpdateContact("mapName", e.target.value)} className="input !w-full" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
