const LABELS: Record<string, { text: string; className: string }> = {
  available: { text: "Yeni Tekliflere Açık", className: "bg-periwinkle/30 text-periwinkle-dark" },
  busy: { text: "Şu An Meşgul", className: "bg-petal text-coral-dark" },
  vacation: { text: "Tatil Modunda", className: "bg-ink/10 text-ink-soft" },
};

export default function AvailabilityBadge({ availability }: { availability: string | null }) {
  if (!availability || !LABELS[availability]) return null;
  const { text, className } = LABELS[availability];

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{text}</span>
  );
}
