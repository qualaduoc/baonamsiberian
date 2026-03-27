"use client";

import { useState } from "react";
import { Category } from "@/services/categoryService";
import { adminCreateCategoryAction, adminUpdateCategoryAction, adminDeleteCategoryAction } from "@/app/actions/adminActions";
import { Plus, Edit3, Trash2, X, Copy, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  categories: Category[];
}

export default function CategoryManager({ categories }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", slug: "", image_url: "" });

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setForm({ name: cat.name, slug: cat.slug, image_url: cat.image_url || "" });
    } else {
      setEditingCategory(null);
      setForm({ name: "", slug: "", image_url: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm({ name: "", slug: "", image_url: "" });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm(prev => ({ ...prev, name, slug: generateSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("image_url", form.image_url);

    let res;
    if (editingCategory) {
      res = await adminUpdateCategoryAction(editingCategory.id, formData);
    } else {
      res = await adminCreateCategoryAction(formData);
    }

    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(editingCategory ? "Đã cập nhật danh mục!" : "Đã tạo danh mục!");
      closeModal();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"? Thao tác này có thể ảnh hưởng đến sản phẩm đang liên kết.`)) {
      setLoading(true);
      const res = await adminDeleteCategoryAction(id);
      setLoading(false);
      if (res?.error) toast.error(res.error);
      else toast.success("Đã xóa danh mục!");
    }
  };

  const copySlugLink = (slug: string, id: string) => {
    const link = `/shop?category=${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Đã copy đường dẫn!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-on-surface mb-1">Danh Sách Danh Mục</h2>
          <p className="text-sm text-on-surface-variant flex gap-2">Copy link để dán vào Menu Navbar</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary !px-4 !py-2 text-sm flex gap-2 items-center">
          <Plus className="w-4 h-4" /> Thêm Danh Mục Mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container/30 border-b border-outline-variant/10 text-sm font-bold text-on-surface-variant">
              <th className="p-4 uppercase tracking-wider">Tên Danh Mục</th>
              <th className="p-4 uppercase tracking-wider">Đường Dẫn Đích (Link)</th>
              <th className="p-4 text-right uppercase tracking-wider">Tùy Chọn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-outline-variant">
                  Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container/20 transition-colors">
                  <td className="p-4 font-bold text-on-surface">
                    <div className="flex items-center gap-3">
                      {cat.image_url ? (
                        <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-outline-variant/20">
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded shrink-0 bg-surface-container-highest/20 border border-outline-variant/20 flex items-center justify-center text-outline-variant text-xs">No IMG</div>
                      )}
                      {cat.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <code className="px-2 py-1 bg-surface-container/50 rounded font-bold text-primary border border-outline-variant/10">
                        /shop?category={cat.slug}
                      </code>
                      <button 
                        onClick={() => copySlugLink(cat.slug, cat.id)}
                        className="p-1.5 hover:bg-primary/10 text-primary rounded transition-colors tooltip-wrapper"
                        title="Copy đường dẫn"
                      >
                         {copiedId === cat.id ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(cat)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} disabled={loading} className="p-2 text-error hover:bg-error/10 rounded transition-colors disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/20">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/10 bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-on-surface">{editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Tên Danh Mục *</label>
                <input
                  value={form.name}
                  onChange={handleNameChange} // Auto generates slug
                  required
                  className="input !w-full"
                  placeholder="VD: Xương Khớp"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Link Slug (Viết liền không dấu) *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({...form, slug: e.target.value})}
                  required
                  className="input !w-full text-outline"
                  placeholder="VD: xuong-khop"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">URL Ảnh Minh Họa (Tùy chọn)</label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({...form, image_url: e.target.value})}
                  className="input !w-full"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="btn-secondary !px-5 !py-2.5 text-sm">Hủy</button>
                <button type="submit" disabled={loading} className="btn-primary !px-5 !py-2.5 text-sm">
                  {loading ? "Đang xử lý..." : editingCategory ? "Lưu Thay Đổi" : "Tạo Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
