"use client";

import { useState } from "react";
import { Image, Search } from "lucide-react";

interface Props {
  heroContent: React.ReactNode;
  seoContent: React.ReactNode;
}

const TABS = [
  { key: "hero", label: "Hero Banner", icon: Image },
  { key: "seo", label: "SEO", icon: Search },
] as const;

type Tab = typeof TABS[number]["key"];

export default function SettingsTabs({ heroContent, seoContent }: Props) {
  const [active, setActive] = useState<Tab>("hero");

  return (
    <div>
      {/* Navbar Tabs */}
      <div className="flex border-b border-outline-variant/15 mb-8">
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
        {active === "hero" ? heroContent : seoContent}
      </div>
    </div>
  );
}
