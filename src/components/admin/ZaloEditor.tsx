"use client";

import { useState } from "react";
import { updateZaloAction, testZaloAction } from "@/app/actions/adminActions";
import { ZaloSettings } from "@/services/zaloService";
import { Save, Webhook, Loader2, Play } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  zalo: ZaloSettings;
}

export default function ZaloEditor({ zalo }: Props) {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(zalo.endpoint || "https://zl.aiphocap.vn/api/webhook/order");
  const [apiKey, setApiKey] = useState(zalo.api_key || "");
  const [isActive, setIsActive] = useState(zalo.is_active || false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isActive && !apiKey) {
      toast.error("Vui lòng nhập API Key để bật tính năng");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("endpoint", endpoint);
    formData.append("api_key", apiKey);
    if (isActive) formData.append("is_active", "on");

    const res = await updateZaloAction(formData);
    setLoading(false);

    if (res?.error) toast.error(res.error);
    else toast.success("Đã lưu cấu hình BOT Zalo!");
  };

  const handleTest = async () => {
    if (!apiKey) {
      toast.error("Thiếu X-API-Key để test.");
      return;
    }
    setTestLoading(true);
    const formData = new FormData();
    formData.append("endpoint", endpoint);
    formData.append("api_key", apiKey);
    const res = await testZaloAction(formData);
    setTestLoading(false);

    if (res?.error) toast.error(res.error);
    else toast.success("Bot đã báo tin nhắn Test vào Zalo!");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-6 max-w-2xl">
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-outline-variant/10">
        <div className="w-12 h-12 rounded-xl bg-[#0068FF]/10 flex items-center justify-center shrink-0">
          <Webhook className="w-6 h-6 text-[#0068FF]" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-on-surface">Kết nối AI Phổ Cập BOT (Zalo)</h3>
          <p className="text-sm text-on-surface-variant">Tự động bắn webhook báo đơn hàng mới vào Group Zalo.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Endpoint URL (Bắt buộc)</label>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            required
            className="input !w-full"
            placeholder="Ví dụ: https://zl.aiphocap.vn/api/webhook/order"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">X-API-Key (Khóa bảo mật)</label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input !w-full"
            placeholder="Ví dụ: apikey-abcxyz..."
          />
        </div>

        <label className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container/50 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 rounded text-[#0068FF] focus:ring-[#0068FF]"
          />
          <div>
            <p className="font-bold text-on-surface text-sm">Bật tính năng báo đơn qua Zalo</p>
            <p className="text-xs text-on-surface-variant">Khi có khách hàng thanh toán thành công, hệ thống sẽ tự động gọi Webhook.</p>
          </div>
        </label>

        <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
          <button type="submit" disabled={loading} className="btn-primary !px-6 !py-2.5 !rounded-lg text-sm flex gap-2 items-center bg-[#0068FF] hover:bg-[#0052cc]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu Cài Đặt
          </button>
          
          <button 
            type="button" 
            onClick={handleTest} 
            disabled={testLoading || !apiKey} 
            className="btn-secondary !px-6 !py-2.5 !rounded-lg text-sm flex gap-2 items-center text-[#0068FF] border-[#0068FF]/30 hover:bg-[#0068FF]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Test Tin Nhắn
          </button>
        </div>
      </form>
    </div>
  );
}
