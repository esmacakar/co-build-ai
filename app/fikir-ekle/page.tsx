"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function FikirEkle() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [rawIdea, setRawIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

      async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Oturum bulunamadı, lütfen tekrar giriş yap.");
      setLoading(false);
      return;
    }

    // 1. Adım: Fikrin "doğuş zamanı" kanıtı için basit bir hash oluştur
    const ideaText = `${title}|${rawIdea}|${user.id}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(ideaText);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ideaHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // 2. Adım: Fikri veritabanına kaydet (PRD henüz yok, arka planda üretilecek)
    const { data: newProject, error: insertError } = await supabase
      .from("projects")
      .insert({
        founder_id: user.id,
        title,
        raw_idea: rawIdea,
        status: "draft",
        idea_hash: ideaHash,
        idea_created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // 3. Adım: AI servisine PRD üretimini arka planda başlat (cevabı beklemeden)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/prd-uret-baslat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: newProject.id,
          title,
          raw_idea: rawIdea,
        }),
      });
    } catch {
      // Başlatma isteği başarısız olsa bile devam ediyoruz,
      // proje sayfası durumu ayrıca gösterecek.
    }

    setLoading(false);
    router.push(`/proje/${newProject.id}`);
  }
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-center font-display text-3xl font-semibold text-ink">
          Fikrini Anlat
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Teknik terim kullanmana gerek yok, aklından geçeni kendi
          cümlelerinle yaz.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink">
              Proje Başlığı
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="örn. Komşular Arası Eşya Paylaşım Uygulaması"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-coral"
            />
          </div>

          <div>
            <label htmlFor="rawIdea" className="block text-sm font-medium text-ink">
              Fikrini Anlat
            </label>
            <textarea
              id="rawIdea"
              required
              rows={8}
              placeholder="Ne yapmak istiyorsun? Kim kullanacak? Hangi sorunu çözüyor? Aklına gelen her şeyi yaz, ne kadar detaylı olursa o kadar iyi."
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="mt-1 w-full resize-none rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-coral"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-coral px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Fikrimi Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}