import type { ReviewProblem } from "../types/review";

const SEVERITY_STYLES: Record<ReviewProblem["severity"], string> = {
  Baixa: "bg-slate-100 text-slate-700 border-slate-300",
  Média: "bg-amber-100 text-amber-800 border-amber-300",
  Alta: "bg-red-100 text-red-800 border-red-300",
};

export default function ProblemCard({ problem }: { problem: ReviewProblem }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
          {problem.category}
        </span>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[problem.severity]}`}>
          Gravidade: {problem.severity}
        </span>
        {problem.term && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            "{problem.term}"
          </span>
        )}
      </div>

      <blockquote className="mb-2 border-l-4 border-slate-200 pl-3 text-sm italic text-slate-700">
        "{problem.excerpt}"
      </blockquote>

      <p className="mb-3 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Motivo: </span>
        {problem.reason}
      </p>

      {problem.suggestion && (
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-sm text-green-900">
            <span className="font-medium">Sugestão: </span>"{problem.suggestion}"
          </p>
          {problem.suggestionRationale && (
            <p className="mt-1 text-xs text-green-800">{problem.suggestionRationale}</p>
          )}
        </div>
      )}
    </div>
  );
}
