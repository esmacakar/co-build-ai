"use client";

/**
 * matched-developers.tsx
 * ============================================================================
 * "Top 5 Eşleşen Yazılımcılar" — proje detay sayfasının PRD'nin yanında
 * gösterdiği, semantik eşleştirme motorunun bulduğu yazılımcı kartları.
 *
 * Veri kaynağı: `projects.onerilen_gelistiriciler` (jsonb) — PRD üretimi
 * tamamlandığında `prd-status.tsx` tarafından AI sunucusunun döndürdüğü
 * `onerilen_gelistiriciler` alanı buraya kaydediliyor (bkz. prd-status.tsx
 * içindeki yorum). Mevcut değilse (eski projeler, ya da eşleştirme motoru
 * henüz hiç sonuç bulamadıysa) bileşen hiçbir şey render etmez.
 *
 * "Mesaj Gönder" ve "Anlaşma Teklifi At" butonları şimdilik sadece
 * console.log yapıyor — teklif/mesajlaşma akışına bağlanması ayrı bir iş
 * (muhtemelen mevcut `ChatBox` / `offers` tablosu akışına entegre edilecek).
 */

import Avatar from "@/app/components/avatar";
import ProgressRing from "@/app/components/progress-ring";

export type EslesenGelistirici = {
  developer_id: string;
  ad_soyad: string;
  skills: string[];
  bio: string;
  uyum_skoru: number; // 0-100
};

/** Uyum skoruna göre kırmızıdan yeşile geçen bir HSL renk üretir. */
function uyumRengiHesapla(skor: number): string {
  const hue = Math.max(0, Math.min(100, skor)) * 1.2; // 0 -> kırmızı, 100 -> yeşil
  return `hsl(${hue}, 70%, 42%)`;
}

export default function MatchedDevelopers({
  gelistiriciler,
  onMesajGonder,
  onTeklifAt,
}: {
  gelistiriciler: EslesenGelistirici[];
  onMesajGonder?: (gelistirici: EslesenGelistirici) => void;
  onTeklifAt?: (gelistirici: EslesenGelistirici) => void;
}) {
  if (!gelistiriciler || gelistiriciler.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Eşleşen Yazılımcılar (Top {gelistiriciler.length})
        </p>
        <span className="rounded-full bg-petal px-3 py-1 font-mono text-[10px] font-medium text-coral-dark">
          AI Eşleştirme
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {gelistiriciler.map((gelistirici) => (
          <div
            key={gelistirici.developer_id}
            className="rounded-xl border border-ink/10 bg-white p-5 transition-colors hover:border-coral/30"
          >
            <div className="flex items-start gap-3">
              <Avatar name={gelistirici.ad_soyad} role="developer" size="md" />

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-base font-semibold text-ink">
                  {gelistirici.ad_soyad}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                  {gelistirici.bio}
                </p>
              </div>

              <ProgressRing
                value={gelistirici.uyum_skoru}
                size={48}
                strokeWidth={4}
                ringColor={uyumRengiHesapla(gelistirici.uyum_skoru)}
              />
            </div>

            {gelistirici.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {gelistirici.skills.map((beceri) => (
                  <span
                    key={beceri}
                    className="rounded-full bg-periwinkle/20 px-2.5 py-0.5 font-mono text-[11px] text-ink"
                  >
                    {beceri}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onMesajGonder ? onMesajGonder(gelistirici) : console.log("Mesaj Gönder:", gelistirici)
                }
                className="flex-1 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                Mesaj Gönder
              </button>
              <button
                type="button"
                onClick={() => (onTeklifAt ? onTeklifAt(gelistirici) : console.log("Anlaşma Teklifi At:", gelistirici))}
                className="flex-1 rounded-full bg-gradient-to-r from-coral to-coral-dark px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-coral/30 transition-shadow hover:shadow-md hover:shadow-coral/40 active:scale-[0.98]"
              >
                Anlaşma Teklifi At
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
