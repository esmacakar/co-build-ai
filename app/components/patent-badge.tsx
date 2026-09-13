import { Award } from "lucide-react";

export default function PatentBadge({
  hasPatent,
  patentUrl,
}: {
  hasPatent: boolean | null | undefined;
  patentUrl?: string | null;
}) {
  if (!hasPatent) return null;

  const className =
    "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800";

  if (patentUrl) {
    return (
      <a
        href={patentUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Patent belgesini görüntüle"
        className={`${className} hover:bg-amber-200`}
      >
        <Award size={12} />
        Tescilli Mucit
      </a>
    );
  }

  return (
    <span title="Tescilli bir patenti doğrulanmış yazılımcı" className={className}>
      <Award size={12} />
      Tescilli Mucit
    </span>
  );
}
