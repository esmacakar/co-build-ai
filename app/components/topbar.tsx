"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "./notification-bell";
import Avatar from "./avatar";

const PAGE_TITLES: Record<string, string> = {
  "/panel": "Keşfet",
  "/profil": "Profilim",
  "/ayarlar/hesap": "Ayarlar — Hesap",
  "/ayarlar/guvenlik": "Ayarlar — Güvenlik",
  "/ayarlar/bildirimler": "Ayarlar — Bildirimler",
  "/ayarlar/tercihler": "Ayarlar — Tercihler",
  "/ayarlar/tehlikeli-bolge": "Ayarlar — Tehlikeli Bölge",
};

export default function Topbar({
  userId,
  userName,
  userType,
  notificationsEnabled,
}: {
  userId: string;
  userName: string | null;
  userType: "founder" | "developer" | null;
  notificationsEnabled: boolean;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Co-Build AI";

  return (
    <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4 sm:px-10">
      <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>

      <div className="flex items-center gap-4">
        <NotificationBell userId={userId} enabled={notificationsEnabled} />
        <Link href="/ayarlar" className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80">
          <Avatar name={userName} role={userType === "founder" ? "founder" : "developer"} size="sm" />
          <span className="hidden text-sm font-medium text-ink sm:inline">
            {userName ?? "Profilim"}
          </span>
        </Link>
      </div>
    </header>
  );
}
