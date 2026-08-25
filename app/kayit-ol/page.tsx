"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function KayitOl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"founder" | "developer">("founder");
    const [termsAccepted, setTermsAccepted] = useState(false);
  
  useEffect(() => {
    const tip = searchParams.get("tip");
    if (tip === "developer" || tip === "founder") {
      setUserType(tip);
    }
  }, [searchParams]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!termsAccepted) {
      setError("Devam etmek için aydınlatma metnini onaylaman gerekiyor.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // 1. Adım: Supabase Authentication ile kullanıcıyı oluştur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Kayıt sırasında beklenmeyen bir hata oluştu.");
      setLoading(false);
      return;
    }

    // 2. Adım: profiles tablosuna ek bilgileri kaydet
        const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      user_type: userType,
      full_name: fullName,
      terms_accepted_at: new Date().toISOString(),
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/panel");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-3xl font-semibold text-ink">
          Co-Build AI&apos;a Katıl
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Fikrini hayata geçirmeye ilk adımı at.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-ink">
              Ben bir...
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("founder")}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  userType === "founder"
                    ? "border-coral bg-coral/10 text-coral-dark"
                    : "border-ink/10 text-ink-soft"
                }`}
              >
                Fikir Sahibiyim
              </button>
              <button
                type="button"
                onClick={() => setUserType("developer")}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  userType === "developer"
                    ? "border-periwinkle-dark bg-periwinkle/20 text-ink"
                    : "border-ink/10 text-ink-soft"
                }`}
              >
                Yazılımcıyım
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-ink">
              Ad Soyad
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-coral"
            />
          </div>

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
              className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-coral"
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-coral"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-coral"
            />
            <span>
              Platforma girdiğim proje bilgilerinin ve hesap verilerimin
              veritabanında saklandığını, olası bir anlaşmazlık durumunda
              taraflar arasındaki süreci netleştirmek amacıyla referans
              olarak kullanılabileceğini okudum, kabul ediyorum.
            </span>
          </label>

          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-coral px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-coral-dark disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Hesap Oluştur"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Zaten hesabın var mı?{" "}
          <a href="/giris" className="font-semibold text-coral-dark">
            Giriş yap
          </a>
        </p>
      </div>
    </div>
  );
}