import { logoutAction } from "@/app/actions/authAction";
import { ShieldAlert, LogOut, LayoutDashboard, Package, ShoppingCart, Settings, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin | Bảo Nam Supplements",
};

async function actionSignOut() {
  "use server";
  await logoutAction();
  redirect("/login");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-gray-100 flex flex-col pt-8 md:h-screen md:sticky md:top-0 shrink-0">
        <div className="px-6 mb-10 flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <div>
            <span className="font-heading font-bold text-xl text-primary block leading-none">Admin Panel</span>
            <span className="text-xs font-semibold text-gray-400">Bảo Nam v1.0</span>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all cursor-pointer">
            <LayoutDashboard className="w-5 h-5" /> Thống Kê
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all cursor-pointer">
            <ShoppingCart className="w-5 h-5" /> Đơn Hàng
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all cursor-pointer">
            <Package className="w-5 h-5" /> Sản Phẩm
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all cursor-pointer">
            <Settings className="w-5 h-5" /> Cài Đặt Trang
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all cursor-pointer">
            <Users className="w-5 h-5" /> Tài Khoản
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100">
          <form action={actionSignOut}>
            <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-colors cursor-pointer">
              <LogOut className="w-5 h-5" /> Thoát Hệ Thống
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">{children}</main>
    </div>
  );
}
