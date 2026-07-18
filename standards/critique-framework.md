# Critique Framework

> **Propósito:** o contrato do Critique Engine — as camadas de análise de interface (L0–L8), o contrato do achado, o formato do report e as regras comuns de crítica. Define **como criticar**; o que já existe em outros standards é referenciado, nunca redefinido.
> **Quando consultar:** ao analisar criticamente qualquer interface ou fluxo; é a fonte das skills de crítica (Sprint 3).

Dependências explícitas: severidade vem de `severity-framework.md`; Confidence e o bloco Design Issue vêm de `design-output-format.md`; dimensões, escala e gates vêm de `quality-framework.md`; o piso de acessibilidade de `accessibility-baseline.md`; o contexto de produto do Product Context Brief (`standards/product-context-brief.md`).

## Camadas de análise (L0–L8)

A crítica varre a interface em nove camadas, **da mais estrutural para a mais superficial** — porque um sintoma numa camada alta frequentemente tem causa numa camada baixa, e a ordem força a busca da causa antes do sintoma (regra 10).

| Camada | O que examina | Pergunta-chave |
| --- | --- | --- |
| **L0 — Product Intent** | Aderência da interface ao problema, usuário e objetivo declarados no contexto | Isto deveria existir — e existir assim — para este produto e este usuário? |
| **L1 — User Flow** | O caminho da tarefa: passos, ordem, entradas, saídas, becos sem saída | O usuário chega ao fim da tarefa pelo caminho mais curto razoável, sem se perder? |
| **L2 — Information Architecture** | Organização, agrupamento, nomeação e navegação | A informação está onde o usuário espera encontrá-la, com os nomes que ele usa? |
| **L3 — Interaction** | Affordances, feedback, controles, comportamento dos elementos interativos | Toda ação tem resposta perceptível e comportamento previsível? |
| **L4 — Content** | Linguagem, rótulos, microcopy, vocabulário do produto | Os textos orientam, no vocabulário do usuário, sem ambiguidade? |
| **L5 — Visual Hierarchy** | Direcionamento da atenção; proeminência × importância | O olhar encontra primeiro o que mais importa? A ação primária domina? |
| **L6 — System Consistency** | Coerência interna e com convenções da plataforma | O mesmo problema é resolvido do mesmo jeito em todo lugar? |
| **L7 — Accessibility** | As 10 áreas de `accessibility-baseline.md` | O piso foi verificado — e o não-validável está declarado? |
| **L8 — States & Edge Cases** | Vazio, carregando, erro, parcial, volumes extremos, textos longos | O que acontece quando está vazio, falha, demora ou transborda? |

### Desambiguação entre camadas

Um achado que caiba em mais de uma camada é registrado **uma vez, na camada mais estrutural em que a causa vive** (menor número). As fronteiras que mais confundem:

- **L2 × L4** — nomeação estrutural (navegação, agrupamentos, o nome das coisas no sistema) é L2; microcopy e linguagem instrucional (mensagens, instruções, tom) é L4.
- **L3 × L8** — estados de um **elemento** interativo (hover, pressed, disabled, focus) são L3; estados da **tela/sistema** (vazio, erro, carregando, parcial) são L8.
- **L5 × L7** — contraste/tamanho que afeta proeminência relativa é L5; quando fere o piso de `accessibility-baseline.md`, é **sempre L7**, qualquer que seja a manifestação visual.

### Relação com as dimensões do quality-framework

Camadas organizam a **varredura** (o que olhar, em que ordem); as dimensões do `quality-framework.md` organizam a **avaliação** (como pontuar e aprovar). O mapeamento:

```text
L0 → Context Fit ★        L3 → Interaction        L6 → Consistency
L1 → Usability ★          L4 → Content            L7 → Accessibility ★
L2 → Clarity              L5 → Visual Hierarchy   L8 → Completeness ★
```

A dimensão *Rationale* não tem camada própria: ela avalia a fundamentação das escolhas, não o artefato — é alimentada pelo conjunto da crítica. Um achado carrega a **camada** como `Category`; a nota de cada dimensão deriva do pior achado mapeado nela (regra do `quality-framework.md`).

**L0 exige contexto.** Sem Product Context Brief (ou contexto equivalente declarado), L0 não é avaliável — registra-se `UNKNOWN` na camada e a limitação aparece no report; as demais camadas seguem avaliáveis com escopo declarado. Criticar L0 inventando a intenção do produto é fabricação.

## Contrato do achado

Todo problema identificado usa o bloco **Design Issue** de `design-output-format.md`, com todos os campos obrigatórios:

```text
Issue:          [o problema, em uma frase]
Category:       [camada L0–L8 que originou o achado]
Severity:       [Critical | High | Medium | Low | Opportunity — severity-framework.md]
Confidence:     [High | Medium | Low — design-output-format.md]
Evidence:       [o que foi observado, onde — citável e verificável]
User Impact:    [o que acontece com quem encontra o problema]
Recommendation: [correção proposta, respondendo ao problema identificado]
```

Regras do contrato:

