export default function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="whitespace-nowrap rounded-lg border border-red-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-950/60"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
