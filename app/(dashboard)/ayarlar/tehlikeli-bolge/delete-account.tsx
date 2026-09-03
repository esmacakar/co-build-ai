"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DeleteAccount({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText.trim().toLowerCase() === userEmail.toLowerCase();

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    setError(null);

    const res = await fetch("/api/hesap-sil", { method: "POST" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Hesap silinirken bir hata oluştu.");
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-coral/30 bg-coral/5 p-6">
      <h2 className="text-lg font-bold text-coral-dark">Tehlikeli Bölge</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Hesabını sildiğinde profilin, projelerin, tekliflerin, mesajların ve tüm diğer
        verilerin kalıcı olarak silinir. Bu işlem <strong>geri alınamaz</strong>.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:max-w-sm">
        <label className="text-sm text-ink-soft">
          Onaylamak için e-posta adresini (<strong>{userEmail}</strong>) yaz:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={userEmail}
          className="rounded-lg border border-coral/30 px-4 py-2.5 text-sm outline-none focus:border-coral"
        />

        {error && <p className="text-sm text-coral-dark">{error}</p>}

        <button
          onClick={handleDelete}
          disabled={!canDelete || deleting}
          className="self-start rounded-full bg-coral-dark px-6 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_0_0_#8a1a37,0_10px_20px_rgba(209,39,74,0.35)] transition-all hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0px_0_0_#8a1a37,0_2px_6px_rgba(209,39,74,0.30)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting ? "Siliniyor..." : "Hesabımı Kalıcı Olarak Sil"}
        </button>
      </div>
    </div>
  );
}
