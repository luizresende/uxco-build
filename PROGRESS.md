# UXCO Build Progress

> Estado operacional do desenvolvimento entre sessões. Não substitui Git, GitHub Issues, `CHANGELOG.md` ou memória de projeto — o protocolo que mantém este arquivo em sincronia está em `docs/constitution/harness.md`.

## Current Status

- Sprint 0 (fundação + smoke test Paper MCP): complete
- Sprint 1 (constituição + standards + templates de memória): complete
- Sprint 2 (Context Engine): complete
- Sprint 3 (Critique Engine): complete
- Sprint 4 (Review Workflow — `/uxco-review`): complete
- Harness foundation (Instructions/Tools/Environment/State/Feedback): complete — merge em `main` pelo PR #5 (commit `91f676c`)
- Sprint 5 (Adversarial Quality Engine): complete — merge em `main` pelo PR #6 (commit `21bec71`)
- Refactor lean-harness, passos 1–2: **nesta branch** `refactor/lean-harness`. Baseline congelado e constituição enxuta. A cadeia de STEPs (passo 3) ainda não existe. Sem pull request — o refactor inteiro fecha num PR só, no fim.

## Working Now

Passos 1 e 2 do refactor para uma constituição curta e contexto sob demanda. O `/uxco-review` continua o workflow atual; o que mudou é o que está sempre carregado.

- Baseline do corpus anterior ao split: `benchmarks/harness-refactor/baseline.md`, gerado por `scripts/measure-context.mjs` no commit `21bec71` (teto eager: 20 arquivos, 33856 palavras, ~58774 tokens pela heurística bytes/4). Tokens consumidos, latência e qualidade de saída estão `UNKNOWN` de propósito.
- `CLAUDE.md` guarda taxonomia, gaps, segurança de ação, quatro anti-patterns e o contrato mínimo de saída. O resto está em `docs/constitution/`; o mapa de STEP → arquivo é `docs/constitution/INDEX.md`, inclusive os julgamentos em aberto para o dono.
- Julgamentos que precisam de confirmação antes do passo 3: estão na seção homônima do índice. Nenhum deles foi tratado como decisão fechada.

O pipeline do review, desde a Sprint 5, segue com 11 STEPs (a interface pública não mudou):

```text
STEP 4–5   Initial Analysis + Consolidation      INITIAL_ANALYSIS
STEP 6     Adversarial Critique (Design Critic)  ADVERSARIAL_REVIEW
STEP 7     Revision — um diagnóstico só          REVISION
STEP 8     Review QA (Design QA)                 FINAL_QA
STEP 9–10  Quality Gate do design + Report
```

Construído:

- `standards/adversarial-quality.md` — contratos: Adversarial Critique Record (6 seções, entrada de 5 campos, 4 vereditos), Review QA Record (7 dimensões, escala `PASS/PARTIAL/FAIL/UNKNOWN`, sem score composto), marcadores de estágio e o invariante de ciclo único.
- `agents/` — **primeira camada de agents do repositório**: `design-critic.md` (10 eixos de desafio, 10 sondas adversariais, 4 vereditos) e `design-qa.md` (auditoria do review, não do design).
- `workflows/uxco-review.md` — seção `## Adversarial Quality Engine`, STEPs 6–8, pipeline canônico de 17 estágios, Failure Handling 7–8, Failure Conditions 9–13.
- `standards/critique-framework.md` + `templates/reports/design-review.md` — seção `## Review Assurance` no contrato oficial do report (compacta; os records acompanham, nunca entram nas Issues).
- `examples/adversarial-tests/01-flawed-initial-analysis/` — diagnóstico inicial deliberadamente falho sobre a fixture de design já existente (`examples/review-tests/02-pulse-new-item/`); nenhum design novo foi inventado.
- Testes: `tests/review-workflow/adversarial.test.mjs` (determinísticos) + `adversarial-scenarios.md` (ADV-A..ADV-G, AGENT EVALUATION). Suíte total: **96** (era 73).
- Avaliação: `benchmarks/review-workflow/adversarial-protocol.md` (ADV-001, BEFORE × AFTER) + `expectations/03-flawed-initial-analysis.md` + cenário RVW-005.

Decisões da Sprint 5, registradas quando a constituição ainda usava seção numerada:

- **Nenhuma regra global nova em `CLAUDE.md`.** "Autocriticar antes de concluir" era o princípio 11 (então §3.11; hoje em `docs/constitution/operating-principles.md`). A camada adversarial é a materialização dessa regra no review. O inventário, então §9.3, hoje está em `docs/constitution/knowledge-routing.md`.
- **O QA não usa a escala 1–5 do `quality-framework.md`.** Aquela escala ancora na severidade do pior achado do **design**; qualidade de **review** não tem essa âncora. Reusamos `PASS/PARTIAL/FAIL/UNKNOWN` dos harnesses e proibimos score composto — média de tokens de conduta seria falsa precisão.
- **`agents/` em vez de `skills/`** para Critic e QA: a camada já estava declarada na hierarquia (então §9; hoje `docs/constitution/knowledge-routing.md`), e o que define as duas é *responsabilidade acoplada a um estágio*, não capacidade de uso livre.
- **Ciclo único como invariante**, não configuração: 1 crítica, 1 revisão, 1 QA. QA reprovando declara o blocker, não reprocessa.

