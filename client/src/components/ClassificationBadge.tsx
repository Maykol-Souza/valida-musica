import type { Classification } from "../types/review";

const STYLES: Record<Classification, { label: string; className: string }> = {
  APROVADA: { label: "Aprovada", className: "bg-green-500/15 text-green-300 border-green-600/40" },
  ATENCAO: { label: "Atenção", className: "bg-amber-500/15 text-amber-300 border-amber-600/40" },
  REPROVADA: { label: "Reprovada", className: "bg-red-500/15 text-red-300 border-red-600/40" },
};

export default function ClassificationBadge({ classification }: { classification: Classification }) {
  const style = STYLES[classification];
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}
