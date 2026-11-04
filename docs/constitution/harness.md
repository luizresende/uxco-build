# Harness — runtime, verificação, protocolo de sessão

> Origem: `CLAUDE.md` §11, texto preservado. Ponteiros para seções que mudaram de arquivo foram atualizados. Não redefine a constituição nem os arquivos desta pasta; ancora o que já está decidido em comandos reais.
> Não faz parte do `/uxco-review`. Carregar no início e no fim de uma sessão que altera o repositório — não numa run de review.

## Runtime

- **Runtime:** Node.js ≥ 18 (`package.json` → `engines.node`); desenvolvimento atual em Node 22 (`.nvmrc`).
- **Package manager:** npm; zero dependências externas por decisão de arquitetura (sem lockfile a manter).
- **Integração externa:** Paper MCP (`http://127.0.0.1:29979/mcp`), opcional para trabalho local no repositório — ver `docs/constitution/canvas-safety.md` e `.mcp/README.md`.

## First Run

```bash
npm run preflight        # ambiente local pronto? (Node, Git, Claude Code, arquivos essenciais, Paper endpoint)
```

Detalhes completos de setup: [`docs/getting-started.md`](../getting-started.md).

## Verification

| Comando | Responde | Quando falha |
| --- | --- | --- |
| `npm run preflight` | O ambiente local está pronto? | Node/Git/Claude Code ausentes, ou arquivos essenciais faltando |
| `npm test` | Os comportamentos automatizados continuam corretos? | Qualquer contrato ou invariante determinístico quebrado |
| `npm run verify` | O repositório está consistente para considerar a tarefa concluída? | `preflight` ou `test` falharem (orquestração pura — nenhuma lógica nova) |

Smoke test do Paper (leitura/escrita real) é **manual e separado** — nunca parte de `npm test`/`npm run verify`: [`experiments/paper-mcp/smoke-test.md`](../../experiments/paper-mcp/smoke-test.md). Testes comportamentais da constituição (`tests/foundation/scenarios.md`) também são manuais, um cenário por sessão nova.

Nenhuma tarefa é declarada concluída sem rodar as verificações aplicáveis a ela.

## Hard Constraints

Não negociáveis, além do que já está na constituição e nesta pasta:

- não adicionar dependências, frameworks ou infraestrutura (Docker, CI/CD, banco de dados, telemetria) sem necessidade concreta e demonstrada;
- não fazer commit de secrets ou configuração local sensível (`.gitignore` já cobre os padrões conhecidos — não reduzir essa cobertura);
- manter `UXCO Design Engine` desacoplado do Paper sempre que a arquitetura atual permitir (`docs/constitution/canvas-safety.md` isola as regras específicas de ferramenta);
- manter documentação sincronizada com mudanças arquiteturais — uma informação, uma fonte canônica;
- preservar compatibilidade com Windows (ambiente principal de desenvolvimento).

## Session Protocol

**START:**

1. ler `CLAUDE.md`;
2. ler [`PROGRESS.md`](../../PROGRESS.md);
3. executar `git status` e identificar a branch atual;
4. entender a tarefa antes de modificar arquivos;
5. rodar `npm run preflight` quando o trabalho envolver o Paper ou setup do ambiente.

**END** (sessões que alteram o repositório):

1. rodar `npm run verify` (ou `preflight` + `test` separadamente);
2. revisar `git diff` e `git status`;
3. atualizar [`PROGRESS.md`](../../PROGRESS.md) quando o estado do desenvolvimento mudou de forma relevante — não para alterações triviais;
4. registrar decisões arquiteturais relevantes no local apropriado (memória de projeto, ou Design Decision inline quando não houver memória — princípio 12 em `docs/constitution/operating-principles.md`);
5. deixar um handoff claro para a próxima sessão em `PROGRESS.md`.
