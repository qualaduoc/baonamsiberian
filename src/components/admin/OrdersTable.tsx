"use client";

import { changeOrderStatusAction, deleteOrderAction } from "@/app/actions/adminActions";
import { OrderWithItems } from "@/services/adminService";
import { Phone, MapPin, Clock, CheckCircle2, XCircle, Loader2, Package, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  orders: OrderWithItems[];
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  new:        { label: "Mới",        color: "bg-blue-100 text-blue-700 border-blue-200",    icon: Clock },
  processing: { label: "Đang xử lý", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Package },
  completed:  { label: "Thành công",  color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  cancelled:  { label: "Đã huỷ",     color: "bg-rose-100 text-rose-600 border-rose-200",   icon: XCircle },
};

const NEXT_STATUS: Record<string, string[]> = {
  new:        ["processing", "cancelled"],
  processing: ["completed", "cancelled"],
  completed:  [],
  cancelled:  [],
};

export default function OrdersTable({ orders }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    const res = await changeOrderStatusAction(orderId, newStatus);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(`Đã chuyển trạng thái đơn hàng!`);
    }
    setLoadingId(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Hành động này không thể hoàn tác.")) return;
    setLoadingId(orderId);
    const res = await deleteOrderAction(orderId);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Đã xóa đơn hàng thành công!");
    }
    setLoadingId(null);
  };

  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  const formatDate = (d: string) => new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const printShippingLabel = (order: OrderWithItems) => {
    const w = window.open("", "_blank", "width=850,height=600");
    if (!w) return;
    const items = order.order_items.map((oi) => {
      const name = oi.snapshot_product_name || oi.variant?.product?.name || "Sản phẩm";
      const variant = oi.snapshot_variant_name || oi.variant?.name || "";
      const priceFmt = formatVND(oi.price);
      const totalFmt = formatVND(oi.price * oi.quantity);
      return `<tr>
        <td>${name} ${variant ? `<span class="dim">(${variant})</span>` : ""}</td>
        <td class="center">x${oi.quantity}</td>
        <td style="text-align:right; font-size:10px">${priceFmt}</td>
        <td style="text-align:right; font-weight:bold">${totalFmt}</td>
      </tr>`;
    }).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Phiếu Gửi Hàng #${order.id.substring(0,8)}</title>
<style>
  @page{size:A5 landscape;margin:0}
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',-apple-system,sans-serif;width:210mm;height:148mm;padding:14mm 16mm;color:#1a1a1a;position:relative;overflow:hidden}
  .border-frame{position:absolute;inset:6mm;border:2.5px solid #059669;border-radius:12px;pointer-events:none}
  .border-inner{position:absolute;inset:8mm;border:1px dashed #d1fae5;border-radius:8px;pointer-events:none}
  .cut-line{position:absolute;top:-2mm;left:50%;width:0;height:calc(100% + 4mm);border-left:1.5px dashed #ccc}
  .header{display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #059669}
  .logo{font-size:22px;font-weight:900;color:#059669;letter-spacing:-0.5px}
  .logo small{display:block;font-size:10px;color:#666;font-weight:500;letter-spacing:1px}
  .order-id{margin-left:auto;font-size:11px;color:#999;font-family:monospace;background:#f0fdf4;padding:4px 10px;border-radius:6px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:16px}
  .box{background:#f9fafb;border-radius:10px;padding:14px 16px;border:1px solid #e5e7eb}
  .box-label{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#059669;font-weight:800;margin-bottom:8px;display:flex;align-items:center;gap:6px}
  .box-label::before{content:"";width:3px;height:12px;background:#059669;border-radius:2px}
  .name{font-size:16px;font-weight:800;color:#111;margin-bottom:4px}
  .info{font-size:12px;color:#555;line-height:1.6}
  .info strong{color:#111}
  .items-title{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#059669;font-weight:800;margin-bottom:6px}
  table{width:100%;font-size:12px;border-collapse:collapse}
  th{text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#999;padding:4px 0;border-bottom:1px solid #e5e7eb}
  td{padding:5px 0;border-bottom:1px solid #f3f4f6}
  .center{text-align:center;font-weight:700}
  .dim{color:#999;font-size:11px}
  .total-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:2px solid #059669}
  .total-label{font-size:13px;font-weight:700;color:#333}
  .total-value{font-size:20px;font-weight:900;color:#059669}
  .thanks{text-align:center;margin-top:14px;padding-top:12px;border-top:1px dashed #d1fae5}
  .thanks p{font-size:13px;color:#059669;font-weight:700;font-style:italic}
  .thanks small{font-size:10px;color:#999;display:block;margin-top:4px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
  <div class="border-frame"></div>
  <div class="border-inner"></div>
  <div class="header">
    <div class="logo">🌿 Bảo Nam Siberian<small>THỰC PHẨM CHỨC NĂNG CAO CẤP</small></div>
    <div class="order-id">Đơn #${order.id.substring(0,8)}</div>
  </div>
  <div class="grid">
    <div class="box">
      <div class="box-label">Người Gửi</div>
      <div class="name">Bảo Nam Siberian</div>
      <div class="info">
        📞 <strong>0899 686 683</strong><br/>
        📍 Đại lý phân phối chính hãng
      </div>
    </div>
    <div class="box" style="background:#f0fdf4;border-color:#bbf7d0">
      <div class="box-label">Người Nhận</div>
      <div class="name">${order.customer_name}</div>
      <div class="info">
        📞 <strong>${order.customer_phone1}</strong>${order.customer_phone2 ? ` / ${order.customer_phone2}` : ""}<br/>
        📍 ${order.customer_address}
      </div>
    </div>
  </div>
  <div class="items-title">Danh Sách Sản Phẩm</div>
  <table>
    <thead>
      <tr>
        <th>Sản phẩm</th>
        <th class="center" style="width:30px">SL</th>
        <th style="text-align:right; width:70px">Đơn giá</th>
        <th style="text-align:right; width:80px">Thành tiền</th>
      </tr>
    </thead>
    <tbody>${items}</tbody>
  </table>
  <div class="total-row">
    <span class="total-label">💰 Tổng thu COD:</span>
    <span class="total-value">${formatVND(order.total_amount)}</span>
  </div>
  <div class="thanks">
    <p>✨ Cảm ơn Quý Khách đã tin tưởng Bảo Nam Siberian! ✨</p>
    <small>Sức khoẻ của bạn — Sứ mệnh của chúng tôi · Hotline: 0899.686.683</small>
  </div>
</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-gray-300">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-text">Chưa có đơn hàng nào!</h3>
        <p className="text-gray-500 mt-2">Đơn hàng sẽ xuất hiện ở đây khi khách đặt mua sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
        const StatusIcon = statusInfo.icon;
        const nextStatuses = NEXT_STATUS[order.status] || [];
        const isLoading = loadingId === order.id;

        return (
          <div key={order.id} className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400 font-mono block mb-1">#{order.id.substring(0, 8)}</span>
                <h3 className="text-lg font-bold text-text">{order.customer_name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {order.customer_phone1}</span>
                  {order.customer_phone2 && <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-gray-300" /> {order.customer_phone2}</span>}
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {order.customer_address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" /> {statusInfo.label}
                </span>
                <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3 mb-4 mt-2">
              {order.order_items.map((oi) => {
                const imgUrl = oi.snapshot_image_url || oi.variant?.product?.image_url;
                const pName = oi.snapshot_product_name || oi.variant?.product?.name;
                const vName = oi.snapshot_variant_name || oi.variant?.name;
                return (
                  <div key={oi.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm bg-surface-container-lowest border border-outline-variant/10 px-4 py-3 rounded-xl gap-3">
                    <div className="flex items-center gap-4 flex-1">
                      {imgUrl ? (
                        <div 
                          className="relative w-24 h-24 rounded-xl border border-outline-variant/20 overflow-hidden cursor-zoom-in shrink-0 bg-white group/zoom shadow-sm"
                          onClick={() => setZoomImg(imgUrl)}
                          title="Bấm để phóng to"
                        >
                          <img src={imgUrl} alt="Product" className="w-full h-full object-cover group-hover/zoom:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity">
                            <span className="bg-white/90 text-primary text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">🔍 Phóng to</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-error/5 border-2 border-dashed border-error/20 flex flex-col items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-error/40 mb-1" />
                          <span className="text-[9px] text-error/60 font-bold uppercase">Mất Ảnh</span>
                        </div>
                      )}
                      
                      <span className="font-bold text-on-surface text-base leading-tight">
                        {pName || <span className="text-error/80 italic font-medium text-sm">⛔ Sản phẩm cũ đã bị thu hồi/gỡ bỏ</span>} 
                        {vName && (
                          <span className="text-on-surface-variant font-medium block mt-1 text-sm bg-surface-container-high px-2 py-1 rounded-md inline-block">
                             {vName}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="text-on-surface-variant font-medium whitespace-nowrap bg-surface px-3 py-1.5 rounded-lg border border-outline-variant/5">
                      x{oi.quantity} = <strong className="text-primary text-base ml-1">{formatVND(oi.price * oi.quantity)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <span className="text-xl font-bold font-heading text-cta">{formatVND(order.total_amount)}</span>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => printShippingLabel(order)} className="px-4 py-2 rounded-xl text-sm font-bold border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer flex items-center gap-1.5">
                  <Printer className="w-4 h-4" /> In Phiếu Gửi
                </button>
                {nextStatuses.map((ns) => {
                  const nsInfo = STATUS_MAP[ns];
                  return (
                    <button
                      key={ns}
                      disabled={isLoading}
                      onClick={() => handleStatusChange(order.id, ns)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer disabled:opacity-50 ${ns === 'cancelled' ? 'border-rose-200 text-rose-500 hover:bg-rose-50' : 'border-cta/30 text-cta bg-cta/5 hover:bg-cta/10'}`}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : nsInfo.label}
                    </button>
                  );
                })}
                <button
                  disabled={isLoading}
                  onClick={() => handleDeleteOrder(order.id)}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  title="Xóa đơn hàng"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Xóa</>}
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {/* Image Zoom Modal Cao Cấp */}
      {zoomImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-zoom-out animate-in fade-in"
          onClick={() => setZoomImg(null)}
        >
          <div className="relative max-w-5xl w-full h-[85vh] flex items-center justify-center">
            <img 
              src={zoomImg} 
              alt="Zoomed Product" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl bg-white p-4 border-4 border-white/20 animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur font-bold text-white px-6 py-2 rounded-full shadow-lg tracking-wide border border-white/10 pointer-events-none">
               Bấm ra ngoài để Đóng
            </div>
            <button 
              className="absolute top-0 right-0 md:-right-12 md:top-0 p-3 bg-white hover:bg-error hover:text-white text-on-surface rounded-full shadow-2xl transition-all z-[110]"
              onClick={() => setZoomImg(null)}
              title="Đóng (Esc)"
            >
              <XCircle className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
