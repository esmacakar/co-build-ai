"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 rounded-lg border-l-4 border-transparent px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-coral/10 hover:text-coral-dark md:justify-start"
    >
      <LogOut size={20} className="shrink-0" />
      <span className="hidden md:inline">Çıkış Yap</span>
    </button>
  );
}
