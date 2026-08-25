"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function PrdStatus({ projectId }: { projectId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [statusText, setStatusText] = useState("PRD hazırlanıyor...");

  useEffect(() => {
    const interval = setInterval(async () => {
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
          setStatusText("Bir hata oluştu: " + data.message);
        }
      } catch {
        // Sunucuya anlık ulaşılamazsa sessizce tekrar dener
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [projectId, router, supabase]);

  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-ink/10 bg-white p-8 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-coral border-t-transparent" />
      <p className="text-sm text-ink-soft">{statusText}</p>
      <p className="text-xs text-ink-soft/70">
        Bu işlem birkaç dakika sürebilir. Sayfadan ayrılabilirsin, PRD hazır
        olduğunda burada görünecek.
      </p>
    </div>
  );
}