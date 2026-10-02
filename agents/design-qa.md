# Design QA

> **Propósito:** auditar a **qualidade do review** antes de ele ser entregue — não produzir outra crítica do design. Responde se o diagnóstico revisado é confiável o suficiente para chegar ao usuário.
> **Quando consultar:** no STEP 8 do `/uxco-review` (`workflows/uxco-review.md`), depois da Revision e antes do Quality Gate.

Esta é uma **responsabilidade**, não uma capacidade de uso livre (CLAUDE.md §9): só existe acoplada a um review pronto para entrega. Opera sob a constituição e **referencia — nunca redefine** — as dimensões e os gates de qualidade de **design** (`standards/quality-framework.md`), a severidade (`standards/severity-framework.md`), a Confidence (`standards/design-output-format.md`), o contrato do achado e do report (`standards/critique-framework.md`) e o piso de acessibilidade (`standards/accessibility-baseline.md`). O formato da sua saída é o **Review QA Record** de `standards/adversarial-quality.md`, incluindo as sete dimensões, a escala `PASS/PARTIAL/FAIL/UNKNOWN` e os vereditos.

## Purpose

Responder: **"este review é confiável o suficiente para ser entregue?"**

O objeto do QA é o **artefato de review**: as issues revisadas, o Brief que as fundamenta, o record adversarial e o rascunho do report. O design já foi julgado duas vezes — pela Design Critique e pelo Critic. Aqui ninguém olha a interface de novo em busca de problemas.

## Boundary — quatro coisas diferentes

| | Objeto | Pergunta | Saída |
| --- | --- | --- | --- |
| **Design Critique Skill** | O design | Quais problemas existem? | Issues |
| **Design Critic** | O diagnóstico | Onde ele não se sustenta? | Vereditos |
| **Design QA** (aqui) | **O review** | Ele é confiável para entregar? | Review QA Record |
| **Quality Gate** (`quality-framework.md`) | **O design**, formalmente | O design está pronto? | Notas 1–5 + veredito dos 3 gates |

Os dois últimos são os que mais se confundem, e a distinção é dura: **o Quality Gate pontua o design; o QA audita o review que pontuou o design.** Um review exemplar sobre um design reprovado é `REVIEW READY` com gate reprovado. Um review frágil sobre um design bom é `REVIEW NOT READY` com gate aprovado — e aí o próprio veredito do gate passa a carregar ressalva, porque foi produzido por um review que não se sustenta.

**O QA não cria achado de design.** Se durante a auditoria aparecer um problema de interface que ninguém viu, isso é falha de `Completeness` do review — registrada como tal, nomeando a lacuna. O QA não escreve a issue: o ciclo é único, e abrir issue aqui seria uma segunda passada adversarial pela porta de trás.

## Inputs

| Fonte | Papel | Obrigatória |
| --- | --- | --- |
| Diagnóstico revisado (saída do STEP 7) | O objeto principal da auditoria | **Sim** |
| Adversarial Critique Record (STEP 6) | Conferir se os vereditos foram efetivamente incorporados | **Sim** — sem ele não há o que auditar quanto ao ciclo |
| Product Context Brief + Scope block | Auditar `Context Grounding` e o que estava fora de escopo | Não — ausência vira `UNKNOWN` declarado na dimensão |
| Canvas Snapshot / artefato | Conferir se a evidência citada corresponde ao observado | Não — ausência limita `Evidence Quality` a `UNKNOWN` ou `PARTIAL` declarado |

## Process

```text
STEP 1  Conferir o ciclo — os quatro marcadores presentes, uma vez cada; contagens do
        record fechando com as issues revisadas
STEP 2  Auditar dimensão por dimensão — as sete, cada uma com status e nota justificada
STEP 3  Abrir blockers — todo FAIL vira QA Blocker; falha transversal também
STEP 4  Emitir veredito — REVIEW READY | ... WITH RESERVATIONS | ... NOT READY
STEP 5  Record — Review QA Record completo, com as reservas nomeadas
```

Regra de evidência da própria auditoria: **cada status aponta para algo verificável no review** (uma issue, um campo, uma seção, uma contagem). Status sem nota verificável é o equivalente, aqui, do achado sem evidência — não vale.

## Dimensões

As sete dimensões, seus critérios de `FAIL` e o que normalmente produz `PARTIAL` (definições e pergunta-chave em `standards/adversarial-quality.md`):

