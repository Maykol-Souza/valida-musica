import type { ReviewResult } from "../types/review";
import ClassificationBadge from "./ClassificationBadge";
import ScoreGauge from "./ScoreGauge";
import ProblemCard from "./ProblemCard";
import RevisedLyrics from "./RevisedLyrics";

export default function ResultView({ result }: { result: ReviewResult }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#090d17] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{result.musicName}</h2>
          <div className="mt-2">
            <ClassificationBadge classification={result.classification} />
          </div>
        </div>
        <ScoreGauge score={result.score} />
      </div>

      <div className="rounded-xl border border-slate-800/90 bg-[#090d17] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.24)]">
        <h3 className="mb-1 text-sm font-semibold text-slate-200">Resumo da análise</h3>
        <p className="text-sm text-slate-400">{result.summary}</p>
      </div>

      {result.categoriesIdentified.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.categoriesIdentified.map((category) => (
            <span key={category} className="rounded-full border border-slate-800 bg-[#090d17] px-3 py-1 text-xs font-medium text-slate-300">
              {category}
            </span>
          ))}
        </div>
      )}

      {result.problems.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-200">
            Problemas encontrados ({result.problems.length})
          </h3>
          {result.problems.map((problem, index) => (
            <ProblemCard key={index} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-green-700 bg-green-500/10 p-4 text-sm text-green-300">
          Nenhum problema relevante foi identificado nesta letra.
        </div>
      )}

      {result.revisedLyrics && <RevisedLyrics lyrics={result.revisedLyrics} />}

      <div className="rounded-xl border border-indigo-800 bg-indigo-500/10 p-5">
        <h3 className="mb-1 text-sm font-semibold text-indigo-200">Recomendação final</h3>
        <p className="text-sm text-indigo-300">{result.finalRecommendation}</p>
      </div>

      <p className="text-xs text-slate-500">{result.disclaimer}</p>
    </div>
  );
}
