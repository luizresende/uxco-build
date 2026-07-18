# Product Context Skill

> **Propósito:** transformar as fontes de contexto de um projeto em um Product Context Brief — entendimento estruturado, classificado e honesto sobre o que se sabe, o que se supõe e o que falta saber.
> **Quando consultar:** sempre que uma tarefa exigir entendimento do produto antes de analisar ou desenhar; é a materialização das etapas `context` e `investigate` do ciclo (CLAUDE.md §2).

Esta skill opera sob a constituição (CLAUDE.md) e **referencia** — nunca redefine — a taxonomia de evidência (§5), o Context Protocol (§4) e os blocos de `standards/design-output-format.md`.

## Purpose

Produzir o **Product Context Brief** (formato em `standards/product-context-brief.md`): a fotografia estruturada do contexto de produto disponível, que workflows futuros (`/uxco-review`, `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa`) consumirão como entrada.

A skill responde a uma pergunta: **"o que sabemos sobre este produto, com que grau de certeza, e o que falta saber para trabalhar com responsabilidade?"** Ela não resolve problemas de design, não propõe soluções e não altera nenhuma fonte — é estritamente leitura e análise.

## When to Use

- No início de qualquer tarefa de design que dependa de contexto de produto ainda não estabelecido na conversa.
- Quando o usuário pedir explicitamente o levantamento de contexto do projeto.
- Antes da execução de qualquer workflow `/uxco-*` que declare o Brief como entrada (workflows ainda não implementados — não simular).

**Quando não usar:** tarefa pontual cujo contexto já está suficiente na conversa; nesse caso, aplicar diretamente o Context Protocol (CLAUDE.md §4) sem o rito completo do Brief. Proporcionalidade é regra (CLAUDE.md §2).

## Inputs

| Fonte | O que é | Obrigatória |
| --- | --- | --- |
| Project Memory | Instância dos arquivos de `templates/project/`: `product.md`, `users.md`, `requirements.md`, `research.md`, `metrics.md`, `decisions.md`, `glossary.md` | Não — ausência é dado, não erro |
| Instrução do usuário | Contexto fornecido explicitamente pelo usuário na sessão atual | Não |
| Arquivos do repositório | Documentação, requisitos, contexto técnico e decisões registradas fora da memória estruturada | Não |
| Canvas (Paper) | Leitura do estado atual do design (somente `READ`; exige `PAPER_READY` — CLAUDE.md §6.1) | Não |
| Documentos avulsos | Arquivos indicados pelo usuário (briefs, PRDs, notas) | Não |

**Localização da Project Memory:** usar o caminho informado pelo usuário; sem indicação, procurar um diretório `memory/` na raiz do projeto de produto. Não encontrando, declarar `Project Memory: MISSING` — nunca tratar os templates de `templates/project/` como se fossem memória preenchida (são moldes, não dados).

## Source Priority

A obtenção de contexto segue esta ordem explícita:

```text
1. Project Memory  →  2. Explicit user instruction  →  3. Relevant repository files
                  →  4. Paper canvas evidence  →  5. Inference
```

O que cada fonte é — e o que ela não é:

1. **Project Memory** — contexto previamente documentado; o ponto de partida da consulta. **Não é verdade eterna:** decisões antigas podem estar desatualizadas — `Last updated` distante e sinais de mudança no produto rebaixam a confiança do conteúdo, e entradas `Active` de `decisions.md` continuam `DECISION` (respeitadas, não reabertas — CLAUDE.md §5) até o usuário revisitá-las.
2. **Explicit user instruction** — instrução explícita do usuário na sessão atual. Em **conflito claro** com contexto antigo, a instrução atual prevalece — e a substituição é declarada no Brief (qual registro ficou superado), nunca aplicada em silêncio. Conflito ambíguo não é substituição: é contradição (ver Contradiction Handling).
3. **Relevant repository files** — podem fornecer requisitos, documentação, contexto técnico e decisões anteriores registradas fora da memória estruturada. Entram com a confiança que sua origem e data permitirem.
4. **Paper canvas evidence** — evidência sobre estrutura existente, fluxos, padrões, conteúdo e componentes. **O canvas mostra o quê, não o porquê:** ele não explica o motivo das decisões — inferir intenção a partir do canvas já é inferência (nível 5), não leitura.
5. **Inference** — o que a skill deduz para preencher lacunas. **Sempre marcada explicitamente como `ASSUMPTION`; nunca apresentada como fato confirmado.** É o último recurso, usada apenas quando necessária para prosseguir.

