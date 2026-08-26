const TONES = {
  pink: "bg-petal text-coral-dark",
  lime: "bg-periwinkle/40 text-periwinkle-dark",
  dark: "bg-ink text-white",
};

export default function StatCircle({
  value,
  label,
  tone = "pink",
  size = 140,
}: {
  value: string | number;
  label: string;
  tone?: keyof typeof TONES;
  size?: number;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 flex-col items-center justify-center rounded-full text-center ${TONES[tone]}`}
    >
      <span className="font-display text-3xl font-bold leading-none">{value}</span>
      <span className="mt-1.5 max-w-[80%] text-[10px] font-semibold uppercase leading-tight tracking-wide opacity-80">
        {label}
      </span>
    </div>
  );
}
