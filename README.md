# UXCO Build

> Projeto privado — Sprint 1: fundação comportamental do UXCO Design Engine.

O **UXCO Build** é um agente especializado em Product Design, capaz de transformar contexto de produto em decisões, análises e alterações de design executadas diretamente no canvas.

Ele não é um editor de design nem uma alternativa ao Paper: o Paper é o canvas operacional, e o UXCO Build é a camada de inteligência que entende o problema, aplica métodos próprios de Product Design e opera o design por meio do Paper MCP.

## Arquitetura da v0

A v0 roda sobre três pilares:

```text
Claude Code  →  UXCO Design Engine  →  Paper MCP  →  Paper Canvas
```

- **Claude Code** — runtime do agente: loop de execução, contexto, tools e subagentes.
- **UXCO Design Engine** — ativo proprietário: instruções globais, skills, workflows, agentes, standards e memória de projeto (a fundação foi construída na Sprint 1; skills, workflows e agentes vêm nas próximas sprints).
- **Paper MCP** — ponte de leitura e escrita entre o agente e o canvas do Paper.

## Estado do projeto

- **Sprint 0 — concluída:** infraestrutura validada (repositório, preflight, integração Paper MCP com smoke test de leitura/escrita aprovado). Registro em [`docs/sprint-0.md`](docs/sprint-0.md).
- **Sprint 1 — atual:** fundação comportamental do UXCO Design Engine — constituição, standards, templates de memória de projeto e suíte de validação comportamental, descritos abaixo.

## Architecture

O que existe hoje no repositório e a responsabilidade de cada parte:

```text
CLAUDE.md               Constituição operacional — sempre carregada
standards/              Critérios compartilhados — consultados por tarefa
templates/project/      Moldes de memória de projeto — copiados por projeto
tests/foundation/       Validação comportamental — cenários manuais
docs/                   Arquitetura, getting started, registros de sprint
scripts/preflight.mjs   Machine Preflight do ambiente local
experiments/paper-mcp/  Evidência do smoke test da Sprint 0 (histórico)
```

### CLAUDE.md — constituição operacional

Define o comportamento global do agente em toda sessão: identidade, ciclo de trabalho (`context → investigate → decide → design → critique → validate`), princípios operacionais, protocolo de contexto (gaps blocking/non-blocking), taxonomia de evidência (`FACT`/`EVIDENCE`/`ASSUMPTION`/`HYPOTHESIS`/`DECISION`/`UNKNOWN`), modelo de segurança de ações (`READ`/`SAFE_WRITE`/`DESTRUCTIVE_WRITE`), framework de decisão, quality gate e anti-patterns. É deliberadamente compacta: **roteia** para o conhecimento especializado em vez de contê-lo. As regras específicas do Paper ficam isoladas em uma única subseção (§6.1).

### standards/ — critérios compartilhados

Conhecimento profundo, um tópico por arquivo, consultado sob demanda (cada arquivo declara no cabeçalho quando deve ser consultado):

- [`uxco-design-principles.md`](standards/uxco-design-principles.md) — os 15 princípios do método UXCO e a regra de precedência em conflito.
- [`quality-framework.md`](standards/quality-framework.md) — 10 dimensões de avaliação, escala 1–5 ancorada em severidade e gates de aprovação.
- [`severity-framework.md`](standards/severity-framework.md) — escala `Critical`–`Opportunity`, pela lente impact × reach × task criticality × recoverability.
- [`accessibility-baseline.md`](standards/accessibility-baseline.md) — piso prático de acessibilidade em 10 áreas, com limites de verificação declarados (sem alegação de conformidade normativa).
- [`design-output-format.md`](standards/design-output-format.md) — blocos padronizados de saída (Design Issue, Design Decision, Assumption, Open Question) e escala de Confidence.

### templates/project/ — memória de projeto

Sete moldes em Markdown puro que projetos futuros copiam e preenchem: `product`, `users`, `requirements`, `research`, `metrics`, `decisions` (log append-only) e `glossary`. Todos aceitam preenchimento incompleto (`_Not filled_` é dado válido) e separam estruturalmente fatos, suposições e desconhecidos — nenhum template incentiva fabricação de informação.

### tests/foundation/ — validação comportamental

Dez cenários manuais em [`tests/foundation/scenarios.md`](tests/foundation/scenarios.md) que validam a conduta do agente sob a constituição (agir sem contexto, gaps bloqueantes, ações destrutivas, contradições, estética vs. problema, registro de decisões etc.). Resultados de execução são registrados em `tests/foundation/results/` (append-only).

### Ainda não implementado

**Skills, workflows, agents e comandos `/uxco-*` não existem ainda** — estão previstos para as próximas sprints. Nada neste repositório deve ser lido como se eles existissem; a própria constituição (§9.3) proíbe o agente de simular componentes inexistentes.

## Como executar o preflight

O preflight verifica se o ambiente local está pronto (Node.js, Git, estrutura do repositório):

```bash
npm run preflight
```

Ele não instala nada nem altera o ambiente — apenas reporta o que está OK e o que falta.

## Como executar os testes comportamentais

Os testes são cenários manuais, executados com o Claude Code:

1. Abra uma **sessão nova** do Claude Code na raiz do repositório para **cada cenário** (garante a constituição carregada e contexto limpo).
2. Envie o **User Request** do cenário verbatim, fornecendo apenas o contexto que o cenário descreve.
3. Avalie a resposta contra os **Pass/Fail Criteria** — comportamento observável, não palavras exatas; qualquer Fail Criteria reprova.
4. Registre a execução em `tests/foundation/results/YYYY-MM-DD-run-N.md` (data, commit testado, PASS/FAIL por cenário, veredito final).

Instruções completas no cabeçalho de [`tests/foundation/scenarios.md`](tests/foundation/scenarios.md).

## Documentação

- [`docs/getting-started.md`](docs/getting-started.md) — como preparar o ambiente do zero.
- [`docs/architecture.md`](docs/architecture.md) — visão da arquitetura da v0, preflight em dois níveis e state machine de prontidão do Paper.
- [`docs/sprint-0.md`](docs/sprint-0.md) — escopo e critérios de saída da Sprint 0 (registro histórico).
- [`experiments/paper-mcp/`](experiments/paper-mcp/) — experimentos de validação do Paper MCP (smoke test — registro histórico).
