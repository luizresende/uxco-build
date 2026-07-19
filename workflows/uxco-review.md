# Workflow — UXCO Review (`/uxco-review`)

> **Propósito:** o processo executável do review formal de design — conecta o Context Engine e o Critique Engine em uma sequência única com gates explícitos: contexto → crítica → quality gate → report.
> **Quando consultar:** ao executar o comando `/uxco-review`, ou sempre que o usuário pedir um review formal de uma interface, tela ou fluxo.

Este workflow opera sob a constituição (CLAUDE.md) e **orquestra** capacidades existentes — não redefine método algum: o contexto vem de `skills/product-context/SKILL.md`, a crítica de `skills/design-critique/SKILL.md` e `skills/interaction-design/SKILL.md`, e os contratos de fronteira dos standards (`standards/product-context-brief.md`, `standards/critique-framework.md`, `standards/quality-framework.md`, `standards/severity-framework.md`, `standards/design-output-format.md`, `standards/accessibility-baseline.md`). Qualquer conflito aparente se resolve a favor da camada mais alta (CLAUDE.md §9.2).

## Purpose

Responder: **"este design está pronto — e, se não está, o que precisa mudar, em que ordem?"**

`/uxco-review` é o rito **formal**: Brief de contexto, varredura completa de crítica e Quality Gate com veredito. Crítica pontual de um detalhe não passa por aqui — usa a Design Critique Skill diretamente, com a proporcionalidade da constituição (§2).

## Inputs

| Fonte | Papel | Obrigatória |
| --- | --- | --- |
| Artefato de design — canvas (somente `READ`, exige `PAPER_READY`), descrição textual (ex.: fixture) ou imagem | O objeto sob review | **Sim** — sem artefato observável não há review (gap blocking) |
| Project Memory (caminho informado ou convenção `memory/`) | Alimenta o STEP 2 (Context phase) | Não — ausência é dado e entra no Brief como `MISSING` |
| Escopo declarado pelo usuário | Delimita o que será avaliado (tela, fluxo, produto) | Não — sem declaração, o escopo é o artefato inteiro, declarado no report |
| Conversa atual | Restrições, tarefa-alvo, contexto adicional | Não |

## Safety Model

1. **O review inteiro é operação `READ`** (CLAUDE.md §6): este workflow nunca escreve no canvas, nunca altera a memória do projeto e nunca corrige o que criticou. Recomendar é o limite — execução de mudanças pertence a workflows futuros, com as aprovações que o Action Safety Model exigir.
2. Canvas como fonte exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1; state machine em `docs/architecture.md`). Canvas indisponível **não aborta o review**: a limitação é registrada e o review prossegue com as fontes restantes — ou pede ao usuário uma fonte observável alternativa quando o canvas era a única.
3. Registro de decisão relevante nascida do review (ex.: aceite explícito de risco de um blocker) segue o §3.12 da constituição — bloco Design Decision, nunca escrita silenciosa em memória alheia.

## Process

Sequência obrigatória — nenhum STEP é pulado em silêncio; a profundidade de cada um é proporcional ao escopo (CLAUDE.md §2):

```text
STEP 0  Resolve scope and target
STEP 1  Preflight (condicional — apenas quando o canvas é fonte)
STEP 2  Context phase — Product Context Skill → Product Context Brief
STEP 3  Context gate — aplicar a Execution Recommendation do Brief
STEP 4  Critique phase — Design Critique (+ Interaction Design) → achados
STEP 5  Quality Gate — avaliação formal pelo quality-framework
STEP 6  Report — Design Critique Report completo, com Quality Gate
```

