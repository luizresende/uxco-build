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
| Escopo do review — uma tela · um frame · uma seleção · um conjunto de frames · um fluxo | Delimita o que será avaliado | Não — sem escopo explícito, resolvido pela ordem de Scope Resolution |
| Conversa atual | Restrições, tarefa-alvo, contexto adicional | Não |

## Scope Resolution

O review aceita como escopo qualquer uma destas unidades: **uma tela · um frame · uma seleção · um conjunto de frames · um fluxo**. A resolução (STEP 0) segue esta ordem de precedência:

```text
1. Escopo explícito do usuário
2. Seleção ativa no Paper
3. Escopo identificado a partir do contexto disponível
4. Ambiguidade → sinalizar e perguntar — nunca inventar
```

1. **Escopo explícito do usuário** — quando o pedido nomeia o alvo (argumento do comando, frame citado, fluxo descrito), ele é o escopo. Seleção ativa divergente não o substitui — divergência clara entre pedido e seleção é apontada ao usuário, nunca resolvida em silêncio.
2. **Seleção ativa no Paper** — sem escopo explícito, havendo canvas como fonte (`PAPER_READY`) e seleção inequívoca, **a seleção tem prioridade**: ela é o escopo, declarado no report com essa origem.
3. **Contexto disponível** — sem escopo explícito nem seleção inequívoca, tentar identificar o escopo pelo contexto da sessão: artefato único fornecido, fluxo em discussão na conversa, candidato natural no documento ativo (ex.: um único frame no canvas). A identificação é inferência — declarada como tal (`ASSUMPTION` de escopo, revisável pelo usuário). Candidato único de confiança razoável não é ambiguidade: é inferência declarada, e o review prossegue.
4. **Ambiguidade** — múltiplos candidatos plausíveis (várias telas, seleção ambígua, conversa apontando para mais de um fluxo) cuja escolha errada comprometeria a confiabilidade da análise: o workflow **sinaliza a ambiguidade e pergunta**, com uma pergunta objetiva listando os candidatos (gap blocking — CLAUDE.md §4). **Inventar o escopo nunca é saída**: escopo inventado invalida o review inteiro (Failure Conditions).

Escopo de tela/frame isolado ativa a disciplina do cenário D (`skills/design-critique/SKILL.md`); conjunto de frames ou fluxo completo, a do cenário E.

### Scope block — representação auditável

O resultado do STEP 0 é materializado neste bloco, que preenche o campo **Scope** do Design Critique Report (expande, sem alterar, o contrato de `standards/critique-framework.md`):

```text
Scope:
  Type:        [screen | frame | selection | frame-set | flow]
  Name:        [nome do alvo — frame, fluxo ou tela como nomeado na fonte]
  Source:      [explicit | selection | inferred]
  Includes:    [frames/telas/elementos cobertos — um por item; o que fica de fora relevante, declarado]
  Confidence:  [High | Medium | Low — escala de standards/design-output-format.md]
  Ambiguities: [None | ambiguidades abertas, cada uma com seus candidatos]
```

Regras do bloco:

1. **Tokens canônicos:** `Type` e `Source` usam exatamente os valores acima — `Source` espelha a ordem de precedência (`explicit` = escopo do usuário; `selection` = seleção ativa no Paper; `inferred` = identificado do contexto). Sinônimos quebram o consumo do report.
2. **Confidence honesta:** `Source: inferred` nunca nasce `High` sem base declarada em Includes/Ambiguities — o workflow **não finge certeza**; a confiança do escopo segue a mesma disciplina de qualquer julgamento (`standards/design-output-format.md`).
3. **Escopo não resolvido também é representado:** nos casos 4 e 5 abaixo, o bloco é emitido com `Type`/`Name` = `UNKNOWN`, `Ambiguities` listando os candidatos (quando existirem) e uma Open Question `Blocking: Yes` ao lado — a crítica (STEP 4 em diante) **não prossegue** com Scope `UNKNOWN`.

### Casos canônicos de detecção

| Caso | Situação | Resolução esperada |
| --- | --- | --- |
| 1 | Usuário especifica explicitamente uma tela | `Type: screen · Source: explicit · Confidence: High`; cenário D ativo |
| 2 | Usuário especifica explicitamente um fluxo | `Type: flow · Source: explicit`; `Includes` lista as etapas conhecidas; cenário E ativo |
| 3 | Sem escopo explícito; Paper com seleção utilizável | `Source: selection`; `Type` conforme o que a seleção forma (frame, conjunto, tela); seleção nunca ignorada em silêncio |
| 4 | Nem escopo explícito, nem seleção, nem candidato identificável no contexto | Scope `UNKNOWN` + Open Question blocking pedindo a fonte; nenhuma crítica é iniciada |
| 5 | Múltiplos candidatos plausíveis (telas, fluxos ou artefatos concorrentes) | Scope `UNKNOWN` + `Ambiguities` com os candidatos + Open Question blocking listando-os; nunca escolha por palpite |

