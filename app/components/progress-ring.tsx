export default function ProgressRing({
  value,
  size = 44,
  strokeWidth = 4,
  ringColor = "var(--color-periwinkle-dark)",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Halkanın rengi. Verilmezse mevcut davranış (periwinkle-dark) korunur. */
  ringColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-ink/10"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-ink">
        {value}
      </span>
    </div>
  );
}