- **STEP 0 — Resolve scope and target.** Identificar o artefato sob review e o escopo (tela única, fluxo, conjunto). Artefato ausente é o único gap blocking estrutural deste workflow: pedir a fonte, nunca reviewar de memória. Tela isolada ativa desde já a disciplina do cenário D (`skills/design-critique/SKILL.md`).
- **STEP 1 — Preflight (condicional).** Somente quando o canvas for fonte: percorrer o Agent Preflight até `PAPER_READY` (docs/architecture.md); qualquer outro estado bloqueia a leitura do canvas e é reportado com a ação de correção. Fontes textuais e imagens não exigem preflight.
- **STEP 2 — Context phase.** Executar a Product Context Skill pelo seu processo integral (STEPs 1–10 dela), usando `npm run context:load -- <projectPath>` quando houver caminho de memória. A saída é o **Product Context Brief** — emitido mesmo com memória `MISSING` (o Brief honesto sobre ausência também é Brief). Se um Brief atual do mesmo escopo já existir na sessão, reutilizá-lo é permitido — declarando a reutilização.
- **STEP 3 — Context gate.** Ler o Context Status do Brief e aplicar o contrato de consumo (`standards/product-context-brief.md`):
  - `PROCEED` ou `PROCEED WITH ASSUMPTIONS` → seguir ao STEP 4, herdando as premissas como premissas (nunca promovidas a fato);
  - `REQUEST BLOCKING CONTEXT` → apresentar as blocking questions ao usuário. Três saídas possíveis, todas explícitas: (a) respostas obtidas → reclassificar e seguir; (b) o usuário autoriza prosseguir sem respostas → review em **modo degradado** (cenário C da Design Critique Skill: L0 `not-evaluable`, Confidence rebaixada onde depender de task criticality), com a autorização registrada; (c) interromper até as respostas existirem. **Inventar respostas nunca é saída.**
- **STEP 4 — Critique phase.** Executar a Design Critique Skill sobre o artefato, com o Brief como contexto (Context Integration da skill). Cheiro comportamental que exija decomposição (fluxo crítico, estados suspeitos, recuperação de erro) roteia a Interaction Design Skill, e os achados compõem **um único conjunto** — mesma regra de agrupamento por causa estrutural, mesmo contrato de 7 campos.
- **STEP 5 — Quality Gate.** Review formal é avaliação formal: aplicar o `quality-framework.md` — nota por dimensão derivada do pior achado, dimensões críticas (★) avaliadas no nível do escopo, `UNKNOWN` onde não houver informação, e o veredito dos três gates (média ≥ 4; críticas ≥ 3; nenhum blocker aberto). Blocker aberto reprova independentemente da média; só sai por correção verificada ou aceite explícito de risco registrado como `DECISION`.
- **STEP 6 — Report.** Emitir o **Design Critique Report** completo (`standards/critique-framework.md`), incluindo a seção Quality Gate com o veredito, o Context citando o Brief e seu Context Status, Layer Coverage integral e Recommended Next Steps priorizados por impacto. Autocrítica antes da entrega: as Quality Checklists das skills envolvidas e o Quality Gate da constituição (§8).

## Output

A saída é **exclusivamente** o Design Critique Report no contrato de `standards/critique-framework.md`, com a seção **Quality Gate sempre presente** (é o que distingue o review formal da crítica pontual). O Brief que o alimentou acompanha o report — íntegro ou referenciado, quando já entregue na sessão. Resumo conversacional pode acompanhar, nunca substituir.

## Failure Conditions

O review é **inválido** — refazer, não entregar — se:

1. Review executado sem artefato observável (crítica de memória ou de suposição).
2. STEP 2 pulado ou fabricado: crítica formal sem Brief, ou Brief inventado para viabilizar L0.
3. Blocking question respondida por invenção, ou modo degradado ativado sem autorização explícita do usuário.
4. Qualquer escrita em canvas ou memória de projeto durante o review.
5. Report formal sem a seção Quality Gate, ou gate reprovado entregue como aprovado / com ressalvas escondidas (CLAUDE.md §8).
6. Qualquer Failure Condition das skills consumidas (elas permanecem válidas dentro do workflow).

## Quality Checklist

Antes de entregar (etapa `critique` do ciclo aplicada ao workflow):

- [ ] Os 7 STEPs aconteceram — ou o desvio está declarado com o porquê?
- [ ] O Brief existe, tem Context Status e o gate do STEP 3 foi aplicado como o contrato manda?
- [ ] Modo degradado, se ativo, tem autorização registrada e as limitações do cenário C aplicadas?
- [ ] Achados em contrato pleno (7 campos, tokens canônicos), agrupados por causa?
- [ ] Quality Gate presente, com dimensões críticas avaliadas ou `UNKNOWN` justificado?
- [ ] Nenhuma operação de escrita aconteceu?
- [ ] Recommended Next Steps priorizados por impacto, incluindo o que destravaria camadas `not-evaluable`?
