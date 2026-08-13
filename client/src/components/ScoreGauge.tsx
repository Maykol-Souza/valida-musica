function colorFor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 70) return "text-lime-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

export default function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className={`text-4xl font-bold ${colorFor(score)}`}>{score}</span>
      <span className="text-xs text-slate-500">/ 100</span>
    </div>
  );
}
