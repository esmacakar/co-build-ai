const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
};

export default function Avatar({
  name,
  role,
  size = "md",
}: {
  name: string | null;
  role: "founder" | "developer";
  size?: "sm" | "md" | "lg";
}) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";
  const bg = role === "founder" ? "bg-coral" : "bg-periwinkle-dark";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${bg} ${SIZE_CLASSES[size]}`}
    >
      {initial}
    </div>
  );
}
