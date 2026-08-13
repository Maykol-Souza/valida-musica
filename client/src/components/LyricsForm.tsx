import { FormEvent } from "react";

interface LyricsFormProps {
  musicName: string;
  lyrics: string;
  loading: boolean;
  onMusicNameChange: (value: string) => void;
  onLyricsChange: (value: string) => void;
  onSubmit: () => void;
}

export default function LyricsForm({
  musicName,
  lyrics,
  loading,
  onMusicNameChange,
  onLyricsChange,
  onSubmit,
}: LyricsFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="musicName" className="mb-1 block text-sm font-medium text-slate-700">
          Nome da música (opcional)
        </label>
        <input
          id="musicName"
          type="text"
          value={musicName}
          onChange={(e) => onMusicNameChange(e.target.value)}
          placeholder="Ex.: Borboletinha"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="lyrics" className="mb-1 block text-sm font-medium text-slate-700">
          Letra da música
        </label>
        <textarea
          id="lyrics"
          value={lyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
          rows={12}
          placeholder="Cole aqui a letra da música a ser analisada..."
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || lyrics.trim().length === 0}
        className="self-end rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "Analisando..." : "Analisar música"}
      </button>
    </form>
  );
}