Os cinco casos têm cenários comportamentais executáveis em `tests/review-workflow/scope-scenarios.md` (SCP-001..005).

## Context Integration

O workflow **reutiliza o Context Engine da Sprint 2 por inteiro e não replica nada dele**: descoberta, classificação e síntese pertencem à Product Context Skill — o workflow apenas a aciona e consome o Brief pelo contrato publicado.

```text
Review request
      ↓
Scope Detection          STEP 0 — Scope block
      ↓
Context Loader           npm run context:load — inventário mecânico (STEPs 1–2 da skill)
      ↓
Product Context Skill    skills/product-context/SKILL.md — análise (STEPs 3–10)
      ↓
Product Context Brief    standards/product-context-brief.md — o contrato consumido
      ↓
Context gate             STEP 3 → Critique
```

Como o review consome cada categoria do Brief (Evidence Classification da skill — usada, nunca redefinida aqui):

| Categoria no Brief | Uso no review |
| --- | --- |
| `CONFIRMED` (fatos confirmados) | Chão firme: fundamenta L0 e calibra severidade (task criticality real) sem ressalva |
| `EVIDENCE` (Known Evidence) | Sustenta julgamentos com o peso do método; citada nos achados que dependem dela |
| `ASSUMPTION` (Assumptions) | Herdada como premissa — nunca promovida a fato (contrato de consumo do Brief); julgamento apoiado nela declara a dependência e reduz Confidence |
| `UNKNOWN` (Open Questions) | Distinguido por blocking/non-blocking: **blocking unknowns** entram no gate do STEP 3; **non-blocking unknowns** acompanham o report como pendência declarada, sem interromper nada |
| `CONTRADICTION` | Nunca resolvida pelo review: nomeada no report, escolha devolvida ao usuário |

**Política de bloqueio do review** — ausência de informação, por si, nunca bloqueia:

- Contexto incompleto mas suficiente → o review **continua**, com as conclusões afetadas explicitamente rebaixadas de Confidence e as limitações declaradas (cenários B/C da Design Critique Skill).
- Bloquear é exceção, reservada a quando a falta de contexto tornaria a análise **potencialmente enganosa** — quando, mesmo com limitações declaradas, o review provavelmente apontaria os problemas errados ou calibraria severidades sem sentido (o critério de blocking do CLAUDE.md §4 aplicado ao review inteiro).

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

- **STEP 0 — Resolve scope and target.** Identificar o artefato observável e resolver o escopo pela ordem de precedência de Scope Resolution (explícito → seleção ativa → contexto → ambiguidade sinalizada). Dois gaps blocking possíveis aqui: artefato ausente (pedir a fonte, nunca reviewar de memória) e ambiguidade de escopo entre múltiplos candidatos plausíveis (perguntar listando os candidatos, nunca escolher por palpite).
- **STEP 1 — Preflight (condicional).** Somente quando o canvas for fonte: percorrer o Agent Preflight até `PAPER_READY` (docs/architecture.md); qualquer outro estado bloqueia a leitura do canvas e é reportado com a ação de correção. Fontes textuais e imagens não exigem preflight.
- **STEP 2 — Context phase.** Executar a Product Context Skill pelo seu processo integral (STEPs 1–10 dela), usando `npm run context:load -- <projectPath>` quando houver caminho de memória. A saída é o **Product Context Brief** — emitido mesmo com memória `MISSING` (o Brief honesto sobre ausência também é Brief). Se um Brief atual do mesmo escopo já existir na sessão, reutilizá-lo é permitido — declarando a reutilização.
- **STEP 3 — Context gate.** Ler o Context Status do Brief e aplicar o contrato de consumo (`standards/product-context-brief.md`) sob a Política de bloqueio (Context Integration):
  - `PROCEED` ou `PROCEED WITH ASSUMPTIONS` → seguir ao STEP 4, herdando as premissas como premissas (nunca promovidas a fato).
  - `REQUEST BLOCKING CONTEXT` → apresentar as blocking questions — e, **por padrão, continuar mesmo assim**: a crítica prossegue nas camadas que não dependem das respostas (cenário C da Design Critique Skill: L0 `not-evaluable`, Confidence rebaixada onde depender de task criticality), com as perguntas abertas visíveis no report. Isso respeita o contrato do Brief: o que as blocking questions bloqueiam é o julgamento que depende delas, não as camadas observáveis. **Interromper é exceção**: reservada a quando a ausência tornaria a análise potencialmente enganosa mesmo com limitações declaradas — nesse caso o review para nas perguntas, explicando por que prosseguir seria pior que esperar. **Inventar respostas nunca é saída.**
