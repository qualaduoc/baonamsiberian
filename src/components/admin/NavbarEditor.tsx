"use client";

import { useState } from "react";
import { updateNavbarAction } from "@/app/actions/adminActions";
import { NavItem } from "@/services/navbarService";
import { Category } from "@/services/categoryService";
import { Save, Plus, Trash2, Loader2, GripVertical, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initialNav: NavItem[];
  categories: Category[];
}

export default function NavbarEditor({ initialNav, categories = [] }: Props) {
  const [navItems, setNavItems] = useState<NavItem[]>(initialNav);
  const [loading, setLoading] = useState(false);

  const addMenuItem = () => {
    setNavItems([...navItems, { id: Date.now().toString(), label: "", href: "/" }]);
  };

  const addSubItem = (parentId: string) => {
    setNavItems(navItems.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [...(item.children || []), { id: Date.now().toString(), label: "", href: "/" }]
        };
      }
      return item;
    }));
  };

  const removeMenuItem = (id: string) => {
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const removeSubItem = (parentId: string, childId: string) => {
    setNavItems(navItems.map(item => {
      if (item.id === parentId) {
        return { ...item, children: (item.children || []).filter(c => c.id !== childId) };
      }
      return item;
    }));
  };

  const updateItem = (id: string, field: "label" | "href", value: string) => {
    setNavItems(navItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateSubItem = (parentId: string, childId: string, field: "label" | "href", value: string) => {
    setNavItems(navItems.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          children: (item.children || []).map(child => child.id === childId ? { ...child, [field]: value } : child)
        };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateNavbarAction(JSON.stringify(navItems));
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else toast.success("Đã lưu Menu Navbar!");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-on-surface">Cài Đặt Navbar</h3>
          <p className="text-sm text-on-surface-variant">Tùy biến thanh điều hướng (Menu chính) của Website.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addMenuItem} className="btn-secondary !py-2 !px-4 !rounded-lg text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Thêm Menu Chính
          </button>
          <button onClick={handleSave} disabled={loading} className="btn-primary !py-2 !px-5 !rounded-lg text-sm flex items-center gap-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {navItems.map((item, index) => (
          <div key={item.id} className="bg-surface p-4 rounded-xl border border-outline-variant/10">
            {/* Menu Chính */}
            <div className="flex items-start gap-3 relative group">
              <div className="pt-2 text-outline-variant/30"><GripVertical className="w-5 h-5" /></div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={item.label}
                    onChange={(e) => updateItem(item.id, "label", e.target.value)}
                    placeholder="Tên hiển thị (VD: Cửa Hàng)"
                    className="input !py-2 font-bold"
                  />
                  <div className="relative w-full">
                    <input
                      value={item.href}
                      onChange={(e) => updateItem(item.id, "href", e.target.value)}
                      placeholder="Link đích (VD: /shop)"
                      className="input !py-2 !w-full"
                      list={`links-${item.id}`}
                    />
                    <datalist id={`links-${item.id}`}>
                      <option key="/" value="/">Trang Chủ</option>
                      <option key="/shop" value="/shop">Tất cả sản phẩm</option>
                      <option key="/about" value="/about">Về Chúng Tôi</option>
                      {(categories || []).map((cat) => (
                        <option key={cat.id} value={`/shop?category=${cat.slug}`}>
                          Danh Mục: {cat.name}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => addSubItem(item.id)} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Thêm Menu Con (Sổ xuống)
                  </button>
                </div>
              </div>
              <button onClick={() => removeMenuItem(item.id)} className="p-2 text-error hover:bg-error/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Con */}
            {item.children && item.children.length > 0 && (
              <div className="ml-8 mt-4 pl-4 border-l-2 border-outline-variant/20 space-y-3">
                {item.children.map(child => (
                  <div key={child.id} className="flex items-start gap-3 group/sub">
                    <ChevronDown className="w-4 h-4 mt-2.5 text-outline-variant/50 -rotate-90" />
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        value={child.label}
                        onChange={(e) => updateSubItem(item.id, child.id, "label", e.target.value)}
                        placeholder="Tên danh mục con"
                        className="input !py-1.5 text-sm"
                      />
                      <div className="relative w-full">
                        <input
                          value={child.href}
                          onChange={(e) => updateSubItem(item.id, child.id, "href", e.target.value)}
                          placeholder="Link (VD: /shop?category=than-kinh)"
                          className="input !py-1.5 text-sm !w-full"
                          list={`sub-links-${child.id}`}
                        />
                        <datalist id={`sub-links-${child.id}`}>
                          <option key="/" value="/">Trang Chủ</option>
                          <option key="/shop" value="/shop">Tất cả sản phẩm</option>
                          <option key="/about" value="/about">Về Chúng Tôi</option>
                          {(categories || []).map((cat) => (
                            <option key={cat.id} value={`/shop?category=${cat.slug}`}>
                              Danh Mục: {cat.name}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>
                    <button onClick={() => removeSubItem(item.id, child.id)} className="p-1.5 text-error hover:bg-error/5 rounded-lg opacity-0 group-hover/sub:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {navItems.length === 0 && (
        <div className="text-center p-8 text-outline-variant">
          Chưa có Menu nào. Hãy bấm Thêm để bắt đầu.
        </div>
      )}
    </div>
  );
}
