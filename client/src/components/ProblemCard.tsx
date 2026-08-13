import type { ReviewProblem } from "../types/review";

const SEVERITY_STYLES: Record<ReviewProblem["severity"], string> = {
  Baixa: "bg-slate-700/40 text-slate-300 border-slate-600",
  Média: "bg-amber-500/15 text-amber-300 border-amber-600/40",
  Alta: "bg-red-500/15 text-red-300 border-red-600/40",
};

export default function ProblemCard({ problem }: { problem: ReviewProblem }) {
  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#090d17] p-4 shadow-[0_14px_42px_rgba(0,0,0,0.22)]">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
          {problem.category}
        </span>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[problem.severity]}`}>
          Gravidade: {problem.severity}
        </span>
        {problem.term && (
          <span className="rounded-full border border-slate-800 bg-[#060913] px-2.5 py-0.5 text-xs font-medium text-slate-400">
            "{problem.term}"
          </span>
        )}
      </div>

      <blockquote className="mb-2 border-l-4 border-slate-700 pl-3 text-sm italic text-slate-300">
        "{problem.excerpt}"
      </blockquote>

      <p className="mb-3 text-sm text-slate-400">
        <span className="font-medium text-slate-200">Motivo: </span>
        {problem.reason}
      </p>

      {problem.suggestion && (
        <div className="rounded-lg bg-green-500/10 p-3">
          <p className="text-sm text-green-300">
            <span className="font-medium">Sugestão: </span>"{problem.suggestion}"
          </p>
          {problem.suggestionRationale && (
            <p className="mt-1 text-xs text-green-400/80">{problem.suggestionRationale}</p>
          )}
        </div>
      )}
    </div>
  );
}
