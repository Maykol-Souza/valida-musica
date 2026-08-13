import { useEffect, useState } from "react";
import type { HistorySummary, ReviewResult } from "./types/review";
import { analyzeMusic, fetchHistory, fetchHistoryEntry, transcribeAudio } from "./services/api";
import LyricsForm from "./components/LyricsForm";
import LoadingState from "./components/LoadingState";
import ErrorBanner from "./components/ErrorBanner";
import ResultView from "./components/ResultView";
import HistoryPanel from "./components/HistoryPanel";

export default function App() {
  const [musicName, setMusicName] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistorySummary[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  async function refreshHistory() {
    try {
      const entries = await fetchHistory();
      setHistory(entries);
    } catch {
      // histórico é secundário; falha ao carregar não deve travar a tela principal
    }
  }

  useEffect(() => {
    refreshHistory();
  }, []);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeMusic(musicName, lyrics);
      setResult(response.result);
      setSelectedId(response.id);
      await refreshHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao analisar a música.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTranscribeAudio(file: File): Promise<boolean> {
    setTranscribing(true);
    setTranscribeError(null);
    try {
      const { lyrics: transcribed } = await transcribeAudio(file);
      setLyrics(transcribed);
      return true;
    } catch (err) {
      setTranscribeError(err instanceof Error ? err.message : "Erro inesperado ao transcrever o áudio.");
      return false;
    } finally {
      setTranscribing(false);
    }
  }

  async function handleSelectHistory(id: string) {
    setError(null);
    try {
      const entry = await fetchHistoryEntry(id);
      setResult(entry.result);
      setSelectedId(entry.id);
      setMusicName(entry.musicName);
      setLyrics(entry.lyrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar esta análise.");
    }
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100">
      <header className="border-b border-slate-800/80 bg-[#080b14]/95 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-xl font-bold text-slate-50">Revisor Musical Infantil</h1>
          <p className="text-sm text-slate-400">
            Analise letras de música com IA e avalie a adequação para o público infantil.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-5">
          <LyricsForm
            musicName={musicName}
            lyrics={lyrics}
            loading={loading}
            onMusicNameChange={setMusicName}
            onLyricsChange={setLyrics}
            onSubmit={handleAnalyze}
            transcribing={transcribing}
            transcribeError={transcribeError}
            onTranscribeAudio={handleTranscribeAudio}
          />

          {error && <ErrorBanner message={error} onRetry={handleAnalyze} />}
          {loading && <LoadingState />}
          {!loading && result && <ResultView result={result} />}
        </section>

        <aside>
          <HistoryPanel entries={history} selectedId={selectedId} onSelect={handleSelectHistory} />
        </aside>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
        A classificação gerada pela IA é uma ferramenta de apoio à revisão humana, não uma garantia
        absoluta de adequação do conteúdo para crianças.
      </footer>
    </div>
  );
}