A ordem disciplina a consulta — **não autoriza descartar fontes em silêncio**: divergência relevante entre quaisquer fontes é contradição e segue o tratamento de Contradiction Handling.

## Context Loading Process

A skill segue **obrigatoriamente** esta sequência. Os passos 1–4 são a fase **mecânica** (o Context Loader): descobrir, inventariar, carregar e organizar — proibido nesta fase interpretar o produto, inventar contexto ou tomar decisão de design. Os passos 5–9 são a fase de **análise**; o passo 10, a saída.

```text
STEP 1   Discover available context sources.
STEP 2   Read Project Memory.
STEP 3   Inspect other relevant repository files when necessary.
STEP 4   Inspect Paper when canvas context is relevant and available.
STEP 5   Extract raw facts and evidence.
STEP 6   Identify assumptions.
STEP 7   Detect contradictions.
STEP 8   Identify missing context.
STEP 9   Classify open questions.
STEP 10  Generate Product Context Brief.
```

- **STEP 1 — Discover.** Localizar a Project Memory (regra em Inputs) e mapear as demais fontes da sessão. Para cada um dos 7 arquivos de memória, registrar um status:
  - `MISSING` — arquivo não existe;
  - `EMPTY` — existe, mas sem conteúdo real (`Fill status: EMPTY` ou todas as seções `_Not filled_`);
  - `PARTIAL` — algumas seções preenchidas;
  - `FILLED` — substancialmente preenchido.
  `MISSING` e `EMPTY` são sinais distintos e ambos entram no Brief — nunca são silenciados.
- **STEP 2 — Read Project Memory.** Ler integralmente os arquivos existentes; seções `_Not filled_` são registradas como tal, não puladas.
- **STEP 3 — Repository files.** *When necessary:* inspecionar arquivos relevantes do repositório (requisitos, documentação, decisões fora da memória) quando a memória não cobrir o necessário ou a tarefa os indicar.
- **STEP 4 — Paper canvas.** *When relevant and available:* inspecionar o canvas (somente `READ`, exigindo `PAPER_READY` — CLAUDE.md §6.1). Canvas indisponível não é erro: registra-se a limitação no inventário e segue-se adiante.
- **STEP 5 — Extract.** Extrair fatos brutos e evidências das fontes carregadas, com fonte citada por item (`CONFIRMED`/`EVIDENCE`).
- **STEP 6 — Assumptions.** Identificar as premissas em jogo — as declaradas nas fontes e as que a análise precisou adotar (`ASSUMPTION`, sempre marcadas).
- **STEP 7 — Contradictions.** Cruzar as fontes ativamente (ver Contradiction Handling); registrar cada choque como `CONTRADICTION`.
- **STEP 8 — Missing context.** Identificar o que seria necessário e não existe (`UNKNOWN` — ver Missing Context Handling), incluindo dimensões sem cobertura em nenhuma fonte.
- **STEP 9 — Classify questions.** Converter gaps que merecem pergunta em Open Questions e aplicar a regra blocking/non-blocking (ver Blocking Questions).
- **STEP 10 — Generate Brief.** Emitir o Product Context Brief (`standards/product-context-brief.md`), passar pelo Quality Checklist e entregar.

**Regra transversal da sequência: nenhuma pergunta ao usuário acontece antes da busca por contexto existente** — perguntas só nascem no STEP 9, depois de as fontes terem sido descobertas, lidas e analisadas (STEPs 1–8). Pular a busca e perguntar é falha de processo, tão grave quanto inventar a resposta.

