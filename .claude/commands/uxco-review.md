---
description: Review formal de design — cadeia de fases em workflows/review/manifest.json, validada por scripts/chain.mjs
argument-hint: [alvo — nome de fluxo/tela/frame (ex.: checkout), caminho de arquivo, ou vazio para resolver pela seleção/contexto]
---

Execute o **UXCO Review** como cadeia. A fonte executável é `workflows/review/manifest.json`. O mapa dos 17 estágios e as regras transversais estão em `workflows/uxco-review.md`. Você é o orquestrador: não critique o design nesta conversa.

Alvo: $ARGUMENTS

Formas de invocação:

```text
/uxco-review                                       escopo pela seleção ativa do Paper ou pelo contexto da sessão
/uxco-review checkout                              alvo nomeado — o referente se resolve contra canvas, arquivos e conversa
/uxco-review examples/review-tests/02-pulse-new-item/fixture.md
"faça o review formal do fluxo de checkout"        pedido contextual — se não estiver óbvio que isto é o review, leia docs/constitution/knowledge-routing.md antes de começar
```

O argumento aceita caminho ou nome. Nome é intenção explícita; o referente ainda se resolve nas fontes da sessão. Várias correspondências plausíveis viram ambiguidade. Nenhuma correspondência pede a fonte.

## Como correr

1. Leia o manifesto. Não leia prompt de fase, standard, skill ou agente por conta própria. `CLAUDE.md` já está no contexto.
2. Crie um diretório em `.review-runs/` para esta run.
3. Para cada passo, na ordem do manifesto:
   - `inspect` com `needsCanvas: false`: grave você mesmo o `inspect.json` skipped (`paperReady` e `snapshot` nulos, sem mensagem de bloqueio) e valide. Não chame o subagente e não abra arquivo de canvas.
   - Nos demais, chame o subagente `review-step` (`.claude/agents/review-step.md`) com o id da fase, o prompt, a lista exata de contexto (vazia, se o passo não declara arquivo) e os artefatos de entrada. Não acrescente standard, skill ou agente que o manifesto não listou.
   - Rode `node scripts/chain.mjs validate --step <id> --artifact <saída> --prior <id>=<arquivo> ...`.
   - Saída 2: pare. Se houver `blockedMessage`, mostre esse texto ao usuário, sem paráfrase, e a ação `npm run preflight`. Não chame a fase seguinte.
   - Saída 1: pare e mostre o erro. Não rode a fase de novo. Challenge e close não têm segunda passada.
   - Saída 0: próximo passo.
4. Entregue o `report.md` da fase `close`. O JSON fica na run; não cole os records dentro das Issues.

O review inteiro é `READ`. Canvas só é tocado pela fase `inspect`, que carrega `docs/constitution/canvas-safety.md` pela lista do manifesto.

Fases, nesta ordem: `scope`, `inspect`, `ground`, `analyze`, `challenge`, `close`.
