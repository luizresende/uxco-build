# UXCO Build Progress

> Estado operacional do desenvolvimento entre sessões. Não substitui Git, GitHub Issues, `CHANGELOG.md` ou memória de projeto — ver `CLAUDE.md` §11 para o protocolo que mantém este arquivo em sincronia.

## Current Status

- Sprint 0 (fundação + smoke test Paper MCP): complete
- Sprint 1 (constituição + standards + templates de memória): complete
- Sprint 2 (Context Engine): complete
- Sprint 3 (Critique Engine): complete
- Sprint 4 (Review Workflow — `/uxco-review`): complete
- Harness foundation (Instructions/Tools/Environment/State/Feedback): complete — merge em `main` pelo PR #5 (commit `91f676c`)
- Sprint 5 (Adversarial Quality Engine): **implementada, sem commit** — branch `sprint-5-adversarial-quality`

## Working Now

Sprint 5 — o UXCO Build passou a desafiar o próprio diagnóstico antes de apresentá-lo. O pipeline do `/uxco-review` foi de 8 para 11 STEPs, com três estágios novos **dentro** do workflow (a interface pública não mudou):

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

Decisões relevantes desta sprint:

- **Nenhuma regra global nova em `CLAUDE.md`.** "Autocriticar antes de concluir" já é §3.11; a camada adversarial é a materialização dessa regra no review, e detalhe de módulo não sobe para a constituição. Só o inventário da §9.3 foi atualizado.
- **O QA não usa a escala 1–5 do `quality-framework.md`.** Aquela escala ancora na severidade do pior achado do **design**; qualidade de **review** não tem essa âncora. Reusamos `PASS/PARTIAL/FAIL/UNKNOWN` dos harnesses e proibimos score composto — média de tokens de conduta seria falsa precisão.
- **`agents/` em vez de `skills/`** para Critic e QA: a camada já estava declarada na hierarquia da §9, e o que define as duas é *responsabilidade acoplada a um estágio*, não capacidade de uso livre.
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
- Cenários de fundação (`tests/foundation/scenarios.md`) não re-executados desde a Sprint 1, embora a constituição tenha mudado desde então (§11, §9.3).
- `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa` e `/uxco-status` ainda não existem (previsto, não é bug). A camada de QA desta sprint é um **estágio interno** do review; um futuro `/uxco-design-qa` poderá rotear para `agents/design-qa.md` sem retrabalho.

## Next

- **Executar ADV-001** (`benchmarks/review-workflow/adversarial-protocol.md`): BEFORE × AFTER sobre a mesma fixture. É o que decide se a camada adversarial fica, simplifica ou sai — hoje o ganho é arquitetural, não medido. `NOT SUPPORTED` é resultado aceitável e valioso.
- Executar RVW-005 e os cenários ADV-A..ADV-G (sessão nova por cenário), registrando em `benchmarks/review-workflow/results/`.
- Rodar `npm run verify` ao final de sessões que alterem o repositório (ver `CLAUDE.md` §11).

## Last Handoff

- **Data:** 2026-10-02
- **Branch:** `sprint-5-adversarial-quality` (criada de `main` em `119b452`; **nenhum commit feito** — working tree com as mudanças da sprint)
- **Trabalho realizado:** Sprint 5 completa — Adversarial Quality Engine (Critic + Revision + QA) integrado ao `/uxco-review` sem alterar a interface pública; 23 testes determinísticos novos; harness comparativo preparado e não executado.
- **Verificações executadas:** `npm run preflight` (READY, 1 aviso — Paper offline), `npm test` (96/96), `npm run verify`, `git diff --check`.
- **Próximo passo recomendado:** revisar o diff, decidir sobre commit/PR e então executar ADV-001 — a sprint entrega a capacidade; a evidência de que ela melhora o resultado ainda depende de execução manual.
