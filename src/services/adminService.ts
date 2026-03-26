import { getServiceSupabase } from "@/services/supabase";

export interface OrderWithItems {
  id: string;
  customer_name: string;
  customer_phone1: string;
  customer_phone2: string | null;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    variant: { id: string; name: string; product: { name: string } | null } | null;
  }[];
}

export interface DashboardStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  pendingOrders: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  dailyRevenue: { label: string; revenue: number }[];
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(id, quantity, price, variant:product_variants(id, name, product:products(name)))`)
    .order("created_at", { ascending: false });

  if (error) { console.error("Fetch orders:", error); return []; }
  return (data || []).map((o: any) => ({
    ...o,
    order_items: (o.order_items || []).map((oi: any) => ({
      ...oi,
      variant: Array.isArray(oi.variant) ? oi.variant[0] : oi.variant,
    })),
  }));
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getServiceSupabase();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: allOrders, error } = await supabase.from("orders").select("total_amount, status, created_at");

  if (error || !allOrders) {
    return { todayRevenue: 0, weekRevenue: 0, monthRevenue: 0, pendingOrders: 0, totalOrders: 0, completedOrders: 0, cancelledOrders: 0, dailyRevenue: [] };
  }

  let todayRevenue = 0, weekRevenue = 0, monthRevenue = 0;
  let pendingOrders = 0, completedOrders = 0, cancelledOrders = 0;

  // Tạo mảng 7 ngày
  const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dailyMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }

  for (const order of allOrders) {
    if (order.status === "new" || order.status === "processing") pendingOrders++;
    if (order.status === "completed") completedOrders++;
    if (order.status === "cancelled") cancelledOrders++;

    if (order.status === "completed") {
      const ca = order.created_at;
      if (ca >= todayStart) todayRevenue += Number(order.total_amount);
      if (ca >= weekStart) weekRevenue += Number(order.total_amount);
      if (ca >= monthStart) monthRevenue += Number(order.total_amount);

      const dayKey = ca.slice(0, 10);
      if (dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + Number(order.total_amount));
      }
    }
  }

  const dailyRevenue = Array.from(dailyMap.entries()).map(([dateStr, rev]) => {
    const d = new Date(dateStr);
    return { label: dayLabels[d.getDay()], revenue: rev };
  });

  return { todayRevenue, weekRevenue, monthRevenue, pendingOrders, totalOrders: allOrders.length, completedOrders, cancelledOrders, dailyRevenue };
}
