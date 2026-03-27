"use client";

import { useState } from "react";
import { Save, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { TelegramSettings } from "@/services/telegramService";
import { updateTelegramAction, testTelegramAction } from "@/app/actions/adminActions";

interface Props {
  telegram: TelegramSettings;
}

export default function TelegramEditor({ telegram }: Props) {
  const [active, setActive] = useState(telegram.is_active);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    setIsTesting(true);
    const form = document.getElementById("telegram-form") as HTMLFormElement;
    const formData = new FormData(form);
    
    // Always use the latest token/chat ID from form if user hasn't saved yet
    const token = formData.get("bot_token") as string;
    const chatId = formData.get("chat_id") as string;
    
    if (!token || !chatId) {
      toast.error("Vui lòng điền đủ Bot Token và Chat ID trước khi test");
      setIsTesting(false);
      return;
    }

    try {
      const res = await testTelegramAction(formData);
      if (res?.error) {
        toast.error(`Test thất bại: ${res.error}`);
      } else {
        toast.success("Test thành công! Kiểm tra Telegram của bạn.");
      }
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form
      id="telegram-form"
      action={async (formData) => {
        setIsSaving(true);
        formData.append("is_active", active.toString());
        const res = await updateTelegramAction(formData);
        if (res?.error) toast.error(res.error);
        else toast.success("Đã lưu cài đặt Telegram.");
        setIsSaving(false);
      }}
      className="space-y-6 max-w-2xl"
    >
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-5 h-5 text-primary rounded border-outline"
          />
          <span className="font-semibold text-on-surface">Kích hoạt Gửi Tin Nhắn Telegram</span>
        </label>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-1">
            Bot Token <span className="text-error">*</span>
          </label>
          <input
            name="bot_token"
            defaultValue={telegram.bot_token}
            placeholder="123456789:ABCdefGHIjkl..."
            className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <p className="text-xs text-on-surface-variant/70 mt-1">Lấy token từ @BotFather trên Telegram.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-1">
            Chat ID <span className="text-error">*</span>
          </label>
          <input
            name="chat_id"
            defaultValue={telegram.chat_id}
            placeholder="123456789"
            className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <p className="text-xs text-on-surface-variant/70 mt-1">Lấy Chat ID từ @userinfobot hoặc @getmyid_bot.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/15">
        <button
          type="button"
          disabled={isTesting}
          onClick={testConnection}
          className="flex items-center gap-2 px-6 py-3 bg-secondary !text-on-secondary font-bold rounded-xl hover:bg-secondary/90 transition-all disabled:opacity-50"
        >
          {isTesting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          Test Tin Nhắn
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Lưu Cài Đặt
        </button>
      </div>
    </form>
  );
}
