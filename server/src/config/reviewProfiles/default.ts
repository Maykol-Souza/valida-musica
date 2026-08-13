export interface ReviewCategory {
  id: string;
  label: string;
  description: string;
}

export interface ScoreBand {
  min: number;
  max: number;
  label: string;
}

export interface ReviewProfile {
  id: string;
  name: string;
  tone: string;
  categories: ReviewCategory[];
  scoreBands: ScoreBand[];
  classificationGuidance: string;
}

export const defaultReviewProfile: ReviewProfile = {
  id: "infantil-padrao",
  name: "Revisor Musical para Conteúdo Infantil",
  tone:
    "A análise deve ser contextual e conservadora, considerando que o conteúdo será destinado a crianças. " +
    "Avalie sempre palavra + contexto + significado do trecho + contexto geral da música + público infantil. " +
    "Não reprove uma música apenas porque uma palavra sensível aparece nela — analise a intenção e o contexto " +
    "(ex.: 'morte' pode ser educativa, histórica ou metafórica). Evite falsos positivos sempre que possível, " +
    "mas em caso de dúvida real, classifique como ATENCAO para permitir revisão humana, nunca finja certeza.",
  categories: [
    { id: "violencia", label: "Violência", description: "Violência física ou descrição de agressão." },
    { id: "morte", label: "Morte", description: "Morte ou referências explícitas e não contextualizadas à morte." },
    { id: "sangue_ferimentos", label: "Sangue ou ferimentos", description: "Descrição explícita de sangue ou lesões." },
    { id: "linguagem_ofensiva", label: "Palavrões ou linguagem ofensiva", description: "Baixo calão, palavrões, linguagem ofensiva." },
    { id: "conteudo_sexual", label: "Conteúdo sexual ou sugestivo", description: "Referências sexuais explícitas ou sugestivas." },
    { id: "drogas", label: "Drogas", description: "Consumo ou incentivo ao uso de drogas ilícitas." },
    { id: "alcool", label: "Álcool", description: "Incentivo ao consumo de bebidas alcoólicas." },
    { id: "armas", label: "Armas", description: "Armas ou incentivo à violência armada." },
    { id: "crime", label: "Conteúdo criminoso", description: "Referências a atividades criminosas." },
    { id: "ameacas_agressao", label: "Insultos, ameaças ou agressão verbal", description: "Linguagem agressiva, ameaças ou insultos." },
    { id: "terror", label: "Terror", description: "Conteúdo de terror ou excessivamente assustador para crianças." },
    { id: "temas_adultos", label: "Temas adultos", description: "Temas adultos não apropriados para o público infantil." },
    { id: "outros", label: "Outros", description: "Qualquer outro conteúdo que, pelo contexto, seja inadequado para o público infantil." },
  ],
  scoreBands: [
    { min: 90, max: 100, label: "Excelente para público infantil" },
    { min: 70, max: 89, label: "Adequado, com pequenos pontos a revisar" },
    { min: 40, max: 69, label: "Necessita revisão" },
    { min: 0, max: 39, label: "Inadequado para público infantil" },
  ],
  classificationGuidance:
    "APROVADA: nenhum conteúdo relevante identificado que impeça o uso infantil. " +
    "ATENCAO: há trecho(s) que merecem revisão humana ou que admitem mais de uma interpretação dependendo do contexto. " +
    "REPROVADA: foram identificados conteúdos claramente inadequados para o público infantil.",
};