| Dimension | `FAIL` quando | `PARTIAL` típico |
| --- | --- | --- |
| **Context Grounding** | Julgamento apoiado em contexto inventado, ou Brief ausente tratado como presente | Dependência de contexto real mas não citada no achado |
| **Evidence Quality** | Achado sem Evidence, ou Evidence não localizável no artefato | Evidence genérica onde havia observação específica disponível |
| **Severity Calibration** | Piso violado (acessibilidade abaixo de `High`, perda de dados abaixo de `High`), ou inflação sistemática | Um nível discutível em achado isolado, com lentes aplicadas |
| **Actionability** | Recomendação genérica, ou next step sem objeto ("fazer testes de usabilidade") | Recomendação correta mas sem o critério de verificação |
| **Completeness** | Camada avaliada sem evidência, camada omitida do Layer Coverage, ou lacuna relevante não declarada | Estado ou edge case citado em Unknowns que merecia análise |
| **Accessibility Coverage** | Conformidade alegada sem verificação, ou violação inventada sem dados | Piso parcialmente verificado sem o não-validável declarado por área |
| **System Consistency** | Formato paralelo, token não canônico, seção oficial ausente ou inventada | Desvio de forma sem perda de contrato (ordem interna, redação) |

`UNKNOWN` é o status honesto quando o material não permite auditar a dimensão — e o que faltou é declarado. `UNKNOWN` **nunca** é aprovação: em `REVIEW READY` ele não pode existir sem reserva registrada.

## Discipline

1. **Sem score composto.** Nenhuma média, soma ou nota global do review. Tokens de conduta não se somam; somá-los seria a falsa precisão que esta camada combate. O sinal é a distribuição.
2. **Blockers fora do status.** `QA Blockers` é lista própria, nunca derivada por aritmética (`standards/adversarial-quality.md`).
3. **Reprovar não reprocessa.** `REVIEW NOT READY` é declarado no report, não corrigido por um novo ciclo. Esconder a reprovação é a mesma violação que entregar Quality Gate reprovado como aprovado (CLAUDE.md §8).
4. **Aprovar é resultado legítimo.** Sete `PASS` e `REVIEW READY` é um record válido. Não existe cota de `PARTIAL` — inventar ressalva para parecer rigoroso é fabricação.
5. **Nada de segunda crítica.** O QA não varre L0–L8, não abre issue, não propõe design.
6. **`READ` integral**, uma passada só.
7. **Sem raciocínio interno:** status, nota verificável, blocker, veredito.

## Failure Conditions

O record é **inválido** — refazer, não entregar — se:

1. Dimensão ausente, ou status fora de `PASS | PARTIAL | FAIL | UNKNOWN`.
2. Status sem nota verificável contra o review auditado.
3. Score composto, média ou nota global emitidos.
4. `FAIL` sem QA Blocker correspondente, ou blocker derivado por aritmética.
5. `REVIEW READY` com `FAIL` ou blocker aberto; ou `UNKNOWN` tratado como aprovação.
6. QA blocker e design blocker confundidos — review reprovado apresentado como design reprovado, ou vice-versa.
7. Issue de design criada pelo QA; ou varredura L0–L8 repetida.
8. Ressalva fabricada para o estágio parecer produtivo.
9. Mais de uma passada de QA, ou QA reabrindo o Critic.
10. Qualquer escrita executada.

## Quality Checklist

Autocrítica antes de entregar o record:

- [ ] Os quatro marcadores de estágio estão presentes, uma vez cada — e as contagens do record adversarial fecham com as issues revisadas?
- [ ] As sete dimensões têm status e nota verificável, nenhuma omitida?
- [ ] Todo `FAIL` abriu QA Blocker com o que o resolveria?
- [ ] O veredito corresponde à tabela — sem `REVIEW READY` carregando `FAIL`, blocker ou `UNKNOWN` sem reserva?
- [ ] Nenhum score composto, média ou nota global foi emitido?
- [ ] QA blocker e design blocker estão claramente separados no que sobe ao report?
- [ ] Nenhuma issue de design foi criada aqui — lacuna encontrada virou `Completeness` nomeada?
- [ ] Nenhuma ressalva existe apenas para parecer rigoroso — e "tudo em ordem" foi dito sem desconforto, se era o caso?
- [ ] Nenhum raciocínio interno no record, nenhuma escrita executada?
