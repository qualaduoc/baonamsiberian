"use client";

import { useState, useMemo, useRef } from "react";
import { OrderWithItems } from "@/services/adminService";
import { TrendingUp, Calendar, Printer, BarChart3, Package, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  orders: OrderWithItems[];
}

type Period = "day" | "week" | "month";

const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function OrderReportPanel({ orders }: Props) {
  const [period, setPeriod] = useState<Period>("week");
  const [activeTab, setActiveTab] = useState<"revenue" | "products">("revenue");
  const reportRef = useRef<HTMLDivElement>(null);

  const now = new Date();

  const filteredOrders = useMemo(() => {
    const cutoff = new Date();
    if (period === "day") cutoff.setHours(0, 0, 0, 0);
    else if (period === "week") cutoff.setDate(cutoff.getDate() - 7);
    else cutoff.setDate(1);

    return orders.filter((o) => new Date(o.created_at) >= cutoff);
  }, [orders, period]);

  const completedOrders = filteredOrders.filter((o) => o.status === "completed");

  // ===== DOANH THU =====
  const revenueStats = useMemo(() => {
    const total = completedOrders.reduce((s, o) => s + o.total_amount, 0);
    const count = completedOrders.length;
    const avgPerOrder = count > 0 ? total / count : 0;

    // Revenue by day
    const dailyMap = new Map<string, number>();
    completedOrders.forEach((o) => {
      const key = o.created_at.slice(0, 10);
      dailyMap.set(key, (dailyMap.get(key) || 0) + o.total_amount);
    });
    const dailyRevenue = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, rev]) => ({ date, revenue: rev }));

    const maxDaily = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

    return { total, count, avgPerOrder, dailyRevenue, maxDaily };
  }, [completedOrders]);

  // ===== SẢN PHẨM BÁN CHẠY =====
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; variant: string; qty: number; revenue: number }>();
    completedOrders.forEach((o) => {
      o.order_items.forEach((oi) => {
        const productName = oi.variant?.product?.name || "Sản phẩm";
        const variantName = oi.variant?.name || "";
        const key = `${productName}|||${variantName}`;
        const existing = map.get(key) || { name: productName, variant: variantName, qty: 0, revenue: 0 };
        existing.qty += oi.quantity;
        existing.revenue += oi.price * oi.quantity;
        map.set(key, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [completedOrders]);

  const totalProductRevenue = topProducts.reduce((s, p) => s + p.revenue, 0);

  // ===== IN BÁO CÁO =====
  const handlePrint = () => {
    const content = reportRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Báo Cáo Doanh Thu - Bảo Nam</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,sans-serif;padding:40px;color:#222}
        h1{font-size:24px;margin-bottom:8px}
        h2{font-size:18px;margin:24px 0 12px;color:#059669;border-bottom:2px solid #059669;padding-bottom:4px}
        .subtitle{color:#666;font-size:14px;margin-bottom:24px}
        table{width:100%;border-collapse:collapse;margin-bottom:24px}
        th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #eee;font-size:13px}
        th{background:#f9fafb;font-weight:700;text-transform:uppercase;font-size:11px;color:#666}
        .right{text-align:right}
        .bold{font-weight:700}
        .green{color:#059669}
        .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
        .stat-card{background:#f9fafb;padding:16px;border-radius:8px;text-align:center}
        .stat-value{font-size:22px;font-weight:800;color:#059669}
        .stat-label{font-size:11px;color:#666;text-transform:uppercase;margin-top:4px}
        .rank{color:#999;font-size:12px}
        .bar{height:8px;border-radius:4px;background:#d1fae5;margin-top:4px}
        .bar-fill{height:100%;border-radius:4px;background:#059669}
        @media print{body{padding:20px}}
      </style></head><body>
      <h1>📊 Báo Cáo Doanh Thu - Bảo Nam Health</h1>
      <p class="subtitle">Kỳ báo cáo: ${period === "day" ? "Hôm nay" : period === "week" ? "7 ngày qua" : "Tháng này"} · In lúc: ${new Date().toLocaleString("vi-VN")}</p>
      
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${fmtVND(revenueStats.total)}</div><div class="stat-label">Tổng doanh thu</div></div>
        <div class="stat-card"><div class="stat-value">${revenueStats.count}</div><div class="stat-label">Đơn hoàn thành</div></div>
        <div class="stat-card"><div class="stat-value">${fmtVND(revenueStats.avgPerOrder)}</div><div class="stat-label">TB / đơn</div></div>
      </div>

      <h2>Doanh Thu Theo Ngày</h2>
      <table>
        <thead><tr><th>Ngày</th><th class="right">Doanh thu</th></tr></thead>
        <tbody>${revenueStats.dailyRevenue.map((d) => `<tr><td>${fmtDate(d.date)}</td><td class="right bold green">${fmtVND(d.revenue)}</td></tr>`).join("")}</tbody>
      </table>

      <h2>Sản Phẩm Bán Chạy (xếp theo lượt mua)</h2>
      <table>
        <thead><tr><th>#</th><th>Sản Phẩm</th><th>Quy Cách</th><th class="right">Số Lượng</th><th class="right">Doanh Thu</th></tr></thead>
        <tbody>${topProducts.map((p, i) => `<tr><td class="rank">${i + 1}</td><td class="bold">${p.name}</td><td>${p.variant}</td><td class="right bold">${p.qty}</td><td class="right bold green">${fmtVND(p.revenue)}</td></tr>`).join("")}</tbody>
      </table>

      <p style="text-align:center;color:#999;margin-top:32px;font-size:12px">Bảo Nam Supplements · Hệ thống quản lý nội bộ</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  const PERIOD_LABELS: Record<Period, string> = { day: "Hôm nay", week: "7 ngày", month: "Tháng này" };

  return (
    <div ref={reportRef} className="space-y-6">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="font-bold text-lg text-on-surface">Báo Cáo Doanh Thu</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period selector */}
          <div className="flex bg-surface rounded-xl border border-outline-variant/15 overflow-hidden">
            {(["day", "week", "month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-bold transition-all cursor-pointer ${period === p ? "bg-primary text-white" : "text-on-surface-variant hover:bg-primary/5"}`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
          {/* Tab selector */}
          <div className="flex bg-surface rounded-xl border border-outline-variant/15 overflow-hidden">
            <button onClick={() => setActiveTab("revenue")} className={`px-4 py-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-1 ${activeTab === "revenue" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-primary/5"}`}>
              <DollarSign className="w-3.5 h-3.5" /> Doanh thu
            </button>
            <button onClick={() => setActiveTab("products")} className={`px-4 py-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-1 ${activeTab === "products" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-primary/5"}`}>
              <Package className="w-3.5 h-3.5" /> Bán chạy
            </button>
          </div>
          {/* Print */}
          <button onClick={handlePrint} className="btn-secondary !py-2 !px-4 !rounded-xl text-sm cursor-pointer flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> In báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Doanh thu</span>
          <span className="text-2xl font-black font-heading text-primary">{fmtVND(revenueStats.total)}</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Đơn hoàn thành</span>
          <span className="text-2xl font-black font-heading text-on-surface">{revenueStats.count}</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">TB / Đơn</span>
          <span className="text-2xl font-black font-heading text-secondary">{fmtVND(revenueStats.avgPerOrder)}</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Tổng đơn kỳ này</span>
          <span className="text-2xl font-black font-heading text-tertiary">{filteredOrders.length}</span>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "revenue" ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-bold text-on-surface flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Doanh Thu Theo Ngày</h3>
            <span className="text-xs text-on-surface-variant">{revenueStats.dailyRevenue.length} ngày</span>
          </div>
          {revenueStats.dailyRevenue.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">Chưa có doanh thu trong kỳ này.</div>
          ) : (
            <div className="divide-y divide-outline-variant/5">
              {revenueStats.dailyRevenue.map((d, i) => {
                const prev = i > 0 ? revenueStats.dailyRevenue[i - 1].revenue : d.revenue;
                const change = prev > 0 ? ((d.revenue - prev) / prev) * 100 : 0;
                return (
                  <div key={d.date} className="flex items-center gap-4 px-6 py-4 hover:bg-primary/3 transition-colors">
                    <span className="w-24 text-sm font-medium text-on-surface">{fmtDate(d.date)}</span>
                    <div className="flex-1">
                      <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(d.revenue / revenueStats.maxDaily) * 100}%` }} />
                      </div>
                    </div>
                    <span className="w-32 text-right font-bold text-primary text-sm">{fmtVND(d.revenue)}</span>
                    {i > 0 && change !== 0 && (
                      <span className={`w-16 text-right text-xs font-bold flex items-center justify-end gap-0.5 ${change > 0 ? "text-green-600" : "text-rose-500"}`}>
                        {change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(change).toFixed(0)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-bold text-on-surface flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Sản Phẩm Bán Chạy</h3>
            <span className="text-xs text-on-surface-variant">{topProducts.length} sản phẩm</span>
          </div>
          {topProducts.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">Chưa có sản phẩm bán ra trong kỳ này.</div>
          ) : (
            <div className="divide-y divide-outline-variant/5">
              {topProducts.map((p, i) => {
                const pct = totalProductRevenue > 0 ? (p.revenue / totalProductRevenue) * 100 : 0;
                return (
                  <div key={`${p.name}-${p.variant}`} className="flex items-center gap-4 px-6 py-4 hover:bg-primary/3 transition-colors">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-outline-variant/5 text-on-surface-variant"}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-on-surface text-sm block truncate">{p.name}</span>
                      <span className="text-xs text-on-surface-variant">{p.variant}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-primary text-sm block">{p.qty} đã bán</span>
                      <span className="text-xs text-on-surface-variant">{fmtVND(p.revenue)} ({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
