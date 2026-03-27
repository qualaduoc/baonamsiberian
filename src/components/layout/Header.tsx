"use client";

import Link from "next/link";
import { useHydratedCart } from "@/features/cart/useHydratedCart";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { NavItem } from "@/services/navbarService";

interface Props {
  initialNav?: NavItem[];
}

export default function Header({ initialNav }: Props) {
  const { isHydrated, getTotalItems } = useHydratedCart();
  const totalItems = isHydrated ? getTotalItems() : 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const navLinks = initialNav || [
    { id: "1", href: "/", label: "Trang Chủ" },
    { id: "2", href: "/shop", label: "Cửa Hàng" },
    { id: "3", href: "#", label: "Liên Hệ" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-primary font-heading" title="Bảo Nam - Thực phẩm chức năng">
            Bảo Nam
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.id} className="relative group">
                {link.children && link.children.length > 0 ? (
                  <>
                    <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-heading font-bold text-base py-2">
                      {link.label} <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-outline/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 p-2 z-50 flex flex-col gap-1">
                      {link.children.map(child => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className="px-4 py-2.5 hover:bg-surface-container rounded-lg font-bold text-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-primary transition-colors font-heading font-bold text-base py-2 block"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href="/shop" className="p-2 hover:bg-primary/5 rounded-full transition-all active:scale-90 duration-200">
            <Search className="w-5 h-5 text-on-surface-variant" />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-primary/5 rounded-full transition-all active:scale-90 duration-200 relative">
            <ShoppingCart className="w-5 h-5 text-on-surface-variant" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-container text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-primary/5 rounded-full transition-all cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-outline/10 h-[1px]"></div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-outline/10 p-6 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.id} className="flex flex-col border-b border-outline/5 last:border-0 pb-2">
              {link.children && link.children.length > 0 ? (
                <>
                  <button
                    onClick={() => setOpenSubmenu(openSubmenu === link.id ? null : link.id)}
                    className="flex items-center justify-between text-on-surface font-heading font-bold text-lg py-2"
                  >
                    {link.label}
                    <ChevronDown className={`w-5 h-5 transition-transform ${openSubmenu === link.id ? "rotate-180" : ""}`} />
                  </button>
                  {openSubmenu === link.id && (
                    <div className="flex flex-col gap-1 pl-4 mt-1 border-l-2 border-primary/20">
                      {link.children.map(child => (
                         <Link
                          key={child.id}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="py-2.5 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors"
                         >
                           {child.label}
                         </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-on-surface font-heading font-bold text-lg py-2 hover:text-primary transition-colors block"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
