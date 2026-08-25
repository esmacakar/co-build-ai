"use client";

import { usePathname } from "next/navigation";
import NotificationBell from "./notification-bell";
import Avatar from "./avatar";

const PAGE_TITLES: Record<string, string> = {
  "/panel": "Keşfet",
  "/profil": "Profilim",
  "/ayarlar": "Ayarlar",
};

export default function Topbar({
  userId,
  userName,
  userType,
}: {
  userId: string;
  userName: string | null;
  userType: "founder" | "developer" | null;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Co-Build AI";

  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4 sm:px-10">
      <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>

      <div className="flex items-center gap-4">
        <NotificationBell userId={userId} />
        <div className="flex items-center gap-2">
          <Avatar name={userName} role={userType === "founder" ? "founder" : "developer"} size="sm" />
          <span className="hidden text-sm font-medium text-ink sm:inline">
            {userName ?? "Profilim"}
          </span>
        </div>
      </div>
    </header>
  );
}
