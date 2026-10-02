# UXCO Build

> Projeto privado — Sprint 5: Adversarial Quality Engine do UXCO Design Engine.

O **UXCO Build** é um agente especializado em Product Design, capaz de transformar contexto de produto em decisões, análises e alterações de design executadas diretamente no canvas.

Ele não é um editor de design nem uma alternativa ao Paper: o Paper é o canvas operacional, e o UXCO Build é a camada de inteligência que entende o problema, aplica métodos próprios de Product Design e opera o design por meio do Paper MCP.

## Arquitetura da v0

A v0 roda sobre três pilares:

```text
Claude Code  →  UXCO Design Engine  →  Paper MCP  →  Paper Canvas
```

- **Claude Code** — runtime do agente: loop de execução, contexto, tools e subagentes.
- **UXCO Design Engine** — ativo proprietário: instruções globais, skills, agentes, workflows, standards e memória de projeto (fundação na Sprint 1; skills nas Sprints 2–3; workflow na Sprint 4; agentes na Sprint 5).
- **Paper MCP** — ponte de leitura e escrita entre o agente e o canvas do Paper.

## Estado do projeto

- **Sprint 0 — concluída:** infraestrutura validada (repositório, preflight, integração Paper MCP com smoke test de leitura/escrita aprovado). Registro em [`docs/sprint-0.md`](docs/sprint-0.md).
- **Sprint 1 — concluída:** fundação comportamental do UXCO Design Engine — constituição, standards, templates de memória de projeto e suíte de validação comportamental.
- **Sprint 2 — concluída:** Context Engine — a primeira camada de inteligência contextual, descrita na seção [Context Engine](#context-engine).
- **Sprint 3 — concluída:** Critique Engine — análise crítica de interfaces e fluxos, descrita na seção [Critique Engine](#critique-engine).
- **Sprint 4 — concluída:** Review Workflow — o primeiro workflow e o primeiro comando real (`/uxco-review`), descrito na seção [Review Workflow](#review-workflow).
- **Harness — concluído:** camada explícita de Harness Engineering (Instructions/Tools/Environment/State/Feedback), descrita na seção [Harness](#harness).
- **Sprint 5 — atual:** Adversarial Quality Engine — o sistema passa a desafiar o próprio diagnóstico antes de apresentá-lo, descrito na seção [Adversarial Quality Engine](#adversarial-quality-engine).

## Architecture

O que existe hoje no repositório e a responsabilidade de cada parte:

```text
CLAUDE.md               Constituição operacional — sempre carregada (§11: harness — runtime,
                        verificação, protocolo de sessão)
PROGRESS.md             Estado operacional entre sessões — onde estamos, próximo passo
.nvmrc                  Versão de Node do ambiente de desenvolvimento
standards/              Critérios compartilhados — consultados por tarefa
skills/                 product-context (Context Engine) · design-critique ·
                        interaction-design (Critique Engine)
agents/                 design-critic · design-qa (Adversarial Quality Engine)
workflows/              uxco-review (Review Workflow — orquestra os engines)
.claude/commands/       Comandos reais do Claude Code — /uxco-review
templates/              project/ (memória de projeto, copiada por projeto) ·
                        reports/ (molde do Design Critique Report do /uxco-review)
examples/               Memória demo (Pulse) e fixtures de teste dos engines e do workflow
                        (inclui adversarial-tests/ — diagnósticos, não designs)
scripts/                Machine Preflight e Context Loader
tests/                  foundation/ · context-engine/ · critique-engine/ ·
                        review-workflow/ (determinísticos, inclui a camada adversarial)
benchmarks/             Harnesses de avaliação manual (engines e review workflow)
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
- [`adversarial-quality.md`](standards/adversarial-quality.md) — contratos da camada adversarial: Adversarial Critique Record, Review QA Record, marcadores de estágio e o invariante de ciclo único.

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

### Review Workflow

O primeiro workflow do sistema (Sprint 4): a orquestração que conecta os dois engines em um review formal de design, acionável pelo primeiro comando real — `/uxco-review`.

```text
/uxco-review <alvo>
      ↓
workflows/uxco-review.md
      ↓
STEP 0-1  escopo · preflight condicional (canvas → PAPER_READY)
STEP 2-3  Product Context Skill → Brief → gate de contexto
STEP 4-5  Initial Analysis — Design Critique (+ Interaction Design) → consolidação
STEP 6    Adversarial Critique — Design Critic desafia o diagnóstico
STEP 7    Revision — vereditos incorporados em um diagnóstico só
STEP 8    Review QA — Design QA audita a qualidade do review
STEP 9-10 Quality Gate do design → Design Critique Report
```

- **Workflow** — [`workflows/uxco-review.md`](workflows/uxco-review.md): processo em 11 STEPs com gates explícitos; orquestra por referência (nenhum método é redefinido) e é integralmente operação `READ` — review nunca escreve no canvas nem na memória.
- **Comando** — [`.claude/commands/uxco-review.md`](.claude/commands/uxco-review.md): o slash command real do Claude Code; roteador fino para o workflow. Formas de invocação:

```text
/uxco-review                                   escopo pela seleção do Paper ou pelo contexto da sessão
/uxco-review checkout                          alvo nomeado — referente resolvido contra canvas, arquivos e conversa
/uxco-review examples/.../fixture.md           caminho explícito
"faça o review formal do fluxo de checkout"    pedido contextual equivalente, roteado pela constituição (§9)
```
- **Gate de contexto** — a `Execution Recommendation` do Brief governa a passagem: `REQUEST BLOCKING CONTEXT` exige respostas do usuário ou autorização explícita para o modo degradado (cenário C) — nunca respostas inventadas.
- **Quality Gate sempre presente** — review formal é avaliação formal (`standards/quality-framework.md`): é o que o distingue da crítica pontual via skill.

**Pré-requisitos:** sessão do Claude Code aberta na **raiz deste repositório** (o workflow resolve toda referência contra a constituição e os standards daqui); um **artefato observável** — canvas no Paper, arquivo de descrição (fixture) ou imagem — é a única precondição absoluta. Canvas como fonte exige Paper conectado e `PAPER_READY` verificado por chamada real (`npm run preflight` diagnostica o ambiente local). Memória de projeto é opcional (ausência vira Brief honesto com fontes `MISSING`); o Context Loader pede Node ≥ 18.

**Exemplo mínimo** (sessão nova na raiz do repositório, sem Paper):

```text
/uxco-review examples/review-tests/02-pulse-new-item/fixture.md
```

Saída esperada: o Design Critique Report completo — Scope block (`Type: screen · Source: explicit`), Brief com a memória demo do Pulse carregada, issues no contrato de 7 campos ordenadas por severidade e a seção Quality Gate com veredito.

**Limitações atuais:**

- O review é **integralmente `READ`**: analisa e recomenda, mas não corrige — nenhuma escrita em canvas ou memória de projeto, nem mediante aprovação (correção pertence a workflows futuros).
- A leitura do canvas se limita ao repertório validado no smoke test da Sprint 0 (estrutura, textos, estilos computados, screenshots); comportamento de runtime, ordem de foco real e interações não são observáveis — entram como limitação declarada no report.
- A qualidade da execução é avaliada manualmente (AGENT EVALUATION nos harnesses); os testes automatizados cobrem contratos e invariantes, não a substância da crítica.
- Um review por alvo por vez — não há execução em lote nem comparação entre versões de um design.

**Testes:** contratos determinísticos e cenários de integração em [`tests/review-workflow/`](tests/review-workflow/) (`npm test`); fixtures E2E com memória em [`examples/review-tests/`](examples/review-tests/); harness de avaliação manual (conduta + substância) e o primeiro teste comparativo da tese (Control × `/uxco-review`, `differential-protocol.md`) em [`benchmarks/review-workflow/`](benchmarks/review-workflow/).

### Adversarial Quality Engine

A camada que impede o sistema de entregar o próprio primeiro diagnóstico como conclusão (Sprint 5): depois da análise inicial, o diagnóstico é **atacado**, **revisado** e **auditado** antes de sair.

```text
Initial Analysis ──▶ Adversarial Critique ──▶ Revision ──▶ Review QA ──▶ Final Report
   (o design)          (o diagnóstico)        (um só)      (o review)
```

Quatro responsabilidades encadeadas — **não quatro personas**: a primeira olha o design, a segunda olha a primeira, a terceira consolida, a quarta audita o resultado das três.

- **Design Critic** — [`agents/design-critic.md`](agents/design-critic.md): a responsabilidade adversarial. Pergunta "onde o nosso diagnóstico pode estar errado, incompleto, superficial ou excessivamente confiante?" por dez eixos (assumptions, evidência, severidade, confidence, causalidade, estados e edge cases omitidos, encaixe no contexto, recomendações, complexidade desnecessária) e dez sondas obrigatórias — incluindo "what would falsify this diagnosis?". Emite veredito por achado: `confirmed · revised · rejected · added`. **Não repete a varredura L0–L8** e **pode concluir que o diagnóstico inicial estava correto**: confirmar tudo é resultado válido, e não existe cota de mudanças.
- **Revision** — o estágio de consolidação no workflow (STEP 7): rejeitados saem de Issues (suspeita legítima volta como Open Question), revisados mudam campo a campo, omissões entram no contrato pleno de 7 campos, e os mecanismos de consolidação e ordenação são reaplicados ao conjunto novo. **O usuário recebe uma conclusão, nunca duas análises contraditórias.**
- **Design QA** — [`agents/design-qa.md`](agents/design-qa.md): audita a **qualidade do review**, não o design. Sete dimensões (Context Grounding · Evidence Quality · Severity Calibration · Actionability · Completeness · Accessibility Coverage · System Consistency) em `PASS/PARTIAL/FAIL/UNKNOWN`, **sem score composto** — média de tokens de conduta seria falsa precisão. Blockers ficam em lista própria, e o **QA blocker** (o review não é confiável) nunca se confunde com o **design blocker** (o design está reprovado).
- **Contratos** — [`standards/adversarial-quality.md`](standards/adversarial-quality.md): os dois records, os marcadores de estágio (`INITIAL_ANALYSIS` → `ADVERSARIAL_REVIEW` → `REVISION` → `FINAL_QA`) e o **ciclo único**: 1 crítica, 1 revisão, 1 QA. Nenhuma recursão, nenhum agente debatendo; QA reprovando declara o blocker em vez de reprocessar.

O que chega ao report é um bloco compacto (`## Review Assurance`) — stage trace, contagens do desafio, veredito do QA. A camada melhora o diagnóstico; ela não aumenta o relatório, e os records acompanham ou são referenciados, nunca colados dentro das Issues.

**Limitação honesta:** o ganho desta camada é **arquitetural, ainda não medido**. O protocolo que o mede (BEFORE × AFTER, cinco contagens verificáveis) está em [`benchmarks/review-workflow/adversarial-protocol.md`](benchmarks/review-workflow/adversarial-protocol.md) e **não foi executado** — `NOT SUPPORTED` é um resultado possível e seria informação valiosa.

**Testes:** 23 testes determinísticos em [`tests/review-workflow/adversarial.test.mjs`](tests/review-workflow/adversarial.test.mjs); cenários comportamentais ADV-A..ADV-G em [`tests/review-workflow/adversarial-scenarios.md`](tests/review-workflow/adversarial-scenarios.md); fixture de diagnóstico falho em [`examples/adversarial-tests/`](examples/adversarial-tests/).

### tests/foundation/ — validação comportamental

Dez cenários manuais em [`tests/foundation/scenarios.md`](tests/foundation/scenarios.md) que validam a conduta do agente sob a constituição (agir sem contexto, gaps bloqueantes, ações destrutivas, contradições, estética vs. problema, registro de decisões etc.). Resultados de execução são registrados em `tests/foundation/results/` (append-only).

### Ainda não implementado

**Os demais comandos `/uxco-*` não existem ainda** — `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa` e `/uxco-status` estão previstos para as próximas sprints (as três skills vieram das Sprints 2–3; o workflow de review e o comando `/uxco-review`, da Sprint 4; os dois agents, da Sprint 5). Nada neste repositório deve ser lido como se eles existissem; a própria constituição (§9.3) proíbe o agente de simular componentes inexistentes.

Em particular: a camada de QA da Sprint 5 é um **estágio interno** do `/uxco-review` (STEP 8), **não** o comando `/uxco-design-qa`. Um futuro comando poderá rotear para `agents/design-qa.md` sem retrabalho — mas ele ainda não existe.

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

## Harness

A confiabilidade do desenvolvimento entre sessões do Claude Code é estruturada em cinco subsistemas — o repositório é o system of record; nenhum deles depende de histórico de conversa:

- **Instructions** — `CLAUDE.md` é o entry point sempre carregado (constituição + §11 harness); roteia para `standards/`, `skills/`, `agents/`, `workflows/` em vez de duplicá-los.
- **Tools** — Node.js, Git, Claude Code e (opcionalmente) Paper MCP; verificados por `npm run preflight`.
- **Environment** — `.nvmrc` + `engines` em `package.json` declaram o runtime; zero dependências externas por decisão de arquitetura.
- **State** — [`PROGRESS.md`](PROGRESS.md) registra onde o desenvolvimento está, o que está bloqueado e o próximo passo — sem substituir Git ou o `CHANGELOG.md`.
- **Feedback** — `npm run preflight` (ambiente pronto?), `npm test` (comportamento correto?) e `npm run verify` (repositório consistente para considerar uma tarefa concluída? — orquestra os dois anteriores).

## Documentação

- [`docs/getting-started.md`](docs/getting-started.md) — como preparar o ambiente do zero.
- [`docs/architecture.md`](docs/architecture.md) — visão da arquitetura da v0, preflight em dois níveis e state machine de prontidão do Paper.
- [`docs/sprint-0.md`](docs/sprint-0.md) — escopo e critérios de saída da Sprint 0 (registro histórico).
- [`experiments/paper-mcp/`](experiments/paper-mcp/) — experimentos de validação do Paper MCP (smoke test — registro histórico).

## License

`UNLICENSED` — projeto privado, sem licença de código aberto.
