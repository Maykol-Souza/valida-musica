# Revisor Musical Infantil

Ambiente integrado ao Gemini para analisar letras de música e avaliar sua adequação
para o público infantil.

## Estrutura

- `server/` — API Node/Express. Toda a lógica de análise (prompt, integração com o
  Gemini, critérios de classificação, histórico) fica isolada aqui, separada da UI.
- `client/` — Frontend React + Vite + Tailwind CSS.

## Configuração inicial

1. Crie o arquivo `server/.env` com base em `server/.env.example`:

   ```
   GEMINI_API_KEY=sua_chave_aqui
   GEMINI_MODEL=gemini-2.5-flash
   PORT=4000
   ```

2. Instale as dependências:

   ```bash
   npm run install:all
   ```

3. Rode o projeto (backend + frontend juntos):

   ```bash
   npm run dev
   ```

   O frontend abre em `http://localhost:5173` (proxy automático para a API em
   `http://localhost:4000`).

## Como evoluir o sistema

- **Trocar o modelo do Gemini**: altere `GEMINI_MODEL` no `.env`.
- **Alterar o prompt de análise**: edite `server/src/prompts/buildReviewPrompt.ts`.
- **Adicionar/alterar categorias e critérios de classificação**: edite
  `server/src/config/reviewProfiles/default.ts`.
- **Criar novos perfis de revisão** (ex.: para outra faixa etária): crie um novo
  arquivo em `server/src/config/reviewProfiles/`, seguindo a interface
  `ReviewProfile`, e passe-o para `reviewMusic` (hoje fixado no perfil padrão em
  `musicReviewService.ts`).
- **Histórico**: fica em `server/data/history.json`, criado automaticamente. Cada
  análise gera uma nova entrada — reanalisar uma música após editar a letra é só
  enviar o formulário novamente.

## Deploy (frontend na Netlify, backend no Render)

Pré-requisito: o código precisa estar em um repositório Git (GitHub, GitLab ou
Bitbucket) — os dois serviços fazem deploy contínuo a partir dele.

### Backend no Render

1. New > Web Service > conecte o repositório.
2. **Root Directory**: `server`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Plan**: Free
6. Em "Environment", adicione as variáveis:
   - `GEMINI_API_KEY` = sua chave (não commitada, cadastrada só no dashboard)
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - (não é preciso setar `PORT` — o Render injeta a própria)
7. Deploy. A URL final será algo como `https://revisor-musical-server.onrender.com`.

Também existe um `render.yaml` na raiz do projeto (Blueprint) com essa mesma
configuração, se preferir criar via "New > Blueprint" em vez de preencher manualmente.

**Limitação do plano free do Render**: não há disco persistente — o arquivo
`server/data/history.json` sobrevive enquanto a instância está ativa, mas é
resetado a cada novo deploy e a cada vez que a instância "dorme" por inatividade
e sobe de novo. Para manter o histórico entre reinícios seria necessário migrar
para um banco de dados externo (ex.: Postgres do próprio Render, que tem plano
free separado) — hoje isso não está implementado.

### Frontend na Netlify

1. New site from Git > conecte o mesmo repositório.
2. **Base directory**: `client`
3. **Build command**: `npm run build`
4. **Publish directory**: `dist`

Essas configurações já estão no `netlify.toml` na raiz do projeto, então a Netlify
detecta tudo automaticamente.

5. Depois que o backend estiver no ar, edite o `netlify.toml` e troque
   `https://SEU-BACKEND.onrender.com` pela URL real do serviço no Render, e
   redeploy a Netlify. Esse redirect faz o browser continuar chamando `/api/...`
   (mesma origem do site), e a Netlify repassa a chamada para o Render nos
   bastidores — sem precisar mudar nada no código do frontend e sem problema de
   CORS.

## Observação

A classificação da IA é uma ferramenta de apoio à revisão humana, não uma garantia
absoluta de que o conteúdo é apropriado para crianças.
