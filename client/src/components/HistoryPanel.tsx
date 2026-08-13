import type { HistorySummary } from "../types/review";
import ClassificationBadge from "./ClassificationBadge";

interface HistoryPanelProps {
  entries: HistorySummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function HistoryPanel({ entries, selectedId, onSelect }: HistoryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#090d17] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.28)]">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">Histórico de análises</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhuma análise realizada ainda.</p>
      ) : (
        <ul className="flex max-h-[520px] flex-col gap-2 overflow-y-auto">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => onSelect(entry.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedId === entry.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-800 bg-[#060913] hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-slate-200">{entry.musicName}</span>
                  <span className="whitespace-nowrap text-xs font-semibold text-slate-400">{entry.score}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <ClassificationBadge classification={entry.classification} />
                  <span className="text-xs text-slate-500">
                    {new Date(entry.timestamp).toLocaleString("pt-BR")}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
