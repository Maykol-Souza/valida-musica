import type { HistorySummary } from "../types/review";
import ClassificationBadge from "./ClassificationBadge";

interface HistoryPanelProps {
  entries: HistorySummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function HistoryPanel({ entries, selectedId, onSelect }: HistoryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Histórico de análises</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">Nenhuma análise realizada ainda.</p>
      ) : (
        <ul className="flex max-h-[520px] flex-col gap-2 overflow-y-auto">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => onSelect(entry.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedId === entry.id
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-slate-800">{entry.musicName}</span>
                  <span className="whitespace-nowrap text-xs font-semibold text-slate-500">{entry.score}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <ClassificationBadge classification={entry.classification} />
                  <span className="text-xs text-slate-400">
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
