"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/authAction";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const tsToast = toast.loading("Đang xác thực...");

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    setLoading(false);
    if (res?.error) {
      toast.error(res.error, { id: tsToast });
    } else {
      toast.success("Đăng nhập thành công!", { id: tsToast });
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5 flex items-center justify-center p-4 relative font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="bg-surface-container-lowest relative z-10 w-full max-w-md rounded-3xl p-8 lg:p-12 shadow-xl border border-outline-variant/10">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center rotate-3 relative">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold font-heading text-on-surface mb-2 text-center tracking-tight">Cổng Quản Trị</h1>
        <p className="text-on-surface-variant text-center mb-8 text-sm">Vui lòng đăng nhập để quản lý hệ thống Bảo Nam.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative border border-outline-variant/30 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email Quản Trị
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-transparent border-none outline-none text-on-surface text-base w-full"
              placeholder="admin@baonam.vn"
            />
          </div>

          <div className="flex flex-col gap-2 relative border border-outline-variant/30 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-3 h-3" /> Mật Khẩu
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="bg-transparent border-none outline-none text-on-surface text-base w-full tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-3 w-full py-4 uppercase font-bold tracking-widest text-sm shadow-xl shadow-primary/20 disabled:opacity-70 disabled:grayscale mt-2"
          >
            {loading ? "Đang Kiểm Tra..." : (
              <>Truy Cập Quản Trị <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
