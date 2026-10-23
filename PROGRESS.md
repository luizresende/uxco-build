# UXCO Build Progress

> Estado operacional do desenvolvimento entre sessões. Não substitui Git, GitHub Issues, `CHANGELOG.md` ou memória de projeto — ver `CLAUDE.md` §11 para o protocolo que mantém este arquivo em sincronia.

## Current Status

- Sprint 0 (fundação + smoke test Paper MCP): complete
- Sprint 1 (constituição + standards + templates de memória): complete
- Sprint 2 (Context Engine): complete
- Sprint 3 (Critique Engine): complete
- Sprint 4 (Review Workflow — `/uxco-review`): complete
- Harness foundation (Instructions/Tools/Environment/State/Feedback): complete — PR #5 (`91f676c`)
- Sprint 5 (Adversarial Quality Engine): complete — merge em `main` pelo PR #6 (`21bec71`)
- Sprint 6 (Design Intelligence): **implementada, sem commit** — branch `sprint-6-design-intelligence`

## Working Now

Sprint 6 — as oito competências de Product Design do PRD, com seleção contextual e integração ao `/uxco-review`.

| Competência | Status | Onde |
| --- | --- | --- |
| Product Context | KEEP | `skills/product-context/` |
| Design Critique | IMPROVE — amplitude + consolidadora, mapa de profundidade | `skills/design-critique/` |
| Interaction Design | KEEP — fronteira com L4/L7 declarada | `skills/interaction-design/` |
| UX Writing | CREATE — L4 | `skills/ux-writing/` |
| Visual Hierarchy | CREATE — L5 | `skills/visual-hierarchy/` |
| Design Systems | CREATE — L6 + `System Action` | `skills/design-systems/` |
| Accessibility | CREATE — L7 + `A11y Status` | `skills/accessibility/` |
| Design QA | KEEP — segue agent do STEP 8; critérios de seleção e WCAG | `agents/design-qa.md` |

Construído:

- `standards/skill-routing.md` — registro, sinais, sete perfis canônicos, regras de seleção e a linha `Skills:` (registrada em `Review Assurance`).
- `/uxco-review`: seleção no STEP 4, consolidação estendida no STEP 5, pipeline canônico de 17 para 19 estágios; 11 STEPs, comando único e `READ` integral preservados.
- Testes: `tests/design-intelligence/skills.test.mjs` (18 determinísticos; suíte **114**) + `skill-scenarios.md` (24 cenários, 7 reutilizados; RT-A..D de routing).
- Avaliação: `examples/skill-tests/` (5 fixtures de design, com controles positivos, + 3 drafts para o QA), `benchmarks/design-intelligence/` (gabaritos, harness, protocolo BEFORE × AFTER SPEC-001).

Decisões relevantes desta sprint:

- **Skills de profundidade sobre camadas existentes** (L4–L7), não taxonomia nova — mesmo desenho da Interaction Design. Category, severidade e Confidence intocadas; só campos de extensão.
- **Routing como standard Markdown**, sem JS: o runtime já carrega `skills/` por referência (não é `.claude/skills/`). Auditável pela linha `Skills:`.
- **Design QA não foi duplicada como skill** — segue como responsabilidade do STEP 8 (decisão da Sprint 5 mantida).
- **Accessibility sempre no review formal** — é dimensão crítica ★ do Quality Gate; as demais skills de profundidade entram por escopo ou sinal.
- **Nenhuma regra global nova em `CLAUDE.md`** — só o inventário da §9.3, com a rota para o routing (aplicação da §9.1).

## Completed

- Context Engine: `skills/product-context/`, `scripts/context-loader.mjs` (`npm run context:load`), `standards/product-context-brief.md`.
- Critique Engine: `skills/design-critique/`, `skills/interaction-design/`, `standards/critique-framework.md`.
- Adversarial Quality Engine: `agents/design-critic.md`, `agents/design-qa.md`, `standards/adversarial-quality.md`.
- Review Workflow: `workflows/uxco-review.md` + comando `/uxco-review` (`.claude/commands/uxco-review.md`), integralmente `READ`.
- Machine Preflight (`scripts/preflight.mjs`).

## Blocked

None.

## Known Issues

- Paper MCP endpoint não está respondendo neste ambiente (`ECONNREFUSED` em `npm run preflight` e na conexão MCP da sessão) — por isso **nenhuma avaliação real do `/uxco-review` com canvas foi feita na Sprint 6**.
- **Nenhuma AGENT EVALUATION executada, em nenhuma sprint de review:** `benchmarks/review-workflow/results/` e `benchmarks/design-intelligence/results/` estão vazios. Os 24 cenários da Sprint 6, RT-A..D, SPEC-001, ADV-001 e RVW-001..005 estão definidos e não executados. Não existe baseline medido de qualidade.
- Os gabaritos da Sprint 6 foram escritos na mesma sessão que escreveu as skills: a execução precisa de sessões novas e cegas, e um revisor humano deve conferir os gabaritos antes da primeira rodada.
- Cenários de fundação (`tests/foundation/scenarios.md`) não re-executados desde a Sprint 1.
- `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa` e `/uxco-status` ainda não existem (previsto).

## Next

- **Executar SPEC-001** (`benchmarks/design-intelligence/before-after-protocol.md`): BEFORE em `21bec71` (`git worktree add ../uxco-before 21bec71`) × AFTER nesta branch, quatro casos, sessões cegas. Decide se cada skill fica, simplifica ou sai.
- Executar os 24 cenários + RT-A..D (sessão nova por cenário), registrando em `benchmarks/design-intelligence/results/`.
- Com o Paper aberto: um `/uxco-review` real no documento do smoke test, verificando a linha `Skills:` e as `Limitations` do Canvas Snapshot para L5–L7.
- Sprint 7 (Agent Orchestration) só depois de haver pelo menos uma rodada de avaliação registrada.

## Last Handoff

- **Data:** 2026-10-23
- **Branch:** `sprint-6-design-intelligence` (criada de `main` em `21bec71`; **nenhum commit feito**)
- **Trabalho realizado:** Sprint 6 — quatro skills de profundidade, routing contextual, integração com o `/uxco-review` (Critic e QA incluídos), 24 cenários, fixtures, gabaritos e o protocolo BEFORE × AFTER.
- **Verificações executadas:** `npm run verify` (preflight + 114/114), `git diff --check`, mutation check manual de três guardas novas (WCAG, routing, contraste).
- **Próximo passo recomendado:** revisar o diff e os gabaritos, decidir sobre commit/PR e então executar SPEC-001 em sessões cegas.