## Analysis Model

A análise percorre as fontes carregadas e produz entendimento em **13 dimensões**, agrupadas em três planos:

- **Entendimento nuclear:** problema · usuário · objetivo · JTBD · contexto de uso
- **Fronteiras do trabalho:** restrições · requisitos · métricas
- **Estado do conhecimento:** evidências · hipóteses · riscos · contradições · perguntas abertas

Regras da análise:

1. Toda afirmação relevante carrega **uma das cinco categorias** de Evidence Classification, **fonte** (arquivo e seção, ou "conversa") e **Confidence** (`design-output-format.md`) quando for julgamento.
2. Dimensão sem informação em nenhuma fonte = `UNKNOWN` declarado na dimensão — o Brief nunca omite uma dimensão por falta de dado.
3. Síntese é permitida; **criação não**: conectar dois fatos das fontes é análise; afirmar algo que nenhuma fonte sustenta é fabricação (anti-patterns 2–4).
4. Riscos derivados pela análise (não escritos nas fontes) são rotulados como inferência da skill, com a evidência que os sustenta.

## Evidence Classification

Toda informação relevante do Brief carrega **uma de cinco categorias**. Este sistema é a projeção operacional da taxonomia do CLAUDE.md §5 para contexto de produto — detalha a constituição, não a substitui (mapeamento ao final da seção).

### CONFIRMED

Informação explicitamente estabelecida por fonte confiável e **atual**.

```text
CONFIRMED
The primary user is a Product Designer.
Source: product.md
```

Exige fonte citável. Atualidade conta: registro antigo com sinais de mudança no produto deixa de ser `CONFIRMED` — rebaixa-se a categoria, nunca se presume que segue válido.

### EVIDENCE

Informação **observável** que sustenta uma interpretação — carrega fonte e método; peso proporcional à qualidade de ambos.

```text
EVIDENCE
The current onboarding contains five sequential steps.
Source: Paper canvas inspection.
```

A observação é `EVIDENCE`; a interpretação que ela sustenta é outra entrada, com categoria própria.

### ASSUMPTION

Inferência **necessária**, mas ainda não confirmada. Declarada sempre como possibilidade, nunca como certeza:

```text
ASSUMPTION
Users probably abandon the flow because of its length.
```

Não permitido sem evidência:

```text
Users abandon the flow because it is too long.
```

A linguagem denuncia a categoria: afirmação categórica exige `CONFIRMED` ou `EVIDENCE`. Hipóteses testáveis (o `HYPOTHESIS` do §5) entram aqui indicando como poderiam ser validadas.

### UNKNOWN

Informação **necessária** que ainda não existe. É nomeada e registrada — quando vira pergunta, classificada blocking/non-blocking via bloco Open Question — e jamais preenchida por invenção.

### CONTRADICTION

Duas ou mais fontes apresentam informações incompatíveis:

```text
CONTRADICTION
product.md: Primary user = Product Designer
users.md:   Primary user = Design Manager
```

A skill **não escolhe silenciosamente uma das versões** — o tratamento completo está em Contradiction Handling. Leitura conciliadora só entra dentro da entrada, rotulada como hipótese a confirmar — nunca como resolução.

### Mapeamento — fontes e taxonomia da constituição

| Sinal na fonte | Categoria |
| --- | --- |
| Item `[Confirmed]`, fato com fonte em Known Facts (`FACT` §5) | `CONFIRMED` |
| Entrada `Active` em `decisions.md` (`DECISION` §5) | `CONFIRMED` — como decisão registrada: respeitada, não reaberta |
| Entrada de `research.md` com Source/Finding (`EVIDENCE` §5) | `EVIDENCE` (peso conforme Confidence da entrada) |
| Item `[Assumed]`, seção Assumptions, item **sem marcação** | `ASSUMPTION` |
| Inferência da skill (nível 5 da Source Priority) | `ASSUMPTION` — sempre, sem exceção |
| Insight/hipótese testável (`HYPOTHESIS` §5) | `ASSUMPTION` — com a validação possível indicada |
| Item `[Unknown]`, Open Questions, seção `_Not filled_`, arquivo `MISSING`/`EMPTY` | `UNKNOWN` |
| Informações incompatíveis entre fontes ou dentro de uma fonte | `CONTRADICTION` |

