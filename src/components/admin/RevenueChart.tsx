"use client";

interface Props {
  weeklyData: { label: string; revenue: number }[];
}

export default function RevenueChart({ weeklyData }: Props) {
  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue), 1);
  const fmtVND = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
    return String(n);
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
      <h3 className="font-heading font-bold text-lg text-on-surface mb-6">Doanh Thu 7 Ngày Gần Nhất</h3>
      <div className="flex items-end gap-3 h-48">
        {weeklyData.map((d, i) => {
          const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-primary">{d.revenue > 0 ? fmtVND(d.revenue) : ""}</span>
              <div className="w-full relative rounded-t-lg overflow-hidden bg-surface-container" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full rounded-t-lg glossy-gradient transition-all duration-700 ease-out"
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-outline">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
