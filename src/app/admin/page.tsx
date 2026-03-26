import { getDashboardStats } from "@/services/adminService";
import { TrendingUp, Clock, CheckCircle2, XCircle, DollarSign, ShoppingCart, CalendarDays } from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import FeaturedCategoriesManager from "@/components/admin/FeaturedCategoriesManager";
import { getFeaturedCategories } from "@/services/featuredCategoryService";

export const revalidate = 30;

export default async function AdminDashboardPage() {
  const [stats, featuredCats] = await Promise.all([getDashboardStats(), getFeaturedCategories()]);
  const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading text-on-surface mb-8">Tổng Quan Doanh Thu</h1>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><DollarSign className="w-7 h-7 text-primary" /></div>
          <div>
            <span className="text-on-surface-variant font-semibold text-sm uppercase tracking-wider block mb-1">Hôm Nay</span>
            <span className="text-3xl font-bold font-heading text-primary">{fmtVND(stats.todayRevenue)}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex items-start gap-4">
          <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0"><CalendarDays className="w-7 h-7 text-secondary" /></div>
          <div>
            <span className="text-on-surface-variant font-semibold text-sm uppercase tracking-wider block mb-1">7 Ngày</span>
            <span className="text-3xl font-bold font-heading text-secondary">{fmtVND(stats.weekRevenue)}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex items-start gap-4">
          <div className="w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center shrink-0"><TrendingUp className="w-7 h-7 text-tertiary" /></div>
          <div>
            <span className="text-on-surface-variant font-semibold text-sm uppercase tracking-wider block mb-1">Tháng Này</span>
            <span className="text-3xl font-bold font-heading text-tertiary">{fmtVND(stats.monthRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Chart + Order Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart weeklyData={stats.dailyRevenue} />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 text-center">
            <ShoppingCart className="w-7 h-7 text-outline mx-auto mb-2" />
            <span className="text-2xl font-bold font-heading text-on-surface block">{stats.totalOrders}</span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Tổng Đơn</span>
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl shadow-sm border border-amber-100 text-center">
            <Clock className="w-7 h-7 text-amber-500 mx-auto mb-2" />
            <span className="text-2xl font-bold font-heading text-amber-600 block">{stats.pendingOrders}</span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Đang Chờ</span>
          </div>
          <div className="bg-green-50 p-5 rounded-2xl shadow-sm border border-green-100 text-center">
            <CheckCircle2 className="w-7 h-7 text-green-500 mx-auto mb-2" />
            <span className="text-2xl font-bold font-heading text-green-600 block">{stats.completedOrders}</span>
            <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Thành Công</span>
          </div>
          <div className="bg-rose-50 p-5 rounded-2xl shadow-sm border border-rose-100 text-center">
            <XCircle className="w-7 h-7 text-rose-400 mx-auto mb-2" />
            <span className="text-2xl font-bold font-heading text-rose-500 block">{stats.cancelledOrders}</span>
            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Đã Huỷ</span>
          </div>
        </div>
      </div>

      {/* Danh Mục Nổi Bật */}
      <FeaturedCategoriesManager initialCategories={featuredCats} />
    </div>
  );
}
