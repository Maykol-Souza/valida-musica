export default function LoadingState({ message = "Analisando a letra com o Gemini..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-800/90 bg-[#090d17] p-10 text-slate-400">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
