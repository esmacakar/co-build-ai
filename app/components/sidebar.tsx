"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  User,
  Lightbulb,
  Settings,
  Rocket,
  Inbox,
  Send,
  CheckCircle,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import LogoutButton from "./logout-button";
import Avatar from "./avatar";
import RatingStars from "./rating-stars";
import AvailabilityBadge from "./availability-badge";

const NAV_ITEMS = [
  { href: "/panel", label: "Keşfet", icon: Compass },
  { href: "/profil", label: "Profilim", icon: User },
  { href: "/ayarlar", label: "Ayarlar", icon: Settings },
];

const BADGE_ICONS = {
  Lightbulb,
  Rocket,
  Inbox,
  Send,
  CheckCircle,
  Briefcase,
};

export type Badge = {
  id: string;
  label: string;
  icon: keyof typeof BADGE_ICONS;
  earned: boolean;
};

export default function Sidebar({
  userType,
  userName,
  badges,
  miniStats,
  ratingAvg,
  ratingCount,
  availability,
}: {
  userType: "founder" | "developer" | null;
  userName: string | null;
  badges: Badge[];
  miniStats: { label: string; value: string | number }[];
  ratingAvg: number | null;
  ratingCount: number;
  availability: string | null;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
    } catch {
      // localStorage erişilemezse varsayılan (açık) kalır
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar-collapsed", String(next));
      } catch {
        // sessizce yoksay
      }
      return next;
    });
  }

  const labelClass = collapsed ? "hidden" : "hidden md:inline";
  const blockClass = collapsed ? "hidden" : "hidden md:block";

  return (
    <aside className={`flex shrink-0 flex-col bg-sidebar py-6 ${collapsed ? "w-16" : "w-16 md:w-60"}`}>
      <div className="mb-6 flex items-center justify-between px-3 md:px-5">
        <Link href="/panel" className={blockClass}>
          <span className="font-display text-lg font-semibold text-ink">Co-Build AI</span>
        </Link>
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
          className="hidden rounded-lg p-1.5 text-ink-soft hover:bg-white/60 hover:text-ink md:block"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2 md:px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center justify-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-colors md:justify-start ${
                active
                  ? "border-coral bg-white text-coral-dark shadow-sm"
                  : "border-transparent text-ink-soft hover:bg-white/60 hover:text-ink"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className={labelClass}>{item.label}</span>
            </Link>
          );
        })}

        {userType === "founder" && (
          <>
            <div className="my-2 border-t border-ink/10" />
            <Link
              href="/fikir-ekle"
              title="Fikir Ekle"
              className="flex items-center justify-center gap-3 rounded-lg border-l-4 border-transparent px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-ink md:justify-start"
            >
              <Lightbulb size={20} className="shrink-0" />
              <span className={labelClass}>Fikir Ekle</span>
            </Link>
          </>
        )}
      </nav>

      {/* Rozetler, mini istatistikler — sadece genişletilmiş sidebar'da */}
      <div className={`mt-6 flex-1 flex-col gap-5 overflow-y-auto border-t border-ink/10 px-4 pt-5 ${collapsed ? "hidden" : "hidden md:flex"}`}>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            Rozetler
          </p>
          <div className="mt-2 flex gap-2">
            {badges.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon];
              return (
                <div key={badge.id} title={badge.label} className="group relative">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      badge.earned ? "bg-petal text-coral-dark" : "bg-ink/5 text-ink-soft/40"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {miniStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2"
            >
              <span className="text-xs text-ink-soft">{stat.label}</span>
              <span className="font-display text-sm font-bold text-ink">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/10 px-2 pt-3 md:px-3">
        <Link
          href="/ayarlar"
          className="flex items-center justify-center gap-2.5 rounded-lg px-1 py-2 transition-colors hover:bg-white/60 md:justify-start"
        >
          <Avatar name={userName} role={userType === "founder" ? "founder" : "developer"} size="sm" />
          <div className={`min-w-0 ${blockClass}`}>
            <p className="truncate text-sm font-semibold text-ink">{userName ?? "Kullanıcı"}</p>
            <p className="text-xs text-ink-soft">
              {userType === "founder" ? "Fikir Sahibi" : "Yazılımcı"}
            </p>
            {userType === "developer" && (
              <div className="mt-1">
                <AvailabilityBadge availability={availability} />
              </div>
            )}
            <RatingStars average={ratingAvg} count={ratingCount} />
          </div>
        </Link>
        <LogoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
