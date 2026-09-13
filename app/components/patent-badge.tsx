import { Award } from "lucide-react";

export default function PatentBadge({ hasPatent }: { hasPatent: boolean | null | undefined }) {
  if (!hasPatent) return null;

  return (
    <span
      title="Tescilli bir patenti doğrulanmış yazılımcı"
      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
    >
      <Award size={12} />
      Tescilli Mucit
    </span>
  );
}