1. **Severity** vem integralmente de `severity-framework.md` — definições, desempates e pisos; nada é redefinido aqui. Severidade mede consequência para usuário e tarefa, nunca intensidade visual nem gosto.
2. **Confidence** usa a escala de `design-output-format.md` e materializa a distinção obrigatória entre três naturezas de achado:
   - **problema observado** — sustentado por evidência direta → `High`;
   - **inferência** — evidência razoável completada por interpretação → `Medium`;
   - **hipótese** — evidência fraca ou indireta; ponto de investigação, não conclusão → `Low`, com a validação necessária indicada na Recommendation.
3. **Evidence é obrigatória em qualquer Finding** — `Low` confidence significa evidência fraca, nunca evidência nenhuma. Suspeita sem qualquer evidência observável **não entra em Findings**: vira Open Question, coerente com `severity-framework.md` ("sem evidência, não é achado, é hipótese").
4. **Recommendation** responde ao Issue — não a outro problema, não a uma preferência. Quando a recomendação depender de contexto ausente, ela é apresentada como condicional ("se X for verdade...") ou acompanhada da Open Question correspondente — nunca como verdade.
5. **Tokens canônicos para processamento:** `Category` usa exatamente `L0`–`L8` (opcionalmente seguido do nome da camada); `Severity` e `Confidence` usam exatamente os valores das escalas citadas. Sinônimos e variações quebram o consumo programático do report.
6. **Opportunity não é canal para gosto:** uma Opportunity declara o benefício esperado (o que melhora, para quem, por qual mecanismo) com a mesma disciplina de evidência dos problemas; sugestão puramente estética é registrada como preferência do autor, não como Opportunity.

## Contrato do report

A saída completa de uma crítica segue esta estrutura (blocos de `design-output-format.md`; proporcionalidade vale — crítica pontual pode usar só a seção Findings):

```markdown
# Design Critique Report

**Scope:**   [o que foi analisado e a partir de que fonte — canvas, descrição, imagem]
**Context:** [referência ao Product Context Brief usado + seu Context Status;
              ou declaração explícita de crítica sem contexto e o que isso limita]
**Date:**    [YYYY-MM-DD]

## Executive Summary

[2–4 linhas: veredito, contagem por severidade, tema dominante / causa estrutural]

## Issues

[Blocos Design Issue completos, ordenados por severidade (Critical → Low)]

## Patterns Detected

[Causas estruturais transversais: cada padrão nomeia a causa uma vez e lista as
manifestações agrupadas (regras 5 e 10). "Nenhum padrão detectado" é declarado,
não omitido]

## Opportunities

[Achados Opportunity — sempre separados dos problemas; benefício esperado declarado]

## Unknowns and Assumptions

[Premissas adotadas pela análise (bloco Assumption), UNKNOWNs relevantes e
Open Questions (blocking/non-blocking) — inclusive suspeitas sem evidência,
que vivem aqui e não em Issues]

## Layer Coverage

[Uma linha por camada, com status canônico — nenhuma camada omitida em silêncio:
L0: evaluated
L1: not-evaluable — [o que faltou]
L2: out-of-scope — [por quê]
...]

## Quality Gate

[Quando avaliação formal for pedida: notas por dimensão e veredito dos gates,
conforme quality-framework.md]

## Recommended Next Steps

[Priorizados por impacto: correções na ordem de ataque, validações pendentes dos
achados Confidence Low, e o que destravaria as camadas not-evaluable]
```

O campo **Context** é obrigatório: crítica sem contexto declarado esconde a própria limitação. `Layer Coverage` cumpre para a crítica o papel que o inventário de fontes cumpre no Brief — ausência declarada, nunca silenciosa.

## Regras comuns de crítica

Regras que valem para qualquer skill de crítica. As que derivam da constituição ou de outro standard citam a fonte — a formulação aqui operacionaliza, não substitui:

1. **Preferência estética nunca vira problema de usabilidade** sem impacto observável (CLAUDE.md §3.6; anti-pattern 9). A preferência pode ser atendida como escolha legítima do dono do produto — o que é proibido é travesti-la de defeito.
2. **Toda crítica demonstra impacto:** o campo User Impact é obrigatório e específico — "fica ruim" não é impacto; "o usuário não percebe que o formulário falhou e perde o que digitou" é.
3. **Toda recomendação responde ao problema identificado** — na mesma camada ou na camada causal.
4. **Recomendação que depende de contexto ausente é condicional**, nunca afirmada como verdade (regra 4 do contrato do achado).
5. **Problemas semelhantes são agrupados** quando compartilham causa — o report nomeia a causa uma vez, não repete o mesmo achado por tela.
6. **Toda conclusão declara sua natureza:** problema observado, inferência ou hipótese — via Confidence (regra 2 do contrato) e linguagem correspondente.
7. **Sem listas infladas:** um `Low` entra como bloco individual apenas quando sua correção é acionável de forma independente; `Low` que compartilham causa ou não mudam a próxima ação do time são agregados em uma linha única. Volume não é rigor.
8. **Severidade reflete impacto no usuário e na tarefa** — as quatro lentes de `severity-framework.md` (impact × reach × task criticality × recoverability), nunca gosto pessoal.
9. **Problemas visuais só escalam quando afetam percepção, compreensão, prioridade, legibilidade ou comportamento** — o desalinhamento gritante sem efeito funcional é `Low`; o contraste que esconde a ação primária não é.
10. **Causas estruturais antes de sintomas:** a varredura L0→L8 existe para isso — três sintomas em L5 com causa em L2 são reportados como um achado em L2 com manifestações, não como três achados soltos.
