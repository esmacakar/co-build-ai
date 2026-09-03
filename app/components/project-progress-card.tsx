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
      className="block rounded-xl bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(17,24,39,0.05),0_2px_8px_rgba(17,24,39,0.05),0_16px_40px_rgba(17,24,39,0.10)] p-6 transition-all [transform-style:preserve-3d] hover:[transform:perspective(900px)_rotateX(2deg)_translateY(-4px)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(17,24,39,0.05),0_4px_14px_rgba(17,24,39,0.08),0_28px_60px_rgba(17,24,39,0.16)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-bold text-ink">{project.title}</h3>
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
