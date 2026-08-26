"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ProjectMatchCard from "@/app/components/project-match-card";

type ProjectWithMatch = {
  id: string;
  title: string;
  raw_idea: string;
  required_skills: string[] | null;
  founderName: string | null;
  matchScore: number;
  payment_type: "fixed" | "equity" | "flexible" | null;
  payment_amount: number | null;
};

type TabId = "all" | "matched" | "budget" | "fixed";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "matched", label: "Benim İçin Eşleşenler" },
  { id: "budget", label: "Yüksek Bütçeli" },
  { id: "fixed", label: "Sabit Ücretli" },
];

export default function DeveloperProjects({ projects }: { projects: ProjectWithMatch[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabId>("all");

  if (projects.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
        <p className="text-2xl">🔭</p>
        <p className="mt-2 text-sm text-ink-soft">
          Şu an yayınlanmış bir proje yok. Daha sonra tekrar kontrol et!
        </p>
      </div>
    );
  }

  const searched = projects.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));

  let visible = searched;
  if (tab === "matched") {
    visible = searched.filter((p) => p.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
  } else if (tab === "budget") {
    visible = searched
      .filter((p) => p.payment_amount !== null)
      .sort((a, b) => (b.payment_amount ?? 0) - (a.payment_amount ?? 0));
  } else if (tab === "fixed") {
    visible = searched.filter((p) => p.payment_type === "fixed");
  }

  return (
    <div className="mt-10">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Projelerde ara..."
          className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-coral sm:max-w-xs"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-coral text-white" : "border border-ink/15 text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">Bu kritere uyan bir proje yok.</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {visible.map((project) => (
            <ProjectMatchCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
