import { getAllOrders } from "@/services/adminService";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderReportPanel from "@/components/admin/OrderReportPanel";

export const revalidate = 15;

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-on-surface">Quản Lý Đơn Hàng</h1>
        <span className="text-sm text-on-surface-variant bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/10 font-semibold">
          Tổng: {orders.length} đơn
        </span>
      </div>

      {/* Báo cáo doanh thu + sản phẩm bán chạy */}
      <OrderReportPanel orders={orders} />

      {/* Danh sách đơn hàng */}
      <div>
        <h2 className="text-xl font-bold font-heading text-on-surface mb-4">📦 Chi Tiết Đơn Hàng</h2>
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
