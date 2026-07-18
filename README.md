# UXCO Build

> Projeto privado — Sprint 3: Critique Engine do UXCO Design Engine.

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
- **Sprint 1 — concluída:** fundação comportamental do UXCO Design Engine — constituição, standards, templates de memória de projeto e suíte de validação comportamental.
- **Sprint 2 — concluída:** Context Engine — a primeira camada de inteligência contextual, descrita na seção [Context Engine](#context-engine).
- **Sprint 3 — atual:** Critique Engine — análise crítica de interfaces e fluxos, descrita na seção [Critique Engine](#critique-engine).

## Architecture

O que existe hoje no repositório e a responsabilidade de cada parte:

```text
CLAUDE.md               Constituição operacional — sempre carregada
standards/              Critérios compartilhados — consultados por tarefa
skills/                 product-context (Context Engine) · design-critique ·
                        interaction-design (Critique Engine)
templates/project/      Moldes de memória de projeto — copiados por projeto
examples/               Memória demo (Pulse) e fixtures de teste dos engines
scripts/                Machine Preflight e Context Loader
tests/                  foundation/ · context-engine/ · critique-engine/ (determinísticos)
benchmarks/             Harnesses de avaliação manual (context e critique engines)
docs/                   Arquitetura, getting started, registros de sprint
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

### Context Engine

A primeira camada de inteligência contextual (Sprint 2): transforma a memória de um projeto em entendimento estruturado e honesto sobre o que se sabe, o que se supõe e o que falta saber.

```text
Project Memory
      ↓
Context Loader
      ↓
Product Context Skill
      ↓
Product Context Brief
```

- **Project Memory** — os arquivos de `templates/project/` instanciados por projeto (exemplo real em [`examples/demo-project/`](examples/demo-project/)).
- **Context Loader** — inventário mecânico das fontes (`loaded`/`empty`/`missing`): `npm run context:load -- <projectPath> [--json]`.
- **Product Context Skill** — [`skills/product-context/SKILL.md`](skills/product-context/SKILL.md): hierarquia de fontes, classificação em cinco categorias (`CONFIRMED · EVIDENCE · ASSUMPTION · UNKNOWN · CONTRADICTION`), perguntas blocking/non-blocking.
- **Product Context Brief** — o output padronizado, especificado em [`standards/product-context-brief.md`](standards/product-context-brief.md), consumível pelos workflows futuros.

**Testes:** determinísticos do Loader em [`tests/context-engine/`](tests/context-engine/) (`npm test`); avaliação manual da skill (AGENT EVALUATION) em [`benchmarks/context-engine/`](benchmarks/context-engine/), sobre as fixtures de [`examples/context-tests/`](examples/context-tests/).

### Critique Engine

Análise crítica de interfaces e fluxos (Sprint 3): duas skills complementares sobre um contrato comum.

```text
Product Context Brief ──▶ Design Critique ◀──▶ Interaction Design
                                │
                                ▼
                     Design Critique Report
```

- **Design Critique** — [`skills/design-critique/SKILL.md`](skills/design-critique/SKILL.md): diagnóstico amplo pelas camadas L0–L8, com Impact Test anti-superficialidade e cenários de comportamento para contexto incompleto e tela isolada.
- **Interaction Design** — [`skills/interaction-design/SKILL.md`](skills/interaction-design/SKILL.md): profundidade comportamental — cadeia de interação, análise de fluxo, estados e edge cases.
- **Critique Framework** — [`standards/critique-framework.md`](standards/critique-framework.md): camadas, contrato do achado (7 campos), formato do Design Critique Report e as regras comuns de crítica.

**Testes:** contratos determinísticos em [`tests/critique-engine/`](tests/critique-engine/) (`npm test`); fixtures cegas em [`examples/critique-tests/`](examples/critique-tests/); harness de avaliação manual e protocolo A/B (baseline × engine) em [`benchmarks/critique-engine/`](benchmarks/critique-engine/).

### tests/foundation/ — validação comportamental

Dez cenários manuais em [`tests/foundation/scenarios.md`](tests/foundation/scenarios.md) que validam a conduta do agente sob a constituição (agir sem contexto, gaps bloqueantes, ações destrutivas, contradições, estética vs. problema, registro de decisões etc.). Resultados de execução são registrados em `tests/foundation/results/` (append-only).

### Ainda não implementado

**Workflows, agents e comandos `/uxco-*` não existem ainda** — estão previstos para as próximas sprints (as três skills — Product Context, Design Critique e Interaction Design — foram construídas nas Sprints 2 e 3). Nada neste repositório deve ser lido como se eles existissem; a própria constituição (§9.3) proíbe o agente de simular componentes inexistentes.

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
