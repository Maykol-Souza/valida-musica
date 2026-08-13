import { useState } from "react";

export default function RevisedLyrics({ lyrics }: { lyrics: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Letra revisada (versão sugerida)</h3>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{lyrics}</pre>
    </div>
  );
}