- **STEP 4 — Critique phase.** Executar a Design Critique Skill sobre o artefato, com o Brief como contexto (Context Integration da skill). Cheiro comportamental que exija decomposição (fluxo crítico, estados suspeitos, recuperação de erro) roteia a Interaction Design Skill, e os achados compõem **um único conjunto** — mesma regra de agrupamento por causa estrutural, mesmo contrato de 7 campos.
- **STEP 5 — Quality Gate.** Review formal é avaliação formal: aplicar o `quality-framework.md` — nota por dimensão derivada do pior achado, dimensões críticas (★) avaliadas no nível do escopo, `UNKNOWN` onde não houver informação, e o veredito dos três gates (média ≥ 4; críticas ≥ 3; nenhum blocker aberto). Blocker aberto reprova independentemente da média; só sai por correção verificada ou aceite explícito de risco registrado como `DECISION`.
- **STEP 6 — Report.** Emitir o **Design Critique Report** completo (`standards/critique-framework.md`), incluindo a seção Quality Gate com o veredito, o Context citando o Brief e seu Context Status, Layer Coverage integral e Recommended Next Steps priorizados por impacto. Autocrítica antes da entrega: as Quality Checklists das skills envolvidas e o Quality Gate da constituição (§8).

## Output

A saída é **exclusivamente** o Design Critique Report no contrato de `standards/critique-framework.md`, com a seção **Quality Gate sempre presente** (é o que distingue o review formal da crítica pontual). O Brief que o alimentou acompanha o report — íntegro ou referenciado, quando já entregue na sessão. Resumo conversacional pode acompanhar, nunca substituir.

## Failure Conditions

O review é **inválido** — refazer, não entregar — se:

1. Review executado sem artefato observável (crítica de memória ou de suposição).
2. Escopo inventado: ambiguidade entre candidatos plausíveis resolvida por palpite em vez de sinalizada (Scope Resolution violada) — ou seleção/pedido explícito ignorados em silêncio.
3. STEP 2 pulado ou fabricado: crítica formal sem Brief, ou Brief inventado para viabilizar L0.
4. Blocking question respondida por invenção; conclusão afetada por contexto ausente entregue sem a redução explícita de Confidence e a limitação declarada; ou review interrompido por ausência de informação que não tornaria a análise enganosa (bloqueio indevido — anti-pattern 10).
5. Qualquer escrita em canvas ou memória de projeto durante o review.
6. Report formal sem a seção Quality Gate, ou gate reprovado entregue como aprovado / com ressalvas escondidas (CLAUDE.md §8).
7. Qualquer Failure Condition das skills consumidas (elas permanecem válidas dentro do workflow).

## Quality Checklist

Antes de entregar (etapa `critique` do ciclo aplicada ao workflow):

- [ ] Os 7 STEPs aconteceram — ou o desvio está declarado com o porquê?
- [ ] Escopo resolvido pela ordem de precedência (explícito → seleção → contexto) e declarado no report com a origem — ambiguidade real sinalizada em vez de resolvida por palpite?
- [ ] O Brief existe, tem Context Status e o gate do STEP 3 foi aplicado como o contrato manda?
- [ ] Contexto incompleto tratado pela Política de bloqueio: review continuou com Confidence rebaixada e limitações declaradas nas conclusões afetadas — e interrupção usada somente diante de análise potencialmente enganosa?
- [ ] Blocking e non-blocking unknowns distinguidos — blocking no gate, non-blocking como pendência declarada sem interromper nada?
- [ ] Achados em contrato pleno (7 campos, tokens canônicos), agrupados por causa?
- [ ] Quality Gate presente, com dimensões críticas avaliadas ou `UNKNOWN` justificado?
- [ ] Nenhuma operação de escrita aconteceu?
- [ ] Recommended Next Steps priorizados por impacto, incluindo o que destravaria camadas `not-evaluable`?
