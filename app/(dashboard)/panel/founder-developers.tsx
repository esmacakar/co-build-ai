"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Avatar from "@/app/components/avatar";
import RatingStars from "@/app/components/rating-stars";
import AvailabilityBadge from "@/app/components/availability-badge";

type Developer = {
  id: string;
  full_name: string | null;
  bio: string | null;
  skills: string[] | null;
  availability: string | null;
  ratingAvg: number | null;
  ratingCount: number;
};

export default function FounderDevelopers({ developers }: { developers: Developer[] }) {
  const [query, setQuery] = useState("");

  if (developers.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
        <p className="text-2xl">🧑‍💻</p>
        <p className="mt-2 text-sm text-ink-soft">Henüz kayıtlı bir yazılımcı yok.</p>
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = developers.filter((d) => {
    if (!q) return true;
    const nameMatch = d.full_name?.toLowerCase().includes(q);
    const skillMatch = d.skills?.some((s) => s.toLowerCase().includes(q));
    return nameMatch || skillMatch;
  });

  return (
    <div className="mt-10">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İsim veya beceriye göre ara..."
          className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-coral sm:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">Bu kritere uyan bir yazılımcı yok.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {filtered.map((dev) => (
            <div key={dev.id} className="rounded-xl border border-ink/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <Avatar name={dev.full_name} role="developer" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {dev.full_name ?? "İsimsiz Yazılımcı"}
                    </h3>
                    <AvailabilityBadge availability={dev.availability} />
                  </div>
                  <RatingStars average={dev.ratingAvg} count={dev.ratingCount} />
                </div>
              </div>
              {dev.bio && <p className="mt-2 text-sm text-ink-soft">{dev.bio}</p>}
              {dev.skills && dev.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {dev.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-periwinkle/20 px-3 py-1 font-mono text-xs text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
