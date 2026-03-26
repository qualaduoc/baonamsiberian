"use client";

import Link from "next/link";
import { useHydratedCart } from "@/features/cart/useHydratedCart";
import { Search, ShoppingCart, UserCircle2, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { isHydrated, getTotalItems } = useHydratedCart();
  const totalItems = isHydrated ? getTotalItems() : 0;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/shop", label: "Cửa Hàng" },
    { href: "#", label: "Liên Hệ" },
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
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors font-heading font-bold text-base"
              >
                {link.label}
              </Link>
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
          <Link href="/login" className="p-2 hover:bg-primary/5 rounded-full transition-all active:scale-90 duration-200">
            <UserCircle2 className="w-5 h-5 text-on-surface-variant" />
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
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-outline/10 p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-on-surface font-heading font-bold text-lg py-2 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
