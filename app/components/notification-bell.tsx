"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Notification = {
  id: string;
  project_id: string | null;
  type: string;
  message: string;
  read_at: string | null;
  created_at: string;
};

export default function NotificationBell({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifications() {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifications(data);
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [userId, supabase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function handleClick(n: Notification) {
    if (!n.read_at) {
      const now = new Date().toISOString();
      await supabase.from("notifications").update({ read_at: now }).eq("id", n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: now } : x)));
    }
    setOpen(false);
    if (n.project_id) router.push(`/proje/${n.project_id}`);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-lg leading-none text-ink-soft hover:text-ink"
        aria-label="Bildirimler"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-ink-soft">Henüz bildirim yok.</p>
          ) : (
            <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`rounded-lg p-3 text-left text-sm hover:bg-background ${
                    n.read_at ? "text-ink-soft" : "font-semibold text-ink"
                  }`}
                >
                  {n.message}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
