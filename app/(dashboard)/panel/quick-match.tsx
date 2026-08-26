"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/components/avatar";
import RatingStars from "@/app/components/rating-stars";
import AvailabilityBadge from "@/app/components/availability-badge";

type Developer = {
  id: string;
  full_name: string | null;
  skills: string[] | null;
  availability: string | null;
  ratingAvg: number | null;
  ratingCount: number;
};

export default function QuickMatch({ userId, developers }: { userId: string; developers: Developer[] }) {
  const supabase = createClient();
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [matches, setMatches] = useState<(Developer & { matchScore: number })[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);

  function pollForResult(id: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/prd-durum/${id}`);
        const data = await res.json();

        if (data.status === "done") {
          clearInterval(interval);
          await supabase
            .from("projects")
            .update({ generated_prd: data.prd, required_skills: data.skills })
            .eq("id", id);

          const skills: string[] = data.skills ?? [];
          const skillSet = new Set(skills.map((s: string) => s.toLowerCase()));

          const ranked = developers
            .map((d) => {
              const devSkills = d.skills ?? [];
              const overlap = devSkills.filter((s) => skillSet.has(s.toLowerCase())).length;
              const matchScore = skills.length > 0 ? Math.round((overlap / skills.length) * 100) : 0;
              return { ...d, matchScore };
            })
            .filter((d) => d.matchScore > 0)
            .sort((a, b) => {
              if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
              return (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0);
            })
            .slice(0, 5);

          setMatches(ranked);
          setStatus("done");
        } else if (data.status === "error") {
          clearInterval(interval);
          setStatus("error");
        }
      } catch {
        // Sunucuya anlık ulaşılamazsa sessizce tekrar dener
      }
    }, 4000);
  }

  async function handleSubmit() {
    if (!idea.trim()) return;
    setStatus("generating");

    const title = idea.trim().slice(0, 60);
    const ideaText = `${title}|${idea}|${userId}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(ideaText));
    const ideaHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const { data: newProject, error } = await supabase
      .from("projects")
      .insert({
        founder_id: userId,
        title,
        raw_idea: idea,
        status: "draft",
        idea_hash: ideaHash,
        idea_created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !newProject) {
      setStatus("error");
      return;
    }
    setProjectId(newProject.id);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/prd-uret-baslat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: newProject.id, title, raw_idea: idea }),
      });
    } catch {
      // Başlatma isteği başarısız olsa bile polling devam eder
    }

    pollForResult(newProject.id);
  }

  if (status === "idle") {
    return (
      <div className="rounded-xl border border-ink/10 border-l-4 border-l-coral bg-white p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
          ✨ Hızlı Eşleştirme
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Aklındaki projeyi kısaca anlat, AI PRD&apos;ye çevirsin ve sana en uygun kayıtlı
          yazılımcıları puanlarına göre sıralasın.
        </p>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          placeholder="Örn: Komşular arası eşya paylaşım uygulaması, React Native ile mobil..."
          className="mt-3 w-full resize-none rounded-lg border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        <button
          onClick={handleSubmit}
          className="mt-3 rounded-full bg-coral px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          Eşleştir
        </button>
      </div>
    );
  }

  if (status === "generating") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-5">
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-coral border-t-transparent" />
        <p className="text-sm text-ink-soft">
          AI fikrini analiz ediyor, bu birkaç dakika sürebilir...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-coral/30 bg-white p-5 text-sm text-coral-dark">
        Bir şeyler ters gitti, tekrar dener misin?
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Sana Uygun Yazılımcılar
        </p>
        {projectId && (
          <a href={`/proje/${projectId}`} className="text-xs font-semibold text-coral-dark hover:underline">
            PRD&apos;yi Gör →
          </a>
        )}
      </div>

      {matches.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">Şu an eşleşen kayıtlı bir yazılımcı yok.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {matches.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-lg border border-ink/10 p-3">
              <Avatar name={d.full_name} role="developer" size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{d.full_name ?? "İsimsiz"}</p>
                  <AvailabilityBadge availability={d.availability} />
                </div>
                <RatingStars average={d.ratingAvg} count={d.ratingCount} />
              </div>
              <span className="shrink-0 rounded-full bg-periwinkle/30 px-2.5 py-0.5 text-xs font-bold text-periwinkle-dark">
                %{d.matchScore}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
