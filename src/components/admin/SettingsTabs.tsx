"use client";

import { useState } from "react";
import { Image, Search, Send, Grid, MessageCircle, Menu, Box } from "lucide-react";

interface Props {
  heroContent: React.ReactNode;
  seoContent: React.ReactNode;
  telegramContent: React.ReactNode;
  categoriesContent: React.ReactNode;
  zaloContent?: React.ReactNode;
  navbarContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  pagesContent?: React.ReactNode;
  productToolsContent?: React.ReactNode;
}

const TABS = [
  { key: "hero", label: "Hero Banner", icon: Image },
  { key: "navbar", label: "Menu Navbar", icon: Menu },
  { key: "categories", label: "Danh Mục Nổi Bật", icon: Grid },
  { key: "footer", label: "Chân Trang (Footer)", icon: Menu },
  { key: "pages", label: "Trang Phụ (Pages)", icon: Grid },
  { key: "seo", label: "SEO", icon: Search },
  { key: "telegram", label: "Telegram", icon: Send },
  { key: "zalo", label: "Zalo Bot", icon: MessageCircle },
  { key: "tools", label: "Công Cụ Hệ Thống", icon: Box },
] as const;

type Tab = typeof TABS[number]["key"];

export default function SettingsTabs({ heroContent, seoContent, telegramContent, zaloContent, categoriesContent, navbarContent, footerContent, pagesContent, productToolsContent }: Props) {
  const [active, setActive] = useState<Tab>("pages");

  return (
    <div>
      {/* Navbar Tabs */}
      <div className="flex border-b border-outline-variant/15 mb-8 flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all cursor-pointer relative ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-primary/3"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
        {active === "hero" && heroContent}
        {active === "seo" && seoContent}
        {active === "navbar" && navbarContent}
        {active === "footer" && footerContent}
        {active === "pages" && pagesContent}
        {active === "telegram" && telegramContent}
        {active === "zalo" && zaloContent}
        {active === "categories" && categoriesContent}
        {active === "tools" && productToolsContent}
      </div>
    </div>
  );
}
