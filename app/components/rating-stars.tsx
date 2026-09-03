import { Star } from "lucide-react";

export default function RatingStars({
  average,
  count,
  size = 14,
  tone = "onLight",
}: {
  average: number | null;
  count: number;
  size?: number;
  tone?: "onLight" | "onDark";
}) {
  const softClass = tone === "onDark" ? "text-white/50" : "text-ink-soft";
  const strongClass = tone === "onDark" ? "text-white" : "text-ink";

  if (!average || count === 0) {
    return <span className={`text-xs ${softClass}`}>Henüz değerlendirme yok</span>;
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${softClass}`}>
      <Star size={size} className="fill-coral text-coral" />
      <span className={`font-semibold ${strongClass}`}>{average.toFixed(1)}</span>
      <span>({count})</span>
    </span>
  );
}
