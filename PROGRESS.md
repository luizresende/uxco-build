# UXCO Build Progress

> Estado operacional do desenvolvimento entre sessões. Não substitui Git, GitHub Issues, `CHANGELOG.md` ou memória de projeto — ver `CLAUDE.md` §11 para o protocolo que mantém este arquivo em sincronia.

## Current Status

- Sprint 0 (fundação + smoke test Paper MCP): complete
- Sprint 1 (constituição + standards + templates de memória): complete
- Sprint 2 (Context Engine): complete
- Sprint 3 (Critique Engine): complete
- Sprint 4 (Review Workflow — `/uxco-review`): complete
- Harness foundation (Instructions/Tools/Environment/State/Feedback): in progress — esta sessão

## Working Now

Camada explícita de Harness Engineering sobre a Sprint 4, sem alterar o comportamento do `/uxco-review`:

- `CLAUDE.md` §11 — Runtime, Verification, Hard Constraints operacionais e Session Protocol.
- `PROGRESS.md` (este arquivo) — mecanismo de continuidade entre sessões.
- `.nvmrc` — versão de Node de desenvolvimento declarada.
- `npm run verify` — orquestra `preflight` + `test` (nenhuma lógica nova).
- Fix de portabilidade Windows em `tests/review-workflow/units.test.mjs` (split de linha sensível a CRLF).

## Completed

- Context Engine: `skills/product-context/`, `scripts/context-loader.mjs` (`npm run context:load`), `standards/product-context-brief.md`.
- Critique Engine: `skills/design-critique/`, `skills/interaction-design/`, `standards/critique-framework.md`.
- Review Workflow: `workflows/uxco-review.md` + comando `/uxco-review` (`.claude/commands/uxco-review.md`), integralmente `READ`.
- Suíte de testes determinísticos: 73 testes em `tests/context-engine/`, `tests/critique-engine/`, `tests/review-workflow/` (`npm test`).
- Machine Preflight (`scripts/preflight.mjs`): Node, Git, Claude Code, GitHub CLI, repositório/branch, arquivos essenciais, diagnóstico do endpoint Paper MCP.

## Blocked

None.

## Known Issues

- Paper MCP endpoint não está respondendo neste ambiente (`ECONNREFUSED` em `npm run preflight`) — esperado quando o Paper Desktop não está aberto; não bloqueia trabalho local. Ver `.mcp/README.md`.
- Agents e os comandos `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa`, `/uxco-status` ainda não existem (previsto, não é bug).

## Next

- Rodar `npm run verify` ao final de sessões que alterem o repositório (ver `CLAUDE.md` §11).
- Avaliar necessidade de agents e dos demais comandos `/uxco-*` quando a próxima sprint de produto for definida — fora do escopo desta tarefa de harness.

## Last Handoff

- **Data:** 2026-07-22
- **Branch:** `feat/harness`
- **Trabalho realizado:** auditoria completa do repositório e implementação proporcional dos 5 subsistemas de harness (ver classificação KEEP/IMPROVE/CREATE/SKIP na sessão); nenhuma mudança de comportamento do `/uxco-review`.
- **Verificações executadas:** `npm run preflight` (READY, 1 aviso — Paper offline), `npm test` (73/73 após o fix de CRLF), `npm run verify`.
- **Próximo passo recomendado:** revisar o diff desta sessão e decidir sobre commit/push (não executados automaticamente).
