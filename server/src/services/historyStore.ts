import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { HistoryEntry, HistorySummary, ReviewResult } from "../types/review.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");
const historyFile = path.join(dataDir, "history.json");

async function readHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await readFile(historyFile, "utf-8");
    return JSON.parse(raw) as HistoryEntry[];
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeHistory(entries: HistoryEntry[]): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(historyFile, JSON.stringify(entries, null, 2), "utf-8");
}

export async function appendHistory(musicName: string, lyrics: string, result: ReviewResult): Promise<HistoryEntry> {
  const entries = await readHistory();
  const entry: HistoryEntry = {
    id: randomUUID(),
    musicName,
    lyrics,
    timestamp: new Date().toISOString(),
    result,
  };
  entries.push(entry);
  await writeHistory(entries);
  return entry;
}

export async function listHistory(): Promise<HistorySummary[]> {
  const entries = await readHistory();
  return entries
    .map((e) => ({
      id: e.id,
      musicName: e.musicName,
      timestamp: e.timestamp,
      classification: e.result.classification,
      score: e.result.score,
    }))
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export async function getHistoryById(id: string): Promise<HistoryEntry | undefined> {
  const entries = await readHistory();
  return entries.find((e) => e.id === id);
}