Força decrescente: `CONFIRMED > EVIDENCE > ASSUMPTION > UNKNOWN`; `CONTRADICTION` é transversal — marca o choque entre entradas, qualquer que seja a categoria de cada lado. Na dúvida entre categorias, **a mais fraca** (CLAUDE.md §5). Nenhuma promoção silenciosa: elevar `ASSUMPTION` a `CONFIRMED` exige fonte nova e a mudança declarada no Brief.

## Contradiction Handling

Contradição existe quando duas informações não podem ser ambas verdadeiras — entre arquivos, dentro do mesmo arquivo, ou entre memória e conversa/canvas.

1. **Detectar ativamente:** o cruzamento entre fontes é etapa obrigatória da análise, não achado acidental.
2. **Nomear especificamente:** o que colide, onde está cada lado (arquivo/seção), e o que a colisão impede.
3. **Classificar o efeito:** contradição sobre premissa central (quem é o usuário, qual o problema) tende a ser **blocking**; sobre detalhe periférico, **non-blocking** — critério do CLAUDE.md §4.
4. **Nunca resolver em silêncio.** Escolher um lado é decisão do usuário. Leitura conciliadora plausível pode ser oferecida — rotulada como hipótese a confirmar (`ASSUMPTION` com validação indicada), nunca adotada como resolução.
5. Toda contradição aparece na seção própria do Brief, mesmo as non-blocking.

## Missing Context Handling

Ausência é informação. Três formas distintas, todas registradas:

- **Arquivo `MISSING`** — a dimensão correspondente não tem fonte persistente; vira `UNKNOWN` com origem "sem arquivo".
- **Arquivo/seção `EMPTY` (`_Not filled_`)** — o time sabe que não sabe; vira `UNKNOWN` com origem "declarado não preenchido".
- **Dimensão sem cobertura** — nenhuma fonte toca o tema; vira `UNKNOWN` detectado pela análise.

Proibido, em qualquer caso: preencher com plausibilidade, usar conhecimento genérico de mercado como se fosse dado do projeto, ou completar exemplos como conteúdo real. Contexto genérico só entra rotulado como `ASSUMPTION` da skill — e apenas quando necessário para prosseguir.

## Blocking Questions

Nem toda informação ausente interrompe o trabalho. A regra de decisão, aplicada a cada gap:

```text
If missing information fundamentally changes the problem:
    BLOCKING

If reasonable progress is possible with an explicit assumption:
    NON-BLOCKING
```

Uma pergunta é **blocking** quando a ausência da resposta pode levar o agente a **resolver o problema errado** — errar a premissa invalida o trabalho ou causa dano difícil de reverter (CLAUDE.md §4). São tipicamente blocking:

- *Who is the target user?*
- *What is the primary task?*
- *What action is the user expected to complete?*
- *Which existing flow is in scope?*

Regras de conduta:

1. **Procurar antes de perguntar.** Nenhuma pergunta é feita sem antes buscar a resposta nas fontes disponíveis (ordem da Source Priority) — perguntar o que a memória já responde é falha.
2. **Poucas e objetivas**, cada uma com o *porquê* do bloqueio. Havendo muitas candidatas, priorizar por impacto — o agente **não é uma máquina de fazer perguntas** (anti-pattern 10).
3. No Brief, cada uma usa o bloco Open Question com `Blocking: Yes`.
4. Perguntas blocking **não impedem a emissão do Brief**: ele é emitido com o veredito de prontidão refletindo o bloqueio (ver `standards/product-context-brief.md`). O que elas bloqueiam é o trabalho de design que dependeria da resposta.

## Non-Blocking Questions

Informações úteis cuja ausência **permite trabalho razoável com uma hipótese explícita** — o gap vira `ASSUMPTION` declarada e o trabalho prossegue. São tipicamente non-blocking:

- *Do we have a target completion time?*
- *Is there quantitative research?*
- *Which secondary metric should be monitored?*

No Brief, usam o bloco Open Question com `Blocking: No` e acompanham o trabalho como pendência declarada. Não interrompem nada e **não são convertidas em interrogatório ao usuário** — ficam registradas para quando houver oportunidade natural de resposta (ex.: próxima rodada de pesquisa). Quando a ausência exigir premissa para prosseguir, a premissa adotada aparece como `ASSUMPTION` vinculada à pergunta.

## Output Format

A saída é **exclusivamente** o Product Context Brief, no formato definido em `standards/product-context-brief.md` — Context Status (Completeness, Confidence, Blocking Questions, Readiness), as seções de entendimento, contradições, perguntas abertas e o inventário de fontes. As 13 dimensões da análise preenchem as seções correspondentes do Brief; `Success Criteria` deriva do cruzamento objetivo + métricas (o que "dar certo" significa antes dos números). A skill não emite formatos alternativos; resumos conversacionais podem acompanhar o Brief, nunca substituí-lo quando o Brief foi pedido.

## Failure Conditions

O Brief é **inválido** — e deve ser refeito, não entregue — se qualquer uma destas condições ocorrer:

1. Qualquer conteúdo fabricado: afirmação sem fonte apresentada como se tivesse.
2. Afirmação relevante sem categoria de Evidence Classification.
3. Contradição detectada e omitida, ou resolvida silenciosamente.
4. `UNKNOWN` preenchido com plausibilidade para o Brief "parecer completo".
5. Dimensão omitida sem declaração (nem conteúdo, nem `UNKNOWN`).
6. Templates de `templates/project/` lidos como se fossem memória do projeto.

Falhas **operacionais** (arquivo ilegível, canvas fora de `PAPER_READY`) não invalidam o Brief: são reportadas como limitação de fonte no inventário, e a análise prossegue com o que há.

## Quality Checklist

Autocrítica antes de entregar (etapa `critique` do ciclo — CLAUDE.md §2):

- [ ] Inventário cobre as 7 fontes de memória, cada uma com status explícito?
- [ ] Todas as seções do Brief estão presentes — com conteúdo ou `UNKNOWN` declarado?
- [ ] Toda afirmação relevante tem categoria + fonte citável?
- [ ] Julgamentos carregam Confidence?
- [ ] O cruzamento de fontes foi feito e as contradições listadas?
- [ ] Perguntas abertas classificadas blocking/non-blocking, com o porquê nas blocking?
- [ ] Nenhuma das Failure Conditions ocorre?
- [ ] O veredito de prontidão reflete honestamente o estado do contexto?

## Examples

**Memória rica e consistente** — trecho esperado do Brief:

```text
Problema: Gerentes de logística perdem prazo por falta de visibilidade da frota
          [CONFIRMED — product.md § Problem; sustentado por research.md "Entrevistas Q2"]
Usuário:  Gerente de logística de transportadoras médias (50–200 veículos)
          [CONFIRMED — users.md § Primary Users]
```

**Memória ausente ou vazia** — o Brief é honesto, não inventivo:

```text
Fontes: product.md MISSING · users.md EMPTY · demais MISSING
Problema: UNKNOWN — nenhuma fonte disponível
Prontidão: contexto insuficiente para design responsável; 2 perguntas blocking abertas
```

**Contradição detectada** — nunca resolvida em silêncio:

```text
CONTRADICTION
product.md § Problem:       produto B2B para gerentes de logística
users.md § Primary Users:   adolescentes em uso recreativo
Efeito: blocking — a identidade do usuário invalida ou valida qualquer decisão de design.
Conciliação possível (hipótese a confirmar): perfis distintos em dois módulos do produto.

Question:       Quem é o usuário primário real do produto?
Blocking:       Yes
Why it matters: Toda decisão de design subsequente depende desta resposta.
```
