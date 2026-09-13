"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, FileText, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Giris() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
      style={{
        background:
          "radial-gradient(60% 50% at 15% 100%, rgba(137,212,255,0.35) 0%, transparent 70%), radial-gradient(55% 45% at 100% 0%, rgba(249,246,196,0.6) 0%, transparent 70%), #fafafc",
      }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-md md:grid md:grid-cols-2">
        {/* Sol taraf: giriş formu */}
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Tekrar Hoş Geldin
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Hesabına giriş yap, kaldığın yerden devam et.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-full bg-ink/5 px-5 py-3 text-sm text-ink shadow-[inset_0_2px_5px_rgba(17,24,39,0.06)] outline-none transition-shadow focus:ring-2 focus:ring-coral/40"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-full bg-ink/5 px-5 py-3 text-sm text-ink shadow-[inset_0_2px_5px_rgba(17,24,39,0.06)] outline-none transition-shadow focus:ring-2 focus:ring-coral/40"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gradient-to-r from-[#44ACFF] to-[#FE9EC7] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(68,172,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(68,172,255,0.45)] active:translate-y-0 disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-soft">
            Hesabın yok mu?{" "}
            <a href="/kayit-ol" className="font-semibold text-coral-dark">
              Kayıt ol
            </a>
          </p>
        </div>

        {/* Sağ taraf: dekoratif tanıtım paneli */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#89D4FF] via-[#bfe3ff] to-[#FE9EC7] p-10 md:flex md:flex-col md:justify-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

          <div className="relative flex flex-col gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#44ACFF] shadow-lg shadow-slate-900/10">
              <Sparkles size={22} />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Fikirden ürüne, AI ile
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-slate-700">
              Kendi GPU sunucumuzda çalışan açık kaynak yapay zekayla; fikrini teknik
              şartnameye çevir, doğru ekiple eşleş.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#44ACFF] text-white">
                  <FileText size={16} />
                </span>
                <span className="text-sm font-semibold text-slate-800">Agentic RAG ile PRD üretimi</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FE9EC7] text-white">
                  <Users size={16} />
                </span>
                <span className="text-sm font-semibold text-slate-800">Semantik yazılımcı eşleştirme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
