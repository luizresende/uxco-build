# Workflow — UXCO Review (`/uxco-review`)

> **Propósito:** o processo executável do review formal de design — conecta o Context Engine, o Critique Engine e o Adversarial Quality Engine em uma sequência única com gates explícitos: contexto → análise inicial → crítica adversarial → revisão → QA → quality gate → report.
> **Quando consultar:** ao executar o comando `/uxco-review`, ou sempre que o usuário pedir um review formal de uma interface, tela ou fluxo.

Este workflow opera sob a constituição (CLAUDE.md) e **orquestra** capacidades existentes — não redefine método algum: o contexto vem de `skills/product-context/SKILL.md`, a crítica de `skills/design-critique/SKILL.md` e `skills/interaction-design/SKILL.md`, o desafio adversarial e a auditoria do review de `agents/design-critic.md` e `agents/design-qa.md`, e os contratos de fronteira dos standards (`standards/product-context-brief.md`, `standards/critique-framework.md`, `standards/adversarial-quality.md`, `standards/quality-framework.md`, `standards/severity-framework.md`, `standards/design-output-format.md`, `standards/accessibility-baseline.md`). Qualquer conflito aparente se resolve a favor da camada mais alta (CLAUDE.md §9.2).

## Purpose

Responder: **"este design está pronto — e, se não está, o que precisa mudar, em que ordem?"**

`/uxco-review` é o rito **formal**: Brief de contexto, varredura completa de crítica, **o diagnóstico desafiado e revisado antes de virar conclusão**, auditoria da qualidade do próprio review e Quality Gate com veredito. Crítica pontual de um detalhe não passa por aqui — usa a Design Critique Skill diretamente, com a proporcionalidade da constituição (§2).

A diferença entre este workflow e uma crítica direta não é só a formalidade do report: é que **o primeiro diagnóstico não é entregue como conclusão**. Ele é atacado primeiro (STEP 6), consolidado depois (STEP 7) e auditado antes de sair (STEP 8).

## Trigger

O workflow dispara por qualquer uma destas vias — todas equivalentes:

- **Comando:** `/uxco-review` (puro, com alvo nomeado ou com caminho — formas em `.claude/commands/uxco-review.md`).
- **Pedido contextual:** solicitação de review formal em linguagem natural ("faça o review do fluxo de checkout"), roteada pela constituição (CLAUDE.md §9).
- **Ciclo de trabalho:** a etapa `critique` do ciclo (CLAUDE.md §2) elevada a avaliação formal, quando o usuário pedir o rito completo sobre trabalho da própria sessão.

**Não dispara:** crítica pontual de um detalhe (Design Critique Skill direta) e pedido de design novo (crítica não é geração).

## Inputs

| Fonte | Papel | Obrigatória |
| --- | --- | --- |
| Artefato de design — canvas (somente `READ`, exige `PAPER_READY`), descrição textual (ex.: fixture) ou imagem | O objeto sob review | **Sim** — sem artefato observável não há review (gap blocking) |
| Project Memory (caminho informado ou convenção `memory/`) | Alimenta o STEP 2 (Context phase) | Não — ausência é dado e entra no Brief como `MISSING` |
| Escopo do review — uma tela · um frame · uma seleção · um conjunto de frames · um fluxo | Delimita o que será avaliado | Não — sem escopo explícito, resolvido pela ordem de Scope Resolution |
| Conversa atual | Restrições, tarefa-alvo, contexto adicional | Não |

## Preconditions

- **Artefato observável** disponível ou obtenível — a única precondição absoluta; sem ela, o review para no caso 4 da detecção de escopo (pedir a fonte).
- **Canvas como fonte** exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1); indisponível, a fonte canvas é declarada inacessível e o review segue com as demais fontes, se existirem.
- **Memória de projeto é opcional** — ausência não impede nada: vira Brief honesto com fontes `MISSING`.
- **Context Loader** (`npm run context:load`, Node ≥ 18) quando houver caminho de memória; indisponível, o inventário dos STEPs 1–2 da skill é feito por leitura direta — declarado no Brief.
- **Constituição e standards carregáveis** — o workflow não opera fora do repositório do UXCO Build (é sobre eles que toda referência resolve).

## Scope Resolution

O review aceita como escopo qualquer uma destas unidades: **uma tela · um frame · uma seleção · um conjunto de frames · um fluxo**. A resolução (STEP 0) segue esta ordem de precedência:

```text
1. Escopo explícito do usuário
2. Seleção ativa no Paper
3. Escopo identificado a partir do contexto disponível
4. Ambiguidade → sinalizar e perguntar — nunca inventar
```

1. **Escopo explícito do usuário** — quando o pedido nomeia o alvo (argumento do comando, frame citado, fluxo descrito), ele é o escopo. O explícito pode vir como **caminho** (arquivo, fixture) ou como **nome** (ex.: `/uxco-review checkout`): o nome declara a intenção sem ambiguidade, mas seu **referente** ainda é resolvido contra as fontes da sessão — frames do canvas, arquivos citados, conversa; múltiplas correspondências plausíveis caem no degrau 4 (ambiguidade sinalizada com os candidatos). Seleção ativa divergente não substitui o explícito — divergência clara entre pedido e seleção é apontada ao usuário, nunca resolvida em silêncio.
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

Os cinco casos têm cenários comportamentais executáveis em `tests/review-workflow/scope-scenarios.md` (SCP-001..006 — o sexto cobre o alvo nomeado, variante dos casos 1 e 5).

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

## Paper Inspection

A leitura do canvas que alimenta as skills. Como o §6.1 da constituição, esta é a camada amarrada à ferramenta concreta — trocar de canvas no futuro substitui apenas ela.

**Somente leitura, sempre:** a inspeção usa exclusivamente operações `READ`, sob `PAPER_READY` (STEP 1). Nesta sprint, o `/uxco-review` **não modifica o canvas em nenhuma hipótese** — nem mediante aprovação; correção pertence a workflows futuros.

**O que a inspeção busca**, quando a integração permitir: frames e artboards · hierarquia e elementos · textos visíveis · estrutura e sequência · propriedades relevantes ao escopo (dimensões, cores, tipografia) · relações entre telas · padrões repetidos identificáveis · estados representados.

**Capacidades reais, nunca presumidas:** o repertório de leitura é o validado pelo smoke test da Sprint 0 (`experiments/paper-mcp/smoke-test.md`) — informações do documento, árvore/hierarquia, inspeção de nós (tipo e conteúdo de texto), estilos computados e screenshots. Capacidade fora desse repertório não é assumida: tenta-se por chamada real, e recusa ou ausência vira limitação registrada. Dado que a integração não retornou **jamais é inventado**.

### Canvas Snapshot — representação estável para as skills

O resultado da inspeção é consolidado neste bloco — o suficiente para a crítica, nunca uma reprodução do documento inteiro:

```text
Canvas Snapshot:
  Document:    [nome e ID do documento]
  Captured:    [YYYY-MM-DD — momento da leitura; o canvas pode mudar depois]
  Method:      [chamadas de leitura realmente executadas]
  Frames:      [frames no escopo — nome, dimensões]
  Hierarchy:   [estrutura resumida por frame: elementos relevantes e aninhamento]
  Texts:       [textos visíveis relevantes ao escopo]
  Properties:  [propriedades relevantes: tamanhos, cores, tipografia — quando legíveis]
  Sequence:    [ordem/relações entre telas — só o que nomes/posições evidenciam; inferência marcada]
  Patterns:    [padrões repetidos observados: componentes, estilos, estruturas]
  States:      [estados representados no canvas — apenas os desenhados]
  Limitations: [o que a leitura não alcançou — campo obrigatório, nunca omitido]
```

Regras do snapshot:

1. **Proporcional ao escopo** (Scope block): inspeciona-se o que o review vai criticar e o mínimo de vizinhança necessária.
2. **É evidência, não verdade:** o conteúdo entra como `EVIDENCE` com fonte "Paper canvas inspection". O canvas mostra o quê, não o porquê (Source Priority da Product Context Skill): `Sequence` e relações entre telas derivadas de nomes/posições são inferência — marcadas como `ASSUMPTION`, nunca tratadas como fluxo observado (disciplina dos cenários D/E).
3. **Estados:** `States` registra apenas o que está desenhado; ausência no canvas ≠ ausência no produto (Failure Condition 4 da Interaction Design Skill) — estados não representados vão a `Limitations` e a Unknowns, com Confidence honesta.
4. **`Limitations` cumpre para o canvas o papel do Layer Coverage no report:** ausência declarada, nunca silenciosa — inclui o não-validável objetivamente (ex.: contraste real sem valores legíveis — `standards/accessibility-baseline.md`), o comportamental que um canvas estático não mostra, e o que a integração não expôs.
5. **Uma leitura, vários consumidores:** o snapshot alimenta o Brief (evidência de canvas — STEP 4 da Product Context Skill) e a crítica (STEP 3 da Design Critique Skill; cadeia de interação da Interaction Design no que o canvas evidencia) — sem releituras divergentes do mesmo estado.

## Critique Orchestration

O STEP 4 aciona a Design Critique Skill para varrer as nove camadas do `standards/critique-framework.md` — L0 Product Intent · L1 User Flow · L2 Information Architecture · L3 Interaction · L4 Content · L5 Visual Hierarchy · L6 System Consistency · L7 Accessibility · L8 States & Edge Cases — **quando aplicáveis** ("Not a Checklist" da skill): camada relevante ao escopo é varrida; varrida não significa com achado, e não há cota de issues.

### Gate de evidência por camada

Antes de julgar cada camada, o material disponível (Canvas Snapshot, artefato textual/imagem, Brief) é confrontado com o que a camada exige:

- **Evidência suficiente** → camada avaliada (`evaluated`), achados pelo contrato de 7 campos.
- **Evidência parcial** → julgamento entra com `Confidence` reduzida e a limitação nomeada no próprio achado (cenário F da skill), com a validação necessária na Recommendation.
- **Evidência insuficiente** → *not enough evidence*: a camada entra no Layer Coverage como `not-evaluable — [o que faltou]`, e o que a destravaria vai a Recommended Next Steps. **Nenhum achado é fabricado para a camada "render".**

O gate aplicado aos casos típicos:

- **Contraste (L7):** sem valores de cor legíveis (`Properties` vazio ou na lista de `Limitations` do snapshot), contraste real não é validável — vale a regra de honestidade do `standards/accessibility-baseline.md`: registra-se o não-validável como pendência de verificação; não se inventa problema de contraste **nem se assume aprovação**.
- **Fluxo (L1):** tela isolada (cenário D) → L1 `not-evaluable` ou limitada ao que a tela evidencia; `Sequence` inferida do snapshot nunca sustenta sozinha um achado de fluxo.
- **Intent (L0):** Brief sem núcleo definido → L0 `not-evaluable` (regra do próprio framework); intenção do produto jamais é inventada para viabilizar a camada.

**Falsa precisão é falha nas duas direções:** fabricar achado sem evidência suficiente e apresentar camada não verificada como avaliada (ou aprovada) são a mesma violação. O Layer Coverage declara o estado real de cada camada — "nenhum achado" só é dito de camada efetivamente avaliada.

### Roteamento da Interaction Design

A Interaction Design Skill (`skills/interaction-design/SKILL.md`) entra em dois regimes:

- **Automático, pelo escopo** (Scope block): `Type: flow`, tarefa multi-tela (`frame-set` ou seleção que atravessa uma tarefa) ou sequência de interação declarada como objeto — o território comportamental é o próprio alvo do review, não um detalhe dele.
- **Sob demanda, pelo cheiro comportamental:** em qualquer outro escopo, quando a varredura da Design Critique encontrar fluxo crítico, estados suspeitos ou recuperação de erro mal resolvida (regra de roteamento da própria skill).

O que ela decompõe — pelo método dela (cadeia de interação e Flow Analysis; nada é replicado aqui): sequência · continuidade da tarefa · feedback · estados · transições · reversibilidade · prevenção de erro · recuperação · dependências · permissões · gargalos · redundâncias.

### Consolidação — um problema, um achado

A consolidação é o **STEP 5**: o conjunto bruto de achados — das duas skills, de todas as camadas e telas — é depurado antes do Quality Gate e do report. Crítica automatizada tende a inflar listas; este estágio existe para impedir isso: **uma boa revisão com 8 problemas relevantes vale mais que uma revisão artificial com 37 observações repetitivas — sinal sobre volume, sempre; volume não é rigor** (regra 7 do critique-framework).

Quando as duas skills identificam o mesmo problema:

1. **Um diagnóstico só:** consolidar na camada causal — cada achado tem exatamente uma Category (contrato do achado); as manifestações vistas por cada skill entram como evidência do mesmo bloco. Duas issues iguais no report é falha de consolidação, não rigor dobrado.
2. **Evidência mais forte preservada:** o campo Evidence cita primeiro a evidência mais forte (observação direta > inferência > hipótese); a mais fraca complementa, nunca substitui. A Confidence do achado consolidado deriva da evidência mais forte preservada.
3. **A maior severidade só permanece se justificada** pelas quatro lentes do `standards/severity-framework.md`; sem justificativa que sobreviva às lentes, vale a menor — regra de desempate do próprio framework (inflação destrói a escala).
4. Os campos de extensão comportamental (Trigger, Current/Expected Behavior, Missing State) enriquecem o achado consolidado quando esclarecem — nunca justificam um segundo bloco para o mesmo problema.

E sobre o conjunto inteiro, independentemente da origem:

5. **Duplicatas removidas, equivalentes agrupados:** o mesmo sintoma observado em várias telas ou camadas é agrupado em um único achado na camada causal, com as manifestações listadas — nunca N blocos repetidos (regras 5 e 10 do critique-framework).
6. **`Low` agregados:** achados `Low` que compartilham causa ou não mudam a próxima ação do time entram em linha única agregada; bloco individual só quando a correção é acionável isoladamente (regra 7).
7. **Ordenação por prioridade:** severidade primeiro (`Critical` → `Low`); dentro do mesmo nível, desempate por **impacto → confiança → alcance**; `Opportunity` sempre separada, ao final. A ordem do report é a ordem de ataque recomendada.

## Issue Model

Toda issue do review usa o **contrato canônico já existente** — o bloco Design Issue de `standards/design-output-format.md` sob as regras do contrato do achado de `standards/critique-framework.md`. Nenhum formato paralelo: o bloco abaixo é o mesmo contrato, restatado com a disciplina de cada campo explicitada para o review.

```text
Issue:          [o problema, em uma frase direta]
Category:       [L0–L8 — a camada causal, exatamente uma]
Severity:       [Critical | High | Medium | Low | Opportunity]
Confidence:     [High | Medium | Low]
Evidence:       [o que no artefato, snapshot ou contexto sustenta o diagnóstico — citável]
User Impact:    [consequência potencial, com a dimensão atingida nomeada]
Recommendation: [correção proposta — específica, proporcional, acionável, contextual]
```

Disciplina por campo:

- **Issue** — descrição direta do problema, em uma frase; o diagnóstico, não a solução.
- **Severity** — exclusivamente os cinco tokens, decididos pelas quatro lentes do `standards/severity-framework.md`; `Opportunity` sempre separada dos problemas, nunca em contagem de defeitos.
- **Evidence** — o que no Canvas Snapshot, no artefato ou no Brief sustenta o diagnóstico. **Princípio abstrato nunca é a única evidência:**

  ```text
  Fraco:  "Isso viola boas práticas."
  Melhor: "O fluxo exige que o usuário confirme a exclusão sem informar
           quais dados serão permanentemente removidos."
  ```

  Princípios (`standards/uxco-design-principles.md`) qualificam a evidência observada — não a substituem.
- **User Impact** — a consequência potencial, nomeando a dimensão atingida: usuário, tarefa, negócio, compreensão, erro ou acessibilidade. "Fica ruim" não é impacto (regra 2 do critique-framework); impacto de negócio sem fato de negócio no contexto é inferência — declarada como tal.
- **Confidence** — a escala de `standards/design-output-format.md` aplicada ao review: `High` = evidência direta no canvas e/ou no contexto; `Medium` = evidência razoável com informação importante ausente; `Low` = hipótese que merece validação — e a validação necessária vai na Recommendation.
- **Recommendation** — responde ao problema identificado, nunca a outro: **específica** (o que mudar, onde), **proporcional** ao problema (correção pontual não vira redesign), **acionável** (o time sabe o que fazer ao ler) e **contextual** (padrões existentes do produto antes de padrões novos — CLAUDE.md §3.5). Recomendação genérica ("melhorar a usabilidade", "deixar mais claro") é falha de contrato.

### Severity Engine

A classificação de severidade vem **integralmente** de `standards/severity-framework.md` — definições dos cinco níveis, quatro lentes (impact × reach × task criticality × recoverability), desempates e pisos. O workflow **não define uma segunda escala concorrente**; o papel dele é fornecer às lentes os insumos que o review produz:

- **task criticality** vem do Brief — a tarefa real do usuário (`CONFIRMED`/`EVIDENCE`); sem esse contexto, o que cai é a Confidence do julgamento, nunca sobe a severidade por suposição;
- **reach** vem do contexto quando conhecido (fluxo principal diário ≠ configuração rara);
- **recoverability** vem do observado no artefato/snapshot — estados de erro, undo, caminhos de volta;
- os **pisos permanecem invioláveis**: violação do baseline de acessibilidade e risco de perda de trabalho/dados nunca abaixo de `High`; excludente → `Critical`;
- na dúvida entre dois níveis, **o menor** — inflação destrói a escala.

**Severity ≠ Confidence — os conceitos nunca se misturam.** Severidade responde "quão grave é se eu estiver certo"; Confidence responde "quão certo estou" (`standards/design-output-format.md`) — variam de forma independente:

```text
Severity:   Critical
Confidence: Low
```

é combinação legítima: impacto potencial enorme com evidência que ainda precisa ser validada — o achado entra com a validação necessária na Recommendation. Incerteza **jamais rebaixa severidade silenciosamente**, e gravidade jamais inflaciona certeza.

## Adversarial Quality Engine

O diagnóstico consolidado do STEP 5 **não é a conclusão do review** — é o material que a camada adversarial vai atacar. Contratos em `standards/adversarial-quality.md` (records, marcadores, escalas); responsabilidades em `agents/design-critic.md` e `agents/design-qa.md`. Esta seção orquestra; não redefine método algum.

### Fronteira — quem pergunta o quê

Quatro responsabilidades encadeadas, não quatro personas. Cada uma recebe um artefato e produz um artefato:

| Estágio | Objeto | Pergunta | Produz |
| --- | --- | --- | --- |
| **Initial Analysis** (STEP 4–5) | O design | Quais problemas existem neste design? | Conjunto consolidado de achados |
| **Adversarial Critique** (STEP 6) | O diagnóstico | Onde ele está errado, incompleto, superficial ou confiante demais? | Adversarial Critique Record |
| **Revision** (STEP 7) | Os vereditos | Qual é o diagnóstico único que sobrevive? | Diagnóstico revisado |
| **Review QA** (STEP 8) | O review | Ele é confiável o suficiente para ser entregue? | Review QA Record |

A separação que importa: a Design Critique olha a interface; o Critic olha a Design Critique; o QA olha o resultado dos dois. **O Critic não repete a varredura L0–L8** e **o QA não produz crítica de design** — violar isso transforma a camada em três reviews empilhados, que é exatamente o que ela existe para evitar.

### Ciclo único

```text
MÁXIMO: 1 adversarial critique · 1 revision · 1 final QA
```

Invariante, não configuração (`standards/adversarial-quality.md`): nenhuma recursão, nenhum agente debatendo, nenhum número variável de passadas. QA reprovando **não** dispara novo ciclo — o blocker de qualidade é declarado no report e a decisão volta ao usuário. Diagnóstico inicial vazio **não** dispensa o ciclo: é o caso em que a pergunta do Critic mais importa.

### Observabilidade — stage trace

Cada estágio registra o seu marcador canônico, e o conjunto sobe ao report como `Stage trace`:

```text
INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA
```

Marcador é registro de estágio **executado**, nunca pretendido: declarar `ADVERSARIAL_REVIEW` sem ter desafiado o diagnóstico é fabricação de evidência de processo — Failure Condition 9. O trace declara que o estágio aconteceu e o que ele mudou em números; **não expõe raciocínio interno** (regra 6 do record).

### Revision — um diagnóstico só

O STEP 7 é o estágio que impede o pior resultado possível desta camada: **entregar duas análises contraditórias e deixar a reconciliação para o usuário**. A Revision consome os vereditos e produz um único conjunto de issues:

| `Verdict` do record | Efeito na Revision |
| --- | --- |
| `confirmed` | O achado permanece como está — resistir ao desafio é preservação, não inércia |
| `revised` | Os campos mudam conforme `Change`, na notação `Campo: antes → depois`; a issue continua sendo uma |
| `rejected` | A issue **sai de Issues**; havendo suspeita legítima sem evidência, reaparece em `Unknowns and Assumptions` como Open Question — nunca como problema afirmado |
| `added` | A omissão entra como issue nova, no contrato pleno de 7 campos — sem desconto de evidência |

Depois de incorporar os vereditos, a Revision **reaplica os mecanismos existentes ao conjunto resultante**, porque ele mudou: a Consolidação (dedupe por causa, `Low` agregados) e a ordenação por prioridade do STEP 5, com severidade pelas quatro lentes do `standards/severity-framework.md`. Reaplicar não é um segundo ciclo adversarial — é o mesmo estágio determinístico sobre um conjunto novo.

Falsificadores registrados pelo Critic (todo achado que sobrevive com `Confidence` abaixo de `High`) viram **validação pendente**: na Recommendation do achado ou em Recommended Next Steps. O que o Critic descobriu nunca fica só no record.

### Review QA — gate de qualidade do review

O STEP 8 audita o review pelas sete dimensões do `standards/adversarial-quality.md` — Context Grounding · Evidence Quality · Severity Calibration · Actionability · Completeness · Accessibility Coverage · System Consistency —, em `PASS | PARTIAL | FAIL | UNKNOWN`, **sem nenhum score composto**: média de tokens de conduta seria exatamente a falsa precisão que esta camada combate.

Os dois blockers que o review carrega **nunca se confundem**:

| Blocker | O que reprova | Onde vive |
| --- | --- | --- |
| **Design blocker** | O design avaliado (achado `Critical`, piso de acessibilidade violado) | Quality Gate — STEP 9, `standards/quality-framework.md` |
| **QA blocker** | O **review** (dimensão em `FAIL`) | `QA Blockers` do Review QA Record — STEP 8 |

Review impecável sobre design reprovado é `REVIEW READY` com gate reprovado. Review frágil sobre design bom é `REVIEW NOT READY` com gate aprovado — e aí o próprio veredito do gate sai qualificado pela ressalva, porque foi produzido por um review que não se sustenta.

## Safety Model

1. **O review inteiro é operação `READ`** (CLAUDE.md §6): este workflow nunca escreve no canvas, nunca altera a memória do projeto e nunca corrige o que criticou. Recomendar é o limite — execução de mudanças pertence a workflows futuros, com as aprovações que o Action Safety Model exigir. A camada adversarial **não abre exceção**: Critic e QA também são integralmente `READ` — eles revisam o diagnóstico, nunca o design.
2. Canvas como fonte exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1; state machine em `docs/architecture.md`). Canvas indisponível **não aborta o review**: a limitação é registrada e o review prossegue com as fontes restantes — ou pede ao usuário uma fonte observável alternativa quando o canvas era a única.
3. Registro de decisão relevante nascida do review (ex.: aceite explícito de risco de um blocker) segue o §3.12 da constituição — bloco Design Decision, nunca escrita silenciosa em memória alheia.

## Skill Dependencies

Tudo consumido **por referência** — nada redefinido (CLAUDE.md §9.2):

| Dependência | Papel no workflow |
| --- | --- |
| `skills/product-context/SKILL.md` | Context Engine — produz o Brief (STEPs 2–3) |
| `skills/design-critique/SKILL.md` | Varredura L0–L8 e report (STEP 4) |
| `skills/interaction-design/SKILL.md` | Decomposição comportamental (STEP 4, via Roteamento) |
| `agents/design-critic.md` | Responsabilidade adversarial — desafia o diagnóstico (STEP 6) |
| `agents/design-qa.md` | Auditoria da qualidade do review (STEP 8) |
| `scripts/context-loader.mjs` | Inventário mecânico da memória (`npm run context:load`) |
| `standards/product-context-brief.md` | Contrato do Brief e do seu consumo |
| `standards/critique-framework.md` | Camadas, contrato do achado, contrato do report |
| `standards/adversarial-quality.md` | Records, marcadores de estágio, escala do QA e ciclo único (STEPs 6–8) |
| `standards/severity-framework.md` | Escala e lentes de severidade |
| `standards/quality-framework.md` | Dimensões, notas e gates de aprovação do design (STEP 9) |
| `standards/design-output-format.md` | Blocos de saída e escala de Confidence |
| `standards/accessibility-baseline.md` | Piso de acessibilidade (L7) e limites de verificação |
| `standards/uxco-design-principles.md` | Princípios que qualificam evidência e recomendações |

## Process

Sequência obrigatória — nenhum STEP é pulado em silêncio; a profundidade de cada um é proporcional ao escopo (CLAUDE.md §2):

```text
STEP 0  Resolve scope and target
STEP 1  Preflight & Paper Inspection (condicional — apenas quando o canvas é fonte)
STEP 2  Context phase — Product Context Skill → Product Context Brief
STEP 3  Context gate — aplicar a Execution Recommendation do Brief
STEP 4  Initial Analysis — Design Critique (+ Interaction Design) → achados   [INITIAL_ANALYSIS]
STEP 5  Consolidation — deduplicar, agrupar, priorizar (sinal sobre volume)   [INITIAL_ANALYSIS]
STEP 6  Adversarial Critique — Design Critic desafia o diagnóstico          [ADVERSARIAL_REVIEW]
STEP 7  Revision — vereditos incorporados em um diagnóstico só                       [REVISION]
STEP 8  Review QA — Design QA audita a qualidade do review                           [FINAL_QA]
STEP 9  Quality Gate — avaliação formal do design pelo quality-framework
STEP 10 Report — Design Critique Report completo, com Quality Gate e Review Assurance
```

### Pipeline canônico — mapa dos 17 estágios

Os STEPs implementam o pipeline canônico do review. O mapa preserva as dependências reais, não a numeração literal — em particular, a inspeção do Paper precede a construção do Brief porque o Canvas Snapshot é evidência de canvas do próprio Brief:

| Estágio canônico | Onde vive |
| --- | --- |
| 1. Receive review request | STEP 0 (entrada via Trigger) |
| 2. Detect scope | STEP 0 (Scope Resolution → Scope block) |
| 3. Load project context | STEP 2 (Context Loader — fase mecânica) |
| 4. Inspect Paper | STEP 1 (Paper Inspection → Canvas Snapshot) |
| 5. Build Context Brief | STEP 2 (Product Context Skill → Brief; gate no STEP 3) |
| 6. Run Design Critique | STEP 4 (varredura L0–L8 sob o Gate de evidência) |
| 7. Run Interaction Design when relevant | STEP 4 (Roteamento da Interaction Design) |
| 8. Normalize findings | STEP 4 (Issue Model — contrato de 7 campos) |
| 9. Classify severity | STEP 4 (Severity Engine) |
| 10. Assign confidence | STEP 4 (Issue Model — ortogonal à severidade) |
| 11. Deduplicate findings | STEP 5 (Consolidação) |
| 12. Prioritize issues | STEP 5 (ordenação: severidade → impacto → confiança → alcance) |
| 13. Challenge the diagnosis | STEP 6 (Design Critic → Adversarial Critique Record) |
| 14. Revise the diagnosis | STEP 7 (Revision — vereditos incorporados, mecanismos do STEP 5 reaplicados) |
| 15. Audit review quality | STEP 8 (Design QA → Review QA Record) |
| 16. Generate report | STEP 9–10 (Quality Gate + Composição do report) |
| 17. Present next steps | STEP 10 (Recommended Next Steps amarrados às issues) |

- **STEP 0 — Resolve scope and target.** Identificar o artefato observável e resolver o escopo pela ordem de precedência de Scope Resolution (explícito → seleção ativa → contexto → ambiguidade sinalizada). Dois gaps blocking possíveis aqui: artefato ausente (pedir a fonte, nunca reviewar de memória) e ambiguidade de escopo entre múltiplos candidatos plausíveis (perguntar listando os candidatos, nunca escolher por palpite).
- **STEP 1 — Preflight & Paper Inspection (condicional).** Somente quando o canvas for fonte: percorrer o Agent Preflight até `PAPER_READY` (docs/architecture.md); qualquer outro estado bloqueia a leitura do canvas e é reportado com a ação de correção. Com `PAPER_READY`, executar a inspeção e consolidar o **Canvas Snapshot** (seção Paper Inspection), com `Limitations` preenchido. Fontes textuais e imagens não exigem preflight.
- **STEP 2 — Context phase.** Executar a Product Context Skill pelo seu processo integral (STEPs 1–10 dela), usando `npm run context:load -- <projectPath>` quando houver caminho de memória. A saída é o **Product Context Brief** — emitido mesmo com memória `MISSING` (o Brief honesto sobre ausência também é Brief). Quando o canvas é fonte, o Canvas Snapshot do STEP 1 serve de evidência de canvas para o Brief (STEP 4 da skill) — sem releitura. Se um Brief atual do mesmo escopo já existir na sessão, reutilizá-lo é permitido — declarando a reutilização.
- **STEP 3 — Context gate.** Ler o Context Status do Brief e aplicar o contrato de consumo (`standards/product-context-brief.md`) sob a Política de bloqueio (Context Integration):
  - `PROCEED` ou `PROCEED WITH ASSUMPTIONS` → seguir ao STEP 4, herdando as premissas como premissas (nunca promovidas a fato).
  - `REQUEST BLOCKING CONTEXT` → apresentar as blocking questions — e, **por padrão, continuar mesmo assim**: a crítica prossegue nas camadas que não dependem das respostas (cenário C da Design Critique Skill: L0 `not-evaluable`, Confidence rebaixada onde depender de task criticality), com as perguntas abertas visíveis no report. Isso respeita o contrato do Brief: o que as blocking questions bloqueiam é o julgamento que depende delas, não as camadas observáveis. **Interromper é exceção**: reservada a quando a ausência tornaria a análise potencialmente enganosa mesmo com limitações declaradas — nesse caso o review para nas perguntas, explicando por que prosseguir seria pior que esperar. **Inventar respostas nunca é saída.**
- **STEP 4 — Initial Analysis (`INITIAL_ANALYSIS`).** Executar a Design Critique Skill sobre o artefato — o Canvas Snapshot, quando a fonte for o Paper —, com o Brief como contexto (Context Integration da skill), varrendo L0–L8 sob o Gate de evidência por camada (Critique Orchestration). A Interaction Design Skill entra pelo Roteamento da Critique Orchestration — automática para escopo de fluxo, tarefa multi-tela ou sequência de interação; sob demanda diante de cheiro comportamental — e os achados das duas skills passam pela Consolidação: um problema, um achado, no mesmo contrato de 7 campos.
- **STEP 5 — Consolidation (`INITIAL_ANALYSIS`).** Antes de qualquer desafio, nota ou relatório, o conjunto bruto de achados passa pela Consolidação (contrato em Critique Orchestration): duplicatas removidas, equivalentes agrupados pela causa, conflitos de severidade resolvidos pelas lentes, evidência mais forte preservada, `Low` não acionáveis agregados e o conjunto ordenado por prioridade. O que sai daqui é o **diagnóstico inicial** — o objeto do STEP 6, não a conclusão do review. O Quality Gate pontua o conjunto **consolidado**, nunca o bruto.
- **STEP 6 — Adversarial Critique (`ADVERSARIAL_REVIEW`).** Acionar o **Design Critic** (`agents/design-critic.md`) sobre o diagnóstico inicial, com o mesmo artefato e o mesmo Brief em mãos: os dez eixos de desafio perguntados, veredito por achado (`confirmed | revised | rejected | added`) e saída no **Adversarial Critique Record** (`standards/adversarial-quality.md`). **Confirmar tudo é resultado válido** — não há cota de mudanças, e fabricar revisão para o estágio parecer produtivo é Failure Condition 10. Diagnóstico inicial vazio não dispensa o estágio: a pergunta vira "o que deixamos de ver?".
- **STEP 7 — Revision (`REVISION`).** Incorporar os vereditos em **um único** diagnóstico (contrato na seção Revision — um diagnóstico só): confirmados preservados, revisados alterados campo a campo, rejeitados removidos de Issues (e devolvidos a `Unknowns and Assumptions` quando restar suspeita legítima), omissões incluídas no contrato pleno de 7 campos. O conjunto resultante mudou, então os mecanismos do STEP 5 são **reaplicados** a ele — consolidação e ordenação por prioridade —, e os falsificadores registrados pelo Critic viram validação pendente na Recommendation ou nos next steps. **O usuário nunca recebe dois diagnósticos:** análise contraditória lado a lado é Failure Condition 11.
- **STEP 8 — Review QA (`FINAL_QA`).** Acionar o **Design QA** (`agents/design-qa.md`) sobre o review pronto: sete dimensões em `PASS | PARTIAL | FAIL | UNKNOWN`, sem score composto, QA Blockers em lista própria e veredito (`REVIEW READY | REVIEW READY WITH RESERVATIONS | REVIEW NOT READY`). Reprovação **não dispara novo ciclo** (Ciclo único): é declarada no report. O QA não varre L0–L8 e não abre issue de design — lacuna encontrada é falha de `Completeness` nomeada.
- **STEP 9 — Quality Gate.** Review formal é avaliação formal: aplicar o `quality-framework.md` ao **design** — nota por dimensão derivada do pior achado do diagnóstico **revisado**, dimensões críticas (★) avaliadas no nível do escopo, `UNKNOWN` onde não houver informação, e o veredito dos três gates (média ≥ 4; críticas ≥ 3; nenhum blocker aberto). Blocker aberto reprova independentemente da média; só sai por correção verificada ou aceite explícito de risco registrado como `DECISION`. Design blocker e QA blocker permanecem separados (seção Review QA).
- **STEP 10 — Report.** Emitir o **Design Critique Report** completo (`standards/critique-framework.md`), incluindo a seção Quality Gate com o veredito, a seção **Review Assurance** com o stage trace e o veredito do QA, o Context citando o Brief e seu Context Status, Layer Coverage integral e Recommended Next Steps priorizados por impacto. As Issues são **as revisadas, e só elas**. Autocrítica antes da entrega: as Quality Checklists das skills e das responsabilidades envolvidas, e o Quality Gate da constituição (§8).

## Output

A saída é **exclusivamente** o Design Critique Report no contrato de `standards/critique-framework.md`, com as seções **Quality Gate** e **Review Assurance** sempre presentes (é o que distingue o review formal da crítica pontual). O Brief que o alimentou acompanha o report — íntegro ou referenciado, quando já entregue na sessão —, e os dois records da camada adversarial seguem a mesma regra: acompanham ou ficam referenciados, **nunca colados dentro das Issues**. Resumo conversacional pode acompanhar, nunca substituir.

O report não cresce porque a camada adversarial existe: ela entrega um diagnóstico **melhor**, não um diagnóstico maior. O que sobe ao report é o bloco compacto de `Review Assurance`; o detalhe vive nos records.

### Composição do report

O output canônico do `/uxco-review` é o contrato oficial — nenhuma seção paralela é criada. O molde operacional de preenchimento vive em `templates/reports/design-review.md` (contrato de saída, não texto rígido; em divergência, o contrato prevalece). O mapa, auditável:

| Conteúdo canônico do review | Onde vive no contrato oficial |
| --- | --- |
| Executive Summary | `## Executive Summary` |
| Review Scope | Campo `Scope` — o Scope block íntegro (o que foi revisado, frames/telas em `Includes`, origem em `Source`) |
| Context Snapshot | Campo `Context` — Context Status do Brief + assumptions e lacunas relevantes |
| Critical · High · Medium · Low Issues | `## Issues`, ordenadas `Critical → Low` (subtítulos por severidade quando houver volume) |
| Opportunities | `## Opportunities` |
| Recommended Next Steps | `## Recommended Next Steps` |
| Review Limitations | `## Unknowns and Assumptions` + `## Layer Coverage` |
| Review Assurance (stage trace · contagens do desafio · veredito e blockers do QA) | `## Review Assurance` |

Disciplinas por seção:

- **Executive Summary** — cinco elementos, em prosa: o que foi analisado (fluxo/tela), o diagnóstico principal (causa dominante), quantos problemas relevantes, o risco geral e a prioridade recomendada. **Nunca apenas uma contagem** — contagem sem diagnóstico é sumário vazio.
- **Context Snapshot** — só o contexto necessário para interpretar a análise: Context Status, as assumptions que sustentam julgamentos e as lacunas que os limitam. O detalhe completo vive no Brief e em Unknowns and Assumptions — o snapshot aponta, não duplica.
- **Issues** — ordem estrita da maior para a menor prioridade: severidade primeiro; **dentro da mesma severidade, impacto → confiança → alcance**.
- **Recommended Next Steps** — **nunca lista genérica**: cada passo remete a uma issue encontrada, a uma validação pendente (achados `Low` confidence) ou ao que destravaria uma camada `not-evaluable`. A forma esperada:

  ```text
  1. Resolver o bloqueio de recuperação de pagamento.        [← issue Critical]
  2. Validar a regra do estado de pagamento pendente.        [← validação de Confidence Low]
  3. Simplificar a escolha de endereço.                      [← issue High]
  4. Revisar a microcopy secundária.                         [← Lows agregados]
  ```

  "Fazer testes de usabilidade" sem objeto não é next step — é ruído.
- **Review Limitations** — declaradas honestamente, cobrindo quatro origens: **contexto ausente** (do Brief), **dados não disponíveis pela integração** (as `Limitations` do Canvas Snapshot sobem ao report — nunca ficam só no snapshot), **suposições adotadas** (blocos Assumption) e **áreas que exigem validação humana** (achados `Low` confidence, pendências não validáveis do baseline de acessibilidade).
- **Review Assurance** — o bloco compacto de `standards/adversarial-quality.md`, nunca os records inteiros: stage trace, contagens do desafio (`N confirmed · N revised · N rejected · N added`), veredito do QA, QA blockers e reservas. As contagens precisam **fechar com o record real** — número que não corresponde a entradas existentes é fabricação de processo. Estágio que não rodou aparece declarado, com o porquê.

## Completion Criteria

O review está **completo** somente quando, simultaneamente:

1. Os 11 STEPs executados — ou o desvio declarado com o porquê (proporcionalidade ajusta profundidade, nunca pula gates).
2. Report emitido na Composição canônica, com Quality Gate presente e veredito dos gates.
3. Scope block íntegro no report, com a origem da resolução.
4. Review Limitations cobrindo as quatro origens (contexto ausente · dados não expostos pela integração · suposições · validação humana pendente).
5. Quality Checklist aprovada (a autocrítica do ciclo — CLAUDE.md §2, §8).
6. Nenhuma escrita realizada em canvas ou memória de projeto.
7. **Ciclo adversarial completo e observável:** os quatro marcadores registrados uma vez cada (`INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA`), com as contagens do desafio fechando com o Adversarial Critique Record.
8. **Um diagnóstico só:** as Issues do report são as revisadas — nenhum achado rejeitado permanece como problema afirmado, nenhuma omissão aceita ficou fora.
9. **Veredito do QA presente**, com QA Blockers explícitos quando houver — `REVIEW NOT READY` entregue como tal, nunca maquiado.

**Gate reprovado não é review incompleto:** o review que reporta a reprovação com os achados explícitos está completo — o que volta ao ciclo é o *design avaliado*, não o review.

## Failure Handling

Falhas de execução não são condições de invalidade (estas vivem em Failure Conditions): são **estados previstos, com comportamento definido** — degradar com honestidade, nunca improvisar. Cada modo abaixo aponta o mecanismo do workflow que o resolve; nada aqui redefine método. Regra transversal a todos: **a falha nunca é compensada por invenção** — nem de dados, nem de contexto, nem de método.

**Falha 1 — Paper indisponível.** O preflight do STEP 1 não alcança `PAPER_READY` (verificado por chamada real — nunca por inferência; CLAUDE.md §6.1). Análise de canvas **jamais é inventada**: nenhum campo do Canvas Snapshot é preenchido sem leitura real. Havendo outra fonte observável (fixture, imagem, descrição na conversa), o review prossegue com ela, com a fonte canvas declarada inacessível nas Review Limitations (Safety Model, regra 2). Sendo o canvas a única fonte, o review **bloqueia**, reportando exatamente:

```text
Review blocked:
Paper connection unavailable.
```

seguido da ação de correção (`npm run preflight` / Agent Preflight de `docs/architecture.md`) e do convite a fornecer uma fonte observável alternativa.

**Falha 2 — Nenhum escopo identificável.** Caso 4 da Scope Resolution: Scope block emitido com `Type`/`Name` = `UNKNOWN` e uma Open Question `Blocking: Yes` solicitando o escopo ou a fonte. A necessidade de escopo é sinalizada com o que se sabe (candidatos, quando existirem — caso 5); **nenhuma crítica é iniciada** com Scope `UNKNOWN`, e escopo nunca é inventado.

**Falha 3 — Contexto incompleto, mas suficiente.** O review **continua** (Política de bloqueio da Context Integration). O registro é obrigatório e duplo: a premissa adotada entra como `ASSUMPTION` declarada (herdada do Brief ou registrada no report, em Unknowns and Assumptions), e o **impacto na confiança** é explícito — Confidence rebaixada nas conclusões afetadas, com a dependência nomeada no próprio achado. Continuar sem registrar é a Failure Condition 4.

**Falha 4 — Contexto crítico ausente.** Bloquear é exceção, não reflexo: somente quando, **mesmo com limitações declaradas, uma análise responsável não é possível** — o review provavelmente apontaria os problemas errados ou calibraria severidades sem sentido (STEP 3; critério de blocking do CLAUDE.md §4). Nesse caso o review para nas blocking questions, explicando por que prosseguir seria pior que esperar. Inventar respostas nunca é saída; bloquear por ausência que não tornaria a análise enganosa é anti-pattern 10.

**Falha 5 — Skill ou responsabilidade indisponível.** Dependência de Skill Dependencies ausente ou ilegível (skill, **agente**, standard ou loader): falha **explícita** — nomear a dependência quebrada, o STEP que ela impediria e o que a restauraria. **Proibido executar silenciosamente uma versão genérica improvisada** do método: review sem o Critique Engine real não é review degradado, é simulação de componente — violação direta do CLAUDE.md §9.3 ("dizer que não existe — nunca simular"). A exceção já prevista permanece a única: Context Loader indisponível degrada para inventário por leitura direta, **declarado no Brief** (Preconditions).

**Falha 6 — Paper parcialmente legível.** `PAPER_READY` alcançado, mas leituras parciais — chamadas recusadas, propriedades ilegíveis, screenshot indisponível. Executar **apenas as análises sustentadas pelos dados realmente obtidos**: o Gate de evidência por camada decide o destino de cada uma (`evaluated` · Confidence reduzida · `not-evaluable — [o que faltou]`), e dado que a integração não retornou jamais é inventado (Paper Inspection). As limitações são registradas em `Limitations` do Canvas Snapshot e **sobem às Review Limitations do report** — nunca ficam só no snapshot.

**Falha 7 — Diagnóstico inicial vazio.** O STEP 5 entrega zero achados. Isso **não encerra o review** nem dispensa a camada adversarial: o STEP 6 roda com a pergunta invertida — "o que a varredura deixou de ver?" —, e `Missing Findings` é a saída esperada. Se o Critic também não encontrar nada, o report sai com zero issues, `Nenhuma issue identificada` declarado no Executive Summary e o Layer Coverage mostrando **por que** cada camada não produziu achado (`evaluated` sem achado é diferente de `not-evaluable`). Ausência de achados declarada com cobertura honesta é resultado legítimo; ausência de achados por varredura cega é Failure Condition 8.

