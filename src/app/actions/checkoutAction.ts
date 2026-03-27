"use server";

import { getServiceSupabase } from "@/services/supabase";
import { getTelegramSettings } from "@/services/telegramService";

// Bắn tin nhắn chốt đơn vào BOT Telegram của Khầy (Chạy ngầm không ảnh hưởng tốc độ Web)
async function sendTelegramNotification(orderId: string, name: string, phone: string, address: string, totalAmount: number, telegramItems: any[]) {
    const settings = await getTelegramSettings();
    if (!settings.is_active || !settings.bot_token || !settings.chat_id) {
        console.warn("Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc bị tắt. Tạm bỏ qua thông báo.");
        return;
    }

    const token = settings.bot_token;
    const chatId = settings.chat_id;

    // Định dạng danh sách món ăn/thuốc cho đẹp mắt
    const itemsListRegex = telegramItems.map(i => `▪️ ${i.name} x ${i.quantity} (Giá: ${new Intl.NumberFormat('vi-VN').format(i.price)}đ)`).join("\n");

    const message = `
🔥 *DING DONG! CÓ ĐƠN HÀNG MỚI* 🔥
📦 *Mã Chốt Đơn:* \`${orderId}\`

👤 *Khách hàng:* ${name}
📞 *SĐT Check:* \`${phone}\`
📍 *Giao Tới:* ${address}

🛒 *Đã Quất:*
${itemsListRegex}

💰 *Khách Phải Trả:* *${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}*
🚀 *Hành động:* Vui lòng gọi xác nhận ngay lập tức!
`;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (err) {
        console.error("Lỗi bắn Telegram API:", err);
    }
}

export async function processCheckout(formData: FormData, itemsText: string) {
    try {
        const supabase = getServiceSupabase();
        
        // 1. Phân tích dữ liệu từ Client
        const name = formData.get("fullName") as string;
        const phone1 = formData.get("phone1") as string;
        const phone2 = formData.get("phone2") as string | null;
        const address = formData.get("address") as string;
        const items = JSON.parse(itemsText) as { variantId: string; quantity: number }[];

        if (!items || items.length === 0) {
            return { error: "Giỏ hàng của bạn đang trống." };
        }
        if (!name || !phone1 || !address) {
            return { error: "Thiếu thông tin bắt buộc (Tên, SĐT, Địa chỉ)." };
        }

        // 2. Fetch Giá Trị Thật từ Database (Không tin tưởng Frontend)
        const variantIds = items.map(i => i.variantId);
        const { data: variants, error: variantErr } = await supabase
          .from("product_variants")
          .select("id, price, stock, name")
          .in("id", variantIds);

        if (variantErr || !variants) {
            return { error: "Lỗi kết nối CSDL, không thể kiểm tra giá." };
        }

        let totalAmount = 0;
        const orderItemsRecord: any[] = [];
        const stockUpdates: { id: string, stock: number }[] = [];

        const telegramItems: any[] = [];

        // Kiểm tra tồn kho và tính tổng tiền
        for (const item of items) {
          const dbVariant = variants.find(v => v.id === item.variantId);
          if (!dbVariant) return { error: `Sản phẩm bị lỗi hoặc đã xoá.` };
          
          if (item.quantity > dbVariant.stock) {
            return { error: `Sản phẩm ${dbVariant.name} chỉ còn ${dbVariant.stock} hộp trong kho.` };
          }

          totalAmount += dbVariant.price * item.quantity;

          orderItemsRecord.push({
             variant_id: item.variantId,
             quantity: item.quantity,
             price: dbVariant.price // Lấy giá THẬT của Database
          });

          telegramItems.push({
             name: dbVariant.name,
             quantity: item.quantity,
             price: dbVariant.price
          });

          stockUpdates.push({
             id: item.variantId,
             stock: dbVariant.stock - item.quantity // Trừ tồn kho
          });
        }

        // 3. Insert dữ liệu vào bảng Orders
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert({
             customer_name: name,
             customer_phone1: phone1,
             customer_phone2: phone2 || null,
             customer_address: address,
             total_amount: totalAmount,
             status: "new"
          })
          .select("id")
          .single();

        if (orderErr) {
            console.error("Order Insert Error:", orderErr);
            return { error: "Lỗi khi tạo đơn hàng." };
        }

        // 4. Insert chi tiết Đơn hàng vào order_items
        const itemsToInsert = orderItemsRecord.map(oi => ({ ...oi, order_id: order.id }));
        const { error: itemsErr } = await supabase.from("order_items").insert(itemsToInsert);
        
        if (itemsErr) {
            console.error("Order Items Insert Error:", itemsErr);
            return { error: "Lỗi lưu chi tiết đơn hàng." };
        }

        // 5. Cập nhật trừ Tồn kho vào product_variants
        for (const update of stockUpdates) {
           await supabase
             .from("product_variants")
             .update({ stock: update.stock })
             .eq("id", update.id);
        }

        // 6. Kích hoạt Webhook bắn thẳng Data Order về Smartphone của Khầy (Chạy không chờ await để Web load cực nhanh)
        sendTelegramNotification(order.id, name, phone1, address, totalAmount, telegramItems);

        // Thành công!
        return { success: true, orderId: order.id };
        
    } catch (err) {
        console.error("Checkout Exception:", err);
        return { error: "Lỗi bất thường từ Server xử lý thanh toán." };
    }
}
