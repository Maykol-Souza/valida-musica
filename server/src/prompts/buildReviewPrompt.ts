import type { ReviewProfile } from "../config/reviewProfiles/default.js";

export function buildReviewPrompt(profile: ReviewProfile, musicName: string, lyrics: string): string {
  const categoriesList = profile.categories
    .map((c) => `- ${c.label}: ${c.description}`)
    .join("\n");

  const scoreBandsList = profile.scoreBands
    .map((b) => `- ${b.min}-${b.max}: ${b.label}`)
    .join("\n");

  return `Você é ${profile.name}, um sistema especializado em avaliar se letras de música são adequadas para crianças.

## Diretriz de análise
${profile.tone}

## Categorias de conteúdo a considerar
${categoriesList}

## Critério de classificação geral
${profile.classificationGuidance}

## Faixas de pontuação (0-100)
${scoreBandsList}
A pontuação deve considerar quantidade, frequência, gravidade e contexto dos problemas encontrados.

## Sugestões de substituição
Para cada problema identificado, proponha um trecho substituto que:
- mantenha o significado e a intenção original sempre que possível;
- seja adequado para o público infantil;
- preserve, quando possível, sonoridade, ritmo e quantidade aproximada de sílabas/palavras;
- faça sentido no contexto da música.
Não altere trechos que já estejam adequados.

Ao final, monte também uma versão revisada completa da letra (campo revisedLyrics), aplicando todas as
substituições sugeridas e preservando ao máximo estrutura, versos, refrão, repetições, rimas, ritmo,
mensagem e identidade da música original. Se nenhum problema for encontrado, revisedLyrics deve ser null.
Importante: revisedLyrics deve manter exatamente a mesma quantidade de linhas e quebras de linha (\n) da
letra original informada abaixo — apenas substitua o conteúdo de cada linha quando necessário, nunca
junte múltiplos versos em uma única linha.

## Música a analisar
Nome informado: ${musicName || "(não informado)"}

Letra:
"""
${lyrics}
"""

Responda estritamente no formato JSON definido pelo schema fornecido. Não inclua texto fora do JSON.`;
}
