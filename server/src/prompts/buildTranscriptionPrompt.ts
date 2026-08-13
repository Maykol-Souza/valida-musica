export const NO_LYRICS_MARKER = "[SEM_LETRA_IDENTIFICADA]";

export const TRANSCRIPTION_PROMPT = `Transcreva integralmente a letra cantada neste áudio.

Regras:
- Retorne apenas o texto da letra, organizado em linhas/versos como em uma letra de música.
- Não inclua numeração, comentários, títulos ou qualquer texto além da própria letra.
- Ignore trechos puramente instrumentais, sem voz.
- Se não for possível identificar nenhuma letra cantada no áudio, responda exatamente: ${NO_LYRICS_MARKER}`;
