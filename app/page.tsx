export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background">
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <span className="text-xl font-extrabold tracking-tight text-ink">
          Co-Build AI
        </span>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft sm:flex">
  <a href="#nasil-calisir" className="hover:text-ink">
    Nasıl Çalışır
  </a>
  <a href="#" className="hover:text-ink">
    Yazılımcılar İçin
  </a>
</nav>
<div className="flex items-center gap-4">
  <a href="/giris" className="text-sm font-semibold text-ink-soft hover:text-ink">
    Giriş Yap
  </a>
  <a
    href="/kayit-ol"
    className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_0_0_var(--color-coral-dark),0_10px_20px_rgba(239,68,104,0.35)] transition-all hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0px_0_0_var(--color-coral-dark),0_2px_6px_rgba(239,68,104,0.30)]"
  >
    Ücretsiz Başla
  </a>
</div>
      </header>

      <main className="flex flex-1 flex-col items-center bg-gradient-to-b from-petal via-white to-white px-6 pt-16 pb-24 text-center sm:px-12 sm:pt-24">
        <span className="rounded-full bg-white px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-coral shadow-sm">
          Fikrinden ürüne, AI ile
        </span>

        <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-6xl sm:leading-tight">
          Fikrini yaz,{" "}
          <span className="bg-gradient-to-r from-coral to-periwinkle-dark bg-clip-text text-transparent">
            AI şartnameye çevirsin
          </span>
          , doğru yazılımcıyla eşleş.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Teknik bilgin olmasa da olur. Projeni anlat, yapay zeka onu
          profesyonel bir teknik dökümana dönüştürsün, sana en uygun
          yazılımcıları önersin.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="/kayit-ol?tip=founder" className="rounded-full bg-coral px-8 py-3.5 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_0_0_var(--color-coral-dark),0_10px_20px_rgba(239,68,104,0.35)] transition-all hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0px_0_0_var(--color-coral-dark),0_2px_6px_rgba(239,68,104,0.30)]">
            Fikrimi Paylaşayım
          </a>
          <a href="/kayit-ol?tip=developer" className="rounded-full bg-petal px-8 py-3.5 text-base font-semibold text-periwinkle-dark transition-colors hover:bg-periwinkle/20">
            Yazılımcı Olarak Katıl
          </a>
        </div>
      </main>

      <section id="nasil-calisir" className="border-t border-ink/10 bg-petal/40 px-6 py-20 sm:px-12">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink">
          Nasıl Çalışır?
        </h2>

        <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3">
          <div className="flex flex-col items-start">
            <span className="bg-gradient-to-r from-coral to-periwinkle-dark bg-clip-text text-4xl font-extrabold text-transparent">01</span>
            <h3 className="mt-3 text-lg font-bold text-ink">Fikrini Anlat</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Projeni kendi cümlelerinle yaz. Teknik terim bilmene gerek yok.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <span className="bg-gradient-to-r from-coral to-periwinkle-dark bg-clip-text text-4xl font-extrabold text-transparent">02</span>
            <h3 className="mt-3 text-lg font-bold text-ink">AI Şartnameye Çevirir</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Yapay zeka fikrini profesyonel bir teknik dökümana (PRD) dönüştürür.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <span className="bg-gradient-to-r from-coral to-periwinkle-dark bg-clip-text text-4xl font-extrabold text-transparent">03</span>
            <h3 className="mt-3 text-lg font-bold text-ink">Doğru Yazılımcıyla Eşleş</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Projene en uygun yazılımcı profillerini gör, AI önerisi al veya kendin seç.
            </p>
          </div>
        </div>
      </section>
      <footer className="px-6 py-8 text-center text-sm text-ink-soft sm:px-12">
        © 2026 Co-Build AI
      </footer>
    </div>
  );
}