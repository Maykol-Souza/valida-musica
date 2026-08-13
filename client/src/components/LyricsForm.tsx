import { ChangeEvent, FormEvent, useState } from "react";

const MAX_AUDIO_SIZE_BYTES = 20 * 1024 * 1024;

interface LyricsFormProps {
  musicName: string;
  lyrics: string;
  loading: boolean;
  onMusicNameChange: (value: string) => void;
  onLyricsChange: (value: string) => void;
  onSubmit: () => void;
  transcribing: boolean;
  transcribeError: string | null;
  onTranscribeAudio: (file: File) => Promise<boolean>;
}

export default function LyricsForm({
  musicName,
  lyrics,
  loading,
  onMusicNameChange,
  onLyricsChange,
  onSubmit,
  transcribing,
  transcribeError,
  onTranscribeAudio,
}: LyricsFormProps) {
  const [inputMode, setInputMode] = useState<"text" | "audio">("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFileError(null);
    if (file && file.size > MAX_AUDIO_SIZE_BYTES) {
      setFileError("Arquivo muito grande. O limite é 20MB.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  }

  async function handleTranscribeClick() {
    if (!selectedFile) return;
    const success = await onTranscribeAudio(selectedFile);
    if (success) {
      setSelectedFile(null);
      setInputMode("text");
    }
  }

  const busy = loading || transcribing;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-slate-800/90 bg-[#090d17] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.32)]"
    >
      <div>
        <label htmlFor="musicName" className="mb-1 block text-sm font-medium text-slate-300">
          Nome da música (opcional)
        </label>
        <input
          id="musicName"
          type="text"
          value={musicName}
          onChange={(e) => onMusicNameChange(e.target.value)}
          placeholder="Ex.: Borboletinha"
          className="w-full rounded-lg border border-slate-700 bg-[#060913] px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-800 bg-[#05070d] p-1">
        <button
          type="button"
          onClick={() => setInputMode("text")}
          disabled={busy}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            inputMode === "text"
              ? "bg-indigo-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.28)]"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          Colar letra
        </button>
        <button
          type="button"
          onClick={() => setInputMode("audio")}
          disabled={busy}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            inputMode === "audio"
              ? "bg-indigo-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.28)]"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          Enviar áudio
        </button>
      </div>

      {inputMode === "text" ? (
        <div>
          <label htmlFor="lyrics" className="mb-1 block text-sm font-medium text-slate-300">
            Letra da música
          </label>
          <textarea
            id="lyrics"
            value={lyrics}
            onChange={(e) => onLyricsChange(e.target.value)}
            rows={12}
            placeholder="Cole aqui a letra da música a ser analisada..."
            className="w-full resize-y rounded-lg border border-slate-700 bg-[#060913] px-3 py-2 text-sm font-mono text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-indigo-500/40 bg-[#060913] p-4">
          <label htmlFor="audioFile" className="text-sm font-medium text-slate-300">
            Arquivo de áudio (mp3, wav, m4a, ogg - até 20MB)
          </label>
          <input
            id="audioFile"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={busy}
            className="text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-200 hover:file:bg-slate-700"
          />

          {selectedFile && (
            <p className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400">
              Selecionado: <span className="text-slate-200">{selectedFile.name}</span>
            </p>
          )}

          {fileError && <p className="text-sm text-red-400">{fileError}</p>}
          {transcribeError && <p className="text-sm text-red-400">{transcribeError}</p>}

          <button
            type="button"
            onClick={handleTranscribeClick}
            disabled={!selectedFile || busy}
            className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {transcribing ? "Transcrevendo áudio..." : "Transcrever letra"}
          </button>

          {lyrics && !transcribing && (
            <p className="text-xs text-slate-500">
              Letra transcrita disponível na aba "Colar letra". Revise antes de analisar.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={busy || lyrics.trim().length === 0}
        className="self-end rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {loading ? "Analisando..." : "Analisar música"}
      </button>
    </form>
  );
}
