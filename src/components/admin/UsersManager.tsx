"use client";

import { useState, useEffect } from "react";
import { listUsersAction, createUserAction, changePasswordAction, updateUserAction, deleteUserAction } from "@/app/actions/userActions";
import { Plus, Trash2, Loader2, Key, Shield, ShieldCheck, UserCog, Mail, Pencil, X, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const ROLE_MAP: Record<string, { label: string; color: string; icon: any }> = {
  admin:   { label: "Admin",    color: "bg-primary/10 text-primary border-primary/20", icon: ShieldCheck },
  manager: { label: "Quản lý",  color: "bg-amber-50 text-amber-700 border-amber-200", icon: UserCog },
};

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [changePwId, setChangePwId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const res = await listUsersAction();
    if (res.error) toast.error(res.error);
    else setUsers(res.users || []);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Chưa đăng nhập";

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await createUserAction(new FormData(e.currentTarget));
    setActionLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success("Tạo user thành công!"); setShowNew(false); loadUsers(); }
  };

  const handleChangePw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await changePasswordAction(new FormData(e.currentTarget));
    setActionLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success("Đổi mật khẩu thành công!"); setChangePwId(null); }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await updateUserAction(new FormData(e.currentTarget));
    setActionLoading(false);
    if (res?.error) toast.error(res.error);
    else { toast.success("Cập nhật thành công!"); setEditId(null); loadUsers(); }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Chắc chắn xoá user "${user.email}"?\n\nHành động này KHÔNG THỂ hoàn tác!`)) return;
    const res = await deleteUserAction(user.id);
    if (res?.error) toast.error(res.error);
    else { toast.success("Đã xoá user."); loadUsers(); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-on-surface">Quản Lý Tài Khoản</h1>
        <button onClick={() => setShowNew(!showNew)} className="btn-primary flex items-center gap-2 !py-3 !px-5 !rounded-xl cursor-pointer">
          <Plus className="w-4 h-4" /> Tạo User Mới
        </button>
      </div>

      {/* Form tạo mới */}
      {showNew && (
        <form onSubmit={handleCreate} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Tạo Tài Khoản Mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" required placeholder="Họ tên *" className="input" />
            <input name="email" type="email" required placeholder="Email đăng nhập *" className="input" />
            <div className="relative">
              <input name="password" type={showPw ? "text" : "password"} required minLength={6} placeholder="Mật khẩu (≥ 6 ký tự) *" className="input pr-12" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <select name="role" className="input">
              <option value="admin">👑 Admin (toàn quyền)</option>
              <option value="manager">📋 Quản lý (xem đơn, SP)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={actionLoading} className="btn-primary !py-2 !px-6 !rounded-lg cursor-pointer">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo User"}
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="btn-secondary !py-2 !px-6 !rounded-lg cursor-pointer">Huỷ</button>
          </div>
        </form>
      )}

      {/* Danh sách users */}
      <div className="flex flex-col gap-4">
        {users.map((user) => {
          const roleInfo = ROLE_MAP[user.role] || ROLE_MAP.admin;
          const RoleIcon = roleInfo.icon;

          return (
            <div key={user.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-6 group transition-all hover:shadow-md">
              {editId === user.id ? (
                /* Form sửa */
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input type="hidden" name="userId" value={user.id} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input name="name" defaultValue={user.name} placeholder="Họ tên" className="input" />
                    <div className="input bg-surface-container cursor-not-allowed text-on-surface-variant flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {user.email}
                    </div>
                    <select name="role" defaultValue={user.role} className="input">
                      <option value="admin">👑 Admin</option>
                      <option value="manager">📋 Quản lý</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={actionLoading} className="btn-primary !py-2 !px-5 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
                      <Save className="w-3 h-3" /> Lưu
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="btn-secondary !py-2 !px-5 !rounded-lg text-sm cursor-pointer flex items-center gap-1">
                      <X className="w-3 h-3" /> Huỷ
                    </button>
                  </div>
                </form>
              ) : changePwId === user.id ? (
                /* Form đổi mật khẩu */
                <form onSubmit={handleChangePw} className="space-y-4">
                  <input type="hidden" name="userId" value={user.id} />
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-5 h-5 text-primary" />
                    <span className="font-bold text-on-surface">Đổi mật khẩu cho: <span className="text-primary">{user.email}</span></span>
                  </div>
                  <div className="flex gap-3 max-w-md">
                    <div className="relative flex-1">
                      <input name="newPassword" type={showPw ? "text" : "password"} required minLength={6} placeholder="Mật khẩu mới (≥ 6 ký tự)" className="input pr-12 w-full" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button type="submit" disabled={actionLoading} className="btn-primary !py-2 !px-5 !rounded-lg text-sm cursor-pointer">
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đổi"}
                    </button>
                    <button type="button" onClick={() => setChangePwId(null)} className="btn-secondary !py-2 !px-5 !rounded-lg text-sm cursor-pointer">Huỷ</button>
                  </div>
                </form>
              ) : (
                /* Hiển thị user */
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <RoleIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-on-surface">{user.name || user.email}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-on-surface-variant">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-outline">
                        <span>Tạo: {fmtDate(user.created_at)}</span>
                        <span>Đăng nhập cuối: {fmtDate(user.last_sign_in_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setChangePwId(user.id)} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Key className="w-3.5 h-3.5" /> Đổi Pass
                    </button>
                    <button onClick={() => setEditId(user.id)} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm cursor-pointer flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button onClick={() => handleDelete(user)} className="p-2 text-error hover:bg-error/5 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
          <Shield className="w-12 h-12 mx-auto text-outline-variant/30 mb-4" />
          <h3 className="text-xl font-semibold text-on-surface">Chưa có user nào!</h3>
        </div>
      )}
    </div>
  );
}
