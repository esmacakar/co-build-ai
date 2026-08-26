import { Star } from "lucide-react";

export default function RatingStars({
  average,
  count,
  size = 14,
}: {
  average: number | null;
  count: number;
  size?: number;
}) {
  if (!average || count === 0) {
    return <span className="text-xs text-ink-soft">Henüz değerlendirme yok</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
      <Star size={size} className="fill-coral text-coral" />
      <span className="font-semibold text-ink">{average.toFixed(1)}</span>
      <span>({count})</span>
    </span>
  );
}
