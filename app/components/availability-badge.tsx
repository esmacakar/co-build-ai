const LABELS: Record<string, { text: string; className: string; onDarkClassName: string }> = {
  available: {
    text: "Yeni Tekliflere Açık",
    className: "bg-periwinkle/30 text-periwinkle-dark",
    onDarkClassName: "bg-periwinkle/30 text-periwinkle-dark",
  },
  busy: {
    text: "Şu An Meşgul",
    className: "bg-petal text-coral-dark",
    onDarkClassName: "bg-petal text-coral-dark",
  },
  vacation: {
    text: "Tatil Modunda",
    className: "bg-ink/10 text-ink-soft",
    onDarkClassName: "bg-white/10 text-white/60",
  },
};

export default function AvailabilityBadge({
  availability,
  tone = "onLight",
}: {
  availability: string | null;
  tone?: "onLight" | "onDark";
}) {
  if (!availability || !LABELS[availability]) return null;
  const { text, className, onDarkClassName } = LABELS[availability];
  const resolvedClassName = tone === "onDark" ? onDarkClassName : className;

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${resolvedClassName}`}>{text}</span>
  );
}
