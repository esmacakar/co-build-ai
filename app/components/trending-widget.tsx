import Avatar from "./avatar";

export default function TrendingWidget({
  trendingProjects,
  trendingDevelopers,
}: {
  trendingProjects: { id: string; title: string; offerCount: number }[];
  trendingDevelopers: { id: string; full_name: string | null; acceptedCount: number }[];
}) {
  if (trendingProjects.length === 0 && trendingDevelopers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {trendingProjects.length > 0 && (
        <div className="rounded-2xl bg-blue-200 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-2px_0_rgba(96,165,250,0.6),0_4px_14px_rgba(59,130,246,0.15),0_28px_55px_rgba(59,130,246,0.25)]">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-900">
            Öne Çıkan Projeler
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {trendingProjects.map((p, i) => (
              <a
                key={p.id}
                href={`/proje/${p.id}`}
                className="flex items-center gap-2 text-sm text-blue-900 transition-opacity hover:opacity-70"
              >
                <span className="font-bold text-blue-700">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{p.title}</span>
                <span className="shrink-0 text-xs text-blue-700">{p.offerCount} teklif</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {trendingDevelopers.length > 0 && (
        <div className="rounded-2xl bg-blue-200 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-2px_0_rgba(96,165,250,0.6),0_4px_14px_rgba(59,130,246,0.15),0_28px_55px_rgba(59,130,246,0.25)]">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-900">
            En Aktif Yazılımcılar
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {trendingDevelopers.map((d) => (
              <div key={d.id} className="flex items-center gap-2">
                <Avatar name={d.full_name} role="developer" size="sm" />
                <span className="min-w-0 flex-1 truncate text-sm text-blue-900">{d.full_name ?? "İsimsiz"}</span>
                <span className="shrink-0 text-xs text-blue-700">{d.acceptedCount} kabul</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
