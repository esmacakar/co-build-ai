"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const MAX_BEKLEME_SANIYE = 300; // 5 dakika

export default function PrdStatus({ projectId }: { projectId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [statusText, setStatusText] = useState("PRD hazırlanıyor...");
  const [hataOldu, setHataOldu] = useState(false);

  useEffect(() => {
    const baslangicZamani = Date.now();

    const interval = setInterval(async () => {
      const gecenSure = (Date.now() - baslangicZamani) / 1000;

      if (gecenSure > MAX_BEKLEME_SANIYE) {
        clearInterval(interval);
        setHataOldu(true);
        setStatusText(
          "İşlem 5 dakikayı aştı, sunucuya ulaşılamıyor olabilir. Lütfen daha sonra tekrar dene."
        );
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/prd-durum/${projectId}`
        );
        const data = await res.json();

        if (data.status === "done") {
          clearInterval(interval);
          setStatusText("PRD hazır, kaydediliyor...");

          await supabase
            .from("projects")
            .update({
              generated_prd: data.prd,
              required_skills: data.skills,
            })
            .eq("id", projectId);

          router.refresh();
        } else if (data.status === "error") {
          clearInterval(interval);
          setHataOldu(true);
          setStatusText("Bir hata oluştu: " + data.message);
        }
      } catch {
        // Sunucuya anlık ulaşılamazsa sessizce tekrar dener,
        // ama üstteki 5 dakikalık genel zaman aşımı yine de geçerli olur.
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [projectId, router, supabase]);

  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-ink/10 bg-white p-8 text-center">
      {!hataOldu ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-coral border-t-transparent" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
          !
        </div>
      )}
      <p className={`text-sm ${hataOldu ? "text-red-600" : "text-ink-soft"}`}>
        {statusText}
      </p>
      {!hataOldu && (
        <p className="text-xs text-ink-soft/70">
          Bu işlem birkaç dakika sürebilir. Sayfadan ayrılabilirsin, PRD hazır
          olduğunda burada görünecek.
        </p>
      )}
    </div>
  );
}