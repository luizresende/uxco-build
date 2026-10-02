# Report Template — Design Review (`/uxco-review`)

> **O que é:** o molde operacional do Design Critique Report emitido pelo `/uxco-review`. O **contrato** é o de `standards/critique-framework.md` com a Composição do report de `workflows/uxco-review.md` — este arquivo apenas os materializa como ponto de partida de preenchimento. Divergência entre o molde e o contrato resolve-se sempre a favor do contrato.
> **Como usar:** copiar a estrutura abaixo da linha e preencher. É **contrato de saída, não texto rígido**: a redação é livre; a estrutura, os tokens canônicos e as regras de ausência não são.

## Regras de preenchimento

1. **Seções fixas nunca somem em silêncio.** Toda seção `##` do report aparece; sem conteúdo, carrega uma linha de declaração explícita (ex.: `Nenhum padrão detectado.` · `Nenhuma Opportunity identificada.`) — ausência é informação, a mesma regra do Layer Coverage e do inventário do Brief.
2. **Dentro de Issues, só severidades com achados.** Subtítulos por severidade existem apenas para níveis com issues — nível vazio não gera subtítulo vazio; a contagem completa (incluindo zeros relevantes, ex.: `Nenhuma issue Critical identificada`) vive no Executive Summary.
3. **Tokens canônicos sempre:** Severity (`Critical | High | Medium | Low | Opportunity`), Confidence (`High | Medium | Low`), `Category` `L0`–`L8`, status de cobertura (`evaluated` · `not-evaluable — [o que faltou]` · `out-of-scope — [por quê]`), os campos do Scope block e, em Review Assurance, os marcadores de estágio (`INITIAL_ANALYSIS` · `ADVERSARIAL_REVIEW` · `REVISION` · `FINAL_QA`) e o veredito do QA.
4. **Sem preenchimento vazio:** campo sem conteúdo real é `UNKNOWN` ou declaração de ausência — nunca generalidade para parecer completo (`standards/design-output-format.md`, regra 4).
5. **Proporcionalidade:** a extensão de cada seção segue o escopo — seção de uma linha é seção válida.

---

# Design Critique Report

**Scope:**

```text
Scope:
  Type:        [screen | frame | selection | frame-set | flow]
  Name:        [alvo como nomeado na fonte]
  Source:      [explicit | selection | inferred]
  Includes:    [frames/telas cobertos — e exclusões relevantes]
  Confidence:  [High | Medium | Low]
  Ambiguities: [None | ambiguidades abertas]
```

**Context:** [Context Status do Brief + assumptions e lacunas relevantes à interpretação — o snapshot aponta para o Brief, não o duplica]
**Date:**    [YYYY-MM-DD]

## Executive Summary

[Prosa, 2–6 linhas, com os cinco elementos: o que foi analisado · diagnóstico principal (causa dominante) · quantos problemas relevantes · risco geral · prioridade recomendada. Nunca apenas uma contagem.]

## Issues

[Blocos Design Issue completos — 7 campos, tokens canônicos — em ordem estrita: severidade, e dentro dela impacto → confiança → alcance. **São as issues revisadas (STEP 7), e só elas:** achado rejeitado pelo Critic não aparece aqui (vai a Unknowns and Assumptions quando restar suspeita legítima), e omissão aceita entra com evidência citável como qualquer outra. Nenhum record adversarial é colado dentro desta seção. Subtítulos apenas para níveis com achados:]

### Critical

[...]

### High

[...]

### Medium

[...]

### Low

[Bloco individual só quando a correção é acionável isoladamente; demais agregados em linha única.]

## Patterns Detected

[Causas estruturais transversais, cada uma com as manifestações agrupadas — ou `Nenhum padrão detectado.`]

## Opportunities

[Benefício esperado declarado, sempre separadas dos problemas — ou `Nenhuma Opportunity identificada.`]

## Unknowns and Assumptions

[As Review Limitations vivem aqui (com o Layer Coverage), nas quatro origens: contexto ausente (do Brief) · dados não expostos pela integração (`Limitations` do Canvas Snapshot) · suposições adotadas (blocos Assumption) · áreas exigindo validação humana (achados Low confidence, pendências do baseline de acessibilidade). Open Questions com `Blocking: Yes|No`.]

## Layer Coverage

[Uma linha por camada, status canônico — nenhuma camada omitida:]

```text
L0: [evaluated | not-evaluable — o que faltou | out-of-scope — por quê]
L1: [...]
L2: [...]
L3: [...]
L4: [...]
L5: [...]
L6: [...]
L7: [...]
L8: [...]
```

## Quality Gate

[Sempre presente no review formal: nota por dimensão — ou `UNKNOWN` justificado — e o veredito dos três gates de `standards/quality-framework.md`. Blocker aberto reprova independentemente da média. Este gate avalia o **design**.]

## Review Assurance

[Sempre presente no review formal, e sempre compacto — o bloco de `standards/adversarial-quality.md`, nunca os records inteiros. Este bloco registra que o diagnóstico foi desafiado e auditado; avalia o **review**:]

```text
Stage trace:  INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA
Adversarial:  [N confirmed · N revised · N rejected · N added]
QA verdict:   [REVIEW READY | REVIEW READY WITH RESERVATIONS | REVIEW NOT READY]
QA blockers:  [None | um por linha, com a dimensão e o que o resolveria]
Reservations: [None | o que o QA limitou, uma linha cada]
```

## Recommended Next Steps

[Numerados, priorizados por impacto, cada passo amarrado a uma issue encontrada, a uma validação pendente ou ao que destravaria uma camada `not-evaluable` — nunca lista genérica.]
