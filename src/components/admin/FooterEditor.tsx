"use client";

import { useState } from "react";
import { FooterSettings, FooterColumn, updateFooterSettings } from "@/services/footerService";
import { Plus, Trash2, GripVertical, Save, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { updateFooterAction } from "@/app/actions/adminActions";

interface Props {
  initialSettings: FooterSettings;
}

export default function FooterEditor({ initialSettings }: Props) {
  const [settings, setSettings] = useState<FooterSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleUpdateBase = (field: keyof FooterSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addColumn = () => {
    if (settings.columns.length >= 4) {
      toast.error("Tối đa 4 cột");
      return;
    }
    setSettings({
      ...settings,
      columns: [...settings.columns, { id: Date.now().toString(), title: "Cột Mới", links: [] }]
    });
  };

  const removeColumn = (id: string) => {
    setSettings({
      ...settings,
      columns: settings.columns.filter(col => col.id !== id)
    });
  };

  const updateColumnTitle = (id: string, title: string) => {
    setSettings({
      ...settings,
      columns: settings.columns.map(col => col.id === id ? { ...col, title } : col)
    });
  };

  const addLink = (colId: string) => {
    setSettings({
      ...settings,
      columns: settings.columns.map(col => {
        if (col.id === colId) {
          return { ...col, links: [...col.links, { id: Date.now().toString(), label: "Link mới", href: "/" }] };
        }
        return col;
      })
    });
  };

  const removeLink = (colId: string, linkId: string) => {
    setSettings({
      ...settings,
      columns: settings.columns.map(col => {
        if (col.id === colId) {
          return { ...col, links: col.links.filter(l => l.id !== linkId) };
        }
        return col;
      })
    });
  };

  const updateLink = (colId: string, linkId: string, field: "label" | "href", value: string) => {
    setSettings({
      ...settings,
      columns: settings.columns.map(col => {
        if (col.id === colId) {
          return {
            ...col,
            links: col.links.map(l => l.id === linkId ? { ...l, [field]: value } : l)
          };
        }
        return col;
      })
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateFooterAction(JSON.stringify(settings));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else toast.success("Đã lưu thông tin Chân Trang!");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-6">
        <div>
          <h3 className="font-bold text-lg text-on-surface">Cài Đặt Chân Trang (Footer)</h3>
          <p className="text-sm text-on-surface-variant">Tuỳ biến toàn bộ thông tin xuất hiện ở cuối website.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-primary !px-6 !py-2.5 flex items-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Lưu
        </button>
      </div>

      <div className="space-y-8">
        {/* Phần 1: Thông tin Logo & Mô tả ngắn */}
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
          <h4 className="font-bold text-primary mb-4">📍 Nhận Diện Thương Hiệu</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Tên Thương Hiệu</label>
              <input value={settings.companyName} onChange={e => handleUpdateBase("companyName", e.target.value)} className="input !w-full" placeholder="VD: Bảo Nam" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Mô Tả Ngắn</label>
              <textarea value={settings.description} onChange={e => handleUpdateBase("description", e.target.value)} className="input !w-full min-h-[50px] resize-y" placeholder="Nhập giới thiệu ngắn gọn..." />
            </div>
          </div>
        </div>

        {/* Phần 2: Đăng Ký Bản Tin & Bản Quyền */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-4">📧 Đăng Ký Bản Tin & Copyright</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Tiêu đề Bản Tin</label>
              <input value={settings.newsletterTitle} onChange={e => handleUpdateBase("newsletterTitle", e.target.value)} className="input !w-full" placeholder="VD: Đăng Ký Bản Tin" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Mô tả Bản Tin</label>
              <input value={settings.newsletterDesc} onChange={e => handleUpdateBase("newsletterDesc", e.target.value)} className="input !w-full" placeholder="VD: Nhận ưu đãi 10%..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-2">Dòng Bản Quyền (Copyright) cuối web</label>
              <input value={settings.copyrightText} onChange={e => handleUpdateBase("copyrightText", e.target.value)} className="input !w-full" placeholder="VD: © 2024 Bảo Nam." />
            </div>
          </div>
        </div>

        {/* Phần 3: Quản lý cột Menu */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-on-surface">🔗 Cột Liên Kết (Menu Giữa)</h4>
            <button onClick={addColumn} className="btn-secondary !py-1.5 !px-4 text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" /> Thêm Cột
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.columns.map(col => (
              <div key={col.id} className="border border-outline-variant/20 rounded-xl bg-surface-container-lowest p-4 relative group">
                <button onClick={() => removeColumn(col.id)} className="absolute top-4 right-4 text-error opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-error/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                <input
                  value={col.title}
                  onChange={e => updateColumnTitle(col.id, e.target.value)}
                  className="input !py-1.5 font-bold mb-4 w-3/4 text-lg"
                  placeholder="Tiêu đề cột..."
                />

                <div className="space-y-2 mb-4">
                  {col.links.map(link => (
                    <div key={link.id} className="flex items-start gap-2 relative group/link">
                      <div className="pt-2 text-outline-variant/50"><GripVertical className="w-4 h-4" /></div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input value={link.label} onChange={e => updateLink(col.id, link.id, "label", e.target.value)} className="input !py-1.5 text-sm" placeholder="Tên Link" />
                        <input value={link.href} onChange={e => updateLink(col.id, link.id, "href", e.target.value)} className="input !py-1.5 text-sm" placeholder="URL (/shop)" />
                      </div>
                      <button onClick={() => removeLink(col.id, link.id)} className="pt-2 pl-1 text-error opacity-0 group-hover/link:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => addLink(col.id)} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Thêm Link
                </button>
              </div>
            ))}
            {settings.columns.length === 0 && <p className="text-on-surface-variant text-sm col-span-full">Chưa có cột liên kết nào. Bấm Thêm Cột để tạo menu nhỏ ở chân trang.</p>}
          </div>

        </div>

      </div>
    </div>
  );
}
