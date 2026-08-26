export default function ProjectProgressCard({
  project,
}: {
  project: {
    id: string;
    title: string;
    progress: number;
    offerCount: number;
  };
}) {
  return (
    <a
      href={`/proje/${project.id}`}
      className="block rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-coral/40"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate font-display text-sm font-semibold text-ink">{project.title}</h3>
        <span className="shrink-0 rounded-full bg-petal px-2.5 py-0.5 text-xs font-bold text-coral-dark">
          {project.progress}%
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-coral transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        {project.offerCount > 0 ? `${project.offerCount} teklif` : "Henüz teklif yok"}
      </p>
    </a>
  );
}
