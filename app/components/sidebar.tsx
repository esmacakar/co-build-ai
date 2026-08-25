"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, Lightbulb, Settings } from "lucide-react";
import LogoutButton from "./logout-button";
import Avatar from "./avatar";

const NAV_ITEMS = [
  { href: "/panel", label: "Keşfet", icon: Compass },
  { href: "/profil", label: "Profilim", icon: User },
  { href: "/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function Sidebar({
  userType,
  userName,
}: {
  userType: "founder" | "developer" | null;
  userName: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-ink/10 bg-white py-6 md:w-60">
      <Link href="/panel" className="mb-6 hidden px-5 md:block">
        <span className="font-display text-lg font-semibold text-ink">Co-Build AI</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-2 md:px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center justify-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-colors md:justify-start ${
                active
                  ? "border-coral bg-coral/10 text-coral-dark"
                  : "border-transparent text-ink-soft hover:bg-background hover:text-ink"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}

        {userType === "founder" && (
          <>
            <div className="my-2 border-t border-ink/10" />
            <Link
              href="/fikir-ekle"
              title="Fikir Ekle"
              className="flex items-center justify-center gap-3 rounded-lg border-l-4 border-transparent px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-background hover:text-ink md:justify-start"
            >
              <Lightbulb size={20} className="shrink-0" />
              <span className="hidden md:inline">Fikir Ekle</span>
            </Link>
          </>
        )}
      </nav>

      <div className="border-t border-ink/10 px-2 pt-3 md:px-3">
        <div className="flex items-center justify-center gap-2.5 px-1 pb-2 md:justify-start">
          <Avatar name={userName} role={userType === "founder" ? "founder" : "developer"} size="sm" />
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm font-semibold text-ink">{userName ?? "Kullanıcı"}</p>
            <p className="text-xs text-ink-soft">
              {userType === "founder" ? "Fikir Sahibi" : "Yazılımcı"}
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
