import type { Classification } from "../types/review";

const STYLES: Record<Classification, { label: string; className: string }> = {
  APROVADA: { label: "Aprovada", className: "bg-green-100 text-green-800 border-green-300" },
  ATENCAO: { label: "Atenção", className: "bg-amber-100 text-amber-800 border-amber-300" },
  REPROVADA: { label: "Reprovada", className: "bg-red-100 text-red-800 border-red-300" },
};

export default function ClassificationBadge({ classification }: { classification: Classification }) {
  const style = STYLES[classification];
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}
