"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function MessageBell({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      const { data: devOffers } = await supabase.from("offers").select("id").eq("developer_id", userId);

      const { data: myProjects } = await supabase.from("projects").select("id").eq("founder_id", userId);
      const projectIds = (myProjects ?? []).map((p) => p.id);

      let founderOffers: { id: string }[] = [];
      if (projectIds.length > 0) {
        const { data } = await supabase.from("offers").select("id").in("project_id", projectIds);
        founderOffers = data ?? [];
      }

      const offerIds = [...new Set([...(devOffers ?? []), ...founderOffers].map((o) => o.id))];

      if (offerIds.length === 0) {
        setUnreadCount(0);
        return;
      }

      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("offer_id", offerIds)
        .neq("sender_id", userId)
        .is("read_at", null);

      setUnreadCount(count ?? 0);
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => clearInterval(interval);
  }, [userId, supabase]);

  return (
    <button
      onClick={() => router.push("/mesajlar")}
      className="relative text-ink-soft hover:text-ink"
      aria-label="Mesajlar"
      title="Mesajlar"
    >
      <MessageCircle size={20} />
      {unreadCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white shadow-[0_2px_6px_rgba(239,68,104,0.5)]">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