## Completed

- Context Engine: `skills/product-context/`, `scripts/context-loader.mjs` (`npm run context:load`), `standards/product-context-brief.md`.
- Critique Engine: `skills/design-critique/`, `skills/interaction-design/`, `standards/critique-framework.md`.
- Adversarial Quality Engine: `agents/design-critic.md`, `agents/design-qa.md`, `standards/adversarial-quality.md`.
- Review Workflow: `workflows/uxco-review.md` + comando `/uxco-review` (`.claude/commands/uxco-review.md`), integralmente `READ`.
- Suíte de testes determinísticos: 96 testes em `tests/context-engine/`, `tests/critique-engine/`, `tests/review-workflow/` (`npm test`).
- Machine Preflight (`scripts/preflight.mjs`): Node, Git, Claude Code, GitHub CLI, repositório/branch, arquivos essenciais, diagnóstico do endpoint Paper MCP.

## Blocked

None.

## Known Issues

- Paper MCP endpoint não está respondendo neste ambiente (`ECONNREFUSED` em `npm run preflight`) — esperado quando o Paper Desktop não está aberto; não bloqueia trabalho local. Ver `.mcp/README.md`.
- **Nenhuma execução de AGENT EVALUATION registrada para o review workflow:** `benchmarks/review-workflow/results/` segue vazio. RVW-001..005, INT-A..F, SCP-001..006, ADV-A..G, DIF-001 e ADV-001 estão definidos e **não executados**. Consequência: não existe baseline de qualidade medido — nem antes, nem depois da Sprint 5.
- Cenários de fundação (`tests/foundation/scenarios.md`) não re-executados desde a Sprint 1. A constituição mudou de novo neste refactor (o sempre-carregado encolheu; o texto foi para `docs/constitution/`). As citações dos cenários foram atualizadas; a execução continua por fazer.
- `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa` e `/uxco-status` ainda não existem (previsto, não é bug). A camada de QA desta sprint é um **estágio interno** do review; um futuro `/uxco-design-qa` poderá rotear para `agents/design-qa.md` sem retrabalho.

## Next

- Passo 3 do refactor, na mesma branch, sem abrir PR até o refactor fechar: a cadeia que carrega, por STEP, só a linha correspondente de `docs/constitution/INDEX.md`. Antes disso, o dono responde os julgamentos em aberto do índice — em especial se as regras do Paper e os princípios 1, 6, 7 e 11 voltam para o sempre-carregado.
- **Executar ADV-001** (`benchmarks/review-workflow/adversarial-protocol.md`): BEFORE × AFTER sobre a mesma fixture. É o que decide se a camada adversarial fica, simplifica ou sai — hoje o ganho é arquitetural, não medido. `NOT SUPPORTED` é resultado aceitável e valioso. Tokens e latência dessa sessão entram na folha vazia de `benchmarks/harness-refactor/baseline.md`, copiados da UI, nunca estimados a partir do `tokens aprox.`.
- Executar RVW-002, RVW-004 e RVW-005 (e DIF-001) quando houver Claude Code, registrando em `benchmarks/review-workflow/results/` pelos protocolos que já existem.
- `npm test` neste ambiente usa Node 22 (`.nvmrc`); o glob entre aspas do script `test` não expande no Node 20.

## Last Handoff

- **Data:** 2026-11-04
- **Branch:** `refactor/lean-harness` (a partir de `main` em `21bec71`). Commits: medição do corpus; constituição enxuta. Sem pull request.
- **Trabalho realizado:** baseline reproduzível do que o `/uxco-review` carrega, e `CLAUDE.md` reduzido ao que tem de estar sempre no contexto. O texto que saiu está em `docs/constitution/`, com índice por STEP. Referências de workflow, skills, agents, standards e testes apontam para os novos caminhos.
- **Verificações:** `npm test` no Node v22.23.4 (`.nvmrc`): 96/96. O glob entre aspas do script `test` é o que falha no Node 20; aqui não foi preciso expandir. `npm run preflight` neste ambiente: FAIL porque a CLI `claude` não está no PATH (REQUIRED, instalação manual — não foi instalada); Paper MCP em WARN (`ECONNREFUSED`), esperado sem o Paper Desktop. `npm run verify` não fecha verde por causa do `claude` ausente, não por regressão dos testes.
- **Próximo passo recomendado:** ler os julgamentos em aberto em `docs/constitution/INDEX.md` e só então desenhar a cadeia do passo 3.
