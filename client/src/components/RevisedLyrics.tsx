import { useState } from "react";

export default function RevisedLyrics({ lyrics }: { lyrics: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#090d17] p-4 shadow-[0_14px_42px_rgba(0,0,0,0.22)]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Letra revisada (versão sugerida)</h3>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-slate-700 bg-[#060913] px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-900"
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{lyrics}</pre>
    </div>
  );
}