**Falha 8 — QA reprovando o review.** `REVIEW NOT READY` com QA Blocker aberto. O comportamento é **declarar, não reprocessar** (Ciclo único): o report é entregue com o blocker visível em `Review Assurance`, e o veredito do Quality Gate sai explicitamente qualificado — produzido por um review que o próprio QA considera não confiável naquela dimensão. Nenhum segundo ciclo é iniciado, nenhuma reprovação é escondida, e a decisão sobre o que fazer volta ao usuário.

## Failure Conditions

O review é **inválido** — refazer, não entregar — se:

1. Review executado sem artefato observável (crítica de memória ou de suposição).
2. Escopo inventado: ambiguidade entre candidatos plausíveis resolvida por palpite em vez de sinalizada (Scope Resolution violada) — ou seleção/pedido explícito ignorados em silêncio.
3. STEP 2 pulado ou fabricado: crítica formal sem Brief, ou Brief inventado para viabilizar L0.
4. Blocking question respondida por invenção; conclusão afetada por contexto ausente entregue sem a redução explícita de Confidence e a limitação declarada; ou review interrompido por ausência de informação que não tornaria a análise enganosa (bloqueio indevido — anti-pattern 10).
5. Qualquer escrita em canvas ou memória de projeto durante o review.
6. Report formal sem a seção Quality Gate, ou gate reprovado entregue como aprovado / com ressalvas escondidas (CLAUDE.md §8).
7. Qualquer Failure Condition das skills consumidas (elas permanecem válidas dentro do workflow).
8. Falsa precisão no Layer Coverage: achado fabricado para camada sem evidência suficiente, ou camada não verificada apresentada como avaliada ou aprovada (violação do Gate de evidência por camada).
9. **Ciclo adversarial pulado ou fabricado:** report formal sem `Review Assurance`; marcador registrado sem o estágio ter acontecido; ou contagens que não fecham com o Adversarial Critique Record.
10. **Mudança fabricada pelo Critic:** achado revisado, rejeitado ou adicionado sem base observável — inclusive rejeição que não nomeia qual evidência falta, e omissão afirmada como issue sem evidência citável. Simétrico: ressalva de QA inventada para o estágio parecer produtivo.
11. **Diagnóstico contraditório entregue:** duas análises anexadas lado a lado, achado rejeitado sobrevivendo como problema afirmado, ou Issues do report divergindo do conjunto revisado do STEP 7.
12. **Mais de um ciclo adversarial:** segunda passada de Critic, Revision ou QA; QA reabrindo o Critic; ou qualquer forma de reflexão recursiva (violação do Ciclo único).
13. **Confusão entre os dois blockers:** QA blocker apresentado como reprovação do design, design blocker apresentado como falha do review, ou `REVIEW NOT READY` entregue como se o review estivesse pronto.

## Quality Checklist

Antes de entregar (etapa `critique` do ciclo aplicada ao workflow):

- [ ] Os 11 STEPs aconteceram — ou o desvio está declarado com o porquê?
- [ ] Escopo resolvido pela ordem de precedência (explícito → seleção → contexto) e declarado no report com a origem — ambiguidade real sinalizada em vez de resolvida por palpite?
- [ ] O Brief existe, tem Context Status e o gate do STEP 3 foi aplicado como o contrato manda?
- [ ] Contexto incompleto tratado pela Política de bloqueio: review continuou com Confidence rebaixada e limitações declaradas nas conclusões afetadas — e interrupção usada somente diante de análise potencialmente enganosa?
- [ ] Blocking e non-blocking unknowns distinguidos — blocking no gate, non-blocking como pendência declarada sem interromper nada?
- [ ] Achados em contrato pleno (7 campos, tokens canônicos, disciplina do Issue Model: evidência citável — nunca só princípio —, dimensão de impacto nomeada, recomendação específica), agrupados por causa?
- [ ] Severidade pelas quatro lentes do severity-framework, pisos intactos — e ortogonal à Confidence: incerteza expressa em Confidence, nunca rebaixando severidade em silêncio?
- [ ] Gate de evidência aplicado camada a camada: *not enough evidence* virou `not-evaluable` declarado — nenhum achado fabricado, nenhuma camada não verificada dada como avaliada?
- [ ] Interaction Design acionada quando o escopo pedia (fluxo, multi-tela, sequência) — e achados das duas skills consolidados: nenhum problema em dois blocos, evidência mais forte preservada, severidade maior mantida só com justificativa?
- [ ] STEP 5 aplicado ao conjunto inteiro: sem duplicatas, `Low` agregados, ordenado por prioridade — o report entrega sinal, não volume?
- [ ] O Critic rodou sobre o diagnóstico consolidado, perguntou os dez eixos e emitiu veredito com base observável em cada entrada — sem mudança fabricada e sem cota de revisões?
- [ ] A Revision entregou **um** diagnóstico: confirmados preservados, revisados alterados campo a campo, rejeitados fora de Issues (com suspeita legítima devolvida a Open Question), omissões incluídas no contrato pleno — e os mecanismos do STEP 5 reaplicados ao conjunto novo?
- [ ] Falsificadores dos achados com `Confidence` abaixo de `High` viraram validação pendente na Recommendation ou nos next steps?
- [ ] O QA auditou as sete dimensões do review — sem score composto, com QA Blockers em lista própria — e o veredito corresponde à tabela?
- [ ] Design blocker e QA blocker estão separados, cada um no seu lugar, nenhum apresentado como o outro?
- [ ] Ciclo único respeitado: uma passada de cada, nenhuma recursão, QA reprovando declarado em vez de reprocessado?
- [ ] `Review Assurance` presente e compacto, com contagens que fecham com o record — e os records acompanhando ou referenciados, nunca dentro das Issues?
- [ ] Quality Gate presente, com dimensões críticas avaliadas ou `UNKNOWN` justificado?
- [ ] Report composto pelo mapa canônico: Executive Summary com diagnóstico (nunca só contagem), Scope block íntegro, Context Snapshot mínimo, issues em ordem estrita, next steps amarrados às issues, limitações das quatro origens consolidadas?
- [ ] Falhas de execução tratadas pela Failure Handling: canvas indisponível sem análise inventada (bloqueio canônico quando era a única fonte), skill ausente com falha explícita — nunca versão genérica improvisada —, leitura parcial limitada ao sustentável pelos dados?
- [ ] Nenhuma operação de escrita aconteceu?
- [ ] Recommended Next Steps priorizados por impacto, incluindo o que destravaria camadas `not-evaluable`?
