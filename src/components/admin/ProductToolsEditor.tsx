"use client";

import { generateInitialOrderCodesAction } from "@/app/actions/adminActions";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Zap } from "lucide-react";

export default function ProductToolsEditor() {
  const [loading, setLoading] = useState(false);

  const handleGenerateCodes = async () => {
    if (!confirm("Bắt đầu tạo mã đơn hàng cho các sản phẩm chưa có?")) return;
    setLoading(true);
    const res = await generateInitialOrderCodesAction();
    setLoading(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(res?.message || "Thành công!");
    }
  };

  return (
    <div className="max-w-xl">
      <h3 className="font-bold text-lg mb-4 text-on-surface">Công Cụ Hệ Thống Sản Phẩm</h3>
      <p className="text-sm text-on-surface-variant mb-6 mb-4">Các công cụ hỗ trợ xử lý dữ liệu tự động hoặc cập nhật hàng loạt.</p>

      <div className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-on-surface">Tạo mã đơn ban đầu</h4>
          <p className="text-xs text-on-surface-variant mt-1">
            Phát sinh tự động mã định dạng "BNxxxxxx" cho tất cả sản phẩm cũ (nếu chưa có).
          </p>
        </div>
        <button 
          onClick={handleGenerateCodes} 
          disabled={loading}
          className="btn-primary flex items-center gap-2 whitespace-nowrap !py-2 !px-4"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Khởi Tạo Ngay
        </button>
      </div>
    </div>
  );
}
