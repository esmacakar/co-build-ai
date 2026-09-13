import { ArrowRight, Terminal, Shuffle } from "lucide-react";

export default function DualEntrySection({ idSuffix = "" }: { idSuffix?: string }) {
  return (
    <section id={`basla${idSuffix}`} className="px-6 pb-20 sm:px-12">
      <div className="reveal mx-auto max-w-3xl text-center">
        <span className="w-fit text-sm font-semibold uppercase tracking-widest text-[#44ACFF]">
          Sana uygun kapıyı seç
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          <span className="highlight-sweep" style={{ ["--sweep-color" as string]: "#FE9EC7" }}>
            Nasıl Katılmak İstersin?
          </span>
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
        {/* Fikir Sahibi kartı */}
        <div className="reveal flex flex-col rounded-3xl bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
          <span className="w-fit rounded-full bg-[#FE9EC7]/30 px-3 py-1 text-xs font-semibold text-[#c23570]">
            Fikir Sahibi
          </span>
          <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-slate-800">
            Ham Fikrini Projelendir
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
            Teknik bilgiye ihtiyacın yok. Sadece fikrini anlat; yapay zeka senin için
            profesyonel bir teknik şartname (PRD) hazırlasın ve seni en doğru ekiple
            eşleştirsin.
          </p>
          <a
            href="/kayit-ol?tip=founder"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#FE9EC7] px-6 py-3.5 text-base font-semibold text-slate-800 shadow-[0_10px_20px_rgba(254,158,199,0.45)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Girişimci Olarak Başla
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Yazılımcı kartı — terminal hissiyatı */}
        <div className="reveal flex flex-col rounded-3xl bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md font-mono">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#89D4FF]/40 px-3 py-1 text-xs font-semibold text-[#0f6ab0]">
            <Terminal size={12} />
            developer
          </span>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-800">
            {"<Developer_Login />"}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
            {"// Agentic RAG tarafından onaylanmış, teknik gereksinimleri net"}
            <br />
            {"// projelere katıl. Patentlerini sisteme tanıt, pgvector semantik"}
            <br />
            {"// aramada Top-5 listesine gir."}
          </p>
          <a
            href="/kayit-ol?tip=developer"
            className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-[#89D4FF] px-6 py-3.5 text-base font-semibold text-slate-800 shadow-[0_10px_20px_rgba(137,212,255,0.5)] transition-colors hover:bg-[#6fc4f8]"
          >
            [ execute_join() ]
          </a>
        </div>

        {/* Dual hesap kartı */}
        <div className="reveal flex flex-col rounded-3xl bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#44ACFF]/25 px-3 py-1 text-xs font-semibold text-[#1666a8]">
            <Shuffle size={12} />
            Hem fikir hem kod
          </span>
          <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-slate-800">
            Hem fikrin var hem kod yazabiliyor musun?
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
            Tek hesapla hem fikrini geliştir hem
            kendine ortak yazılımcı ara, dilediğin an Fikir Sahibi / Yazılımcı modu
            arasında geçiş yaparsın.
          </p>
          <a
            href="/kayit-ol?tip=both"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#44ACFF] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(68,172,255,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Dual Hesap Aç
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
