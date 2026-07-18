# Product Context Brief

> **Propósito:** o formato oficial do output do Context Engine — a fotografia estruturada, classificada e honesta do contexto de produto, produzida pela Product Context Skill (`skills/product-context/SKILL.md`).
> **Quando consultar:** ao gerar um Brief (a skill segue este formato) e ao consumi-lo (workflows futuros leem o Brief por este contrato).

## Regras do formato

1. **Toda seção está sempre presente.** Seção sem informação recebe `UNKNOWN` com a origem da ausência (arquivo `MISSING`, seção `_Not filled_`, tema sem cobertura) — omissão silenciosa de seção invalida o Brief (Failure Conditions da skill).
2. **Todo item relevante carrega categoria e fonte**, no padrão `[CATEGORIA — fonte]`, usando o sistema de Evidence Classification da skill (`CONFIRMED · EVIDENCE · ASSUMPTION · UNKNOWN · CONTRADICTION`). Julgamentos carregam também Confidence (`standards/design-output-format.md`).
3. **A linguagem acompanha a categoria:** afirmação categórica só com `CONFIRMED`/`EVIDENCE`; conteúdo de `ASSUMPTION` é redigido como possibilidade.
4. **Blocos reutilizados:** Open Questions usam o bloco Open Question e premissas relevantes o bloco Assumption, ambos de `design-output-format.md` — nenhum formato paralelo.
5. **Proporcionalidade:** o Brief de um projeto pequeno pode ter seções de uma linha. Formato padroniza estrutura, não obriga extensão (mesma regra dos demais formatos de saída).

## Formato

```markdown
# Product Context Brief

**Project:**  [nome do projeto]
**Date:**     [YYYY-MM-DD]

## Context Status

Completeness:       [COMPLETE | PARTIAL | MINIMAL | EMPTY]
Confidence:         [High | Medium | Low]
Blocking Questions: [n abertas]
Readiness:          [READY | READY_WITH_ASSUMPTIONS | BLOCKED]

## Problem

[O problema que o produto resolve — para quem, com que consequência.]

## User

[Usuários primários e secundários relevantes ao escopo.]

## Goal

[Objetivo do produto/trabalho no horizonte atual.]

## Jobs to Be Done

[O progresso que os usuários buscam — não a feature.]

## Context of Use

[Onde, quando e em que condições o produto é usado.]

## Constraints

[Restrições de negócio, técnicas, legais, de plataforma, de prazo.]

## Requirements

[Requisitos funcionais e regras de negócio conhecidos, com status de confirmação.]

## Success Criteria

[O que "dar certo" significa — qualitativo, a ponte entre Goal e Metrics.]

## Metrics

[Métricas definidas: primárias, secundárias, guardrails — só as que existem.]

## Risks

[Riscos conhecidos ou inferidos pela análise — inferência marcada como tal.]

## Known Evidence

[Evidências observadas relevantes, com fonte e método — a base de `research.md` e do canvas.]

## Assumptions

[Premissas em jogo — das fontes e da própria análise; cada uma com risco se estiver errada.]

## Contradictions

[Choques entre fontes, no formato CONTRADICTION — com efeito (blocking/non-blocking) e conciliação possível apenas como hipótese.]

## Open Questions

### Blocking

[Blocos Open Question com `Blocking: Yes` — cada um com o porquê do bloqueio.]

### Non-Blocking

[Blocos Open Question com `Blocking: No` — pendências declaradas.]

## Sources Consulted

[Inventário: cada arquivo de memória com status MISSING | EMPTY | PARTIAL | FILLED; demais fontes consultadas (conversa, arquivos do repositório, canvas) e limitações de acesso.]
```

## Semântica do Context Status

O Context Status é o veredito que um consumidor lê antes de qualquer seção — quatro campos, todos obrigatórios:

| Campo | Valores | Critério |
| --- | --- | --- |
| Completeness | `COMPLETE` | Seções nucleares (Problem, User, Goal, JTBD, Context of Use) sustentadas por `CONFIRMED`/`EVIDENCE` |
| | `PARTIAL` | Nucleares parcialmente cobertas; lacunas declaradas |
| | `MINIMAL` | Maioria das nucleares em `ASSUMPTION`/`UNKNOWN` |
| | `EMPTY` | Nenhuma fonte real de contexto disponível |
| Confidence | `High · Medium · Low` | Força agregada das fontes nas seções nucleares (escala de `design-output-format.md`) — reflete a base do conjunto, não a média aritmética |
| Blocking Questions | `n` | Contagem de Open Questions com `Blocking: Yes` ainda sem resposta |
| Readiness | `READY` | Sem blocking questions; contexto sustenta trabalho de design |
| | `READY_WITH_ASSUMPTIONS` | Trabalho razoável possível — apoiado em premissas explícitas listadas em Assumptions |
| | `BLOCKED` | ≥ 1 blocking question aberta: trabalho de design que dependa da resposta não deve prosseguir |

`Readiness: BLOCKED` **não impede a emissão do Brief** — o Brief é justamente o instrumento que comunica o bloqueio e as perguntas que o resolvem.

## Contrato de consumo (workflows futuros)

Consumidores previstos: `/uxco-review`, `/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa` — **nenhum implementado ainda** (CLAUDE.md §9.3); este contrato existe para que possam ser construídos sobre o Brief sem retrabalho.

O que um consumidor **pode** assumir:

1. Os nomes e a ordem das seções deste formato são estáveis; toda seção existe (com conteúdo ou `UNKNOWN`).
2. O Context Status resume o estado: um consumidor pode decidir prosseguir/parar lendo apenas ele.
3. Todo item carrega categoria — o consumidor sabe o que é chão firme (`CONFIRMED`/`EVIDENCE`) e o que é areia (`ASSUMPTION`).

O que um consumidor **deve** respeitar:

1. `Readiness: BLOCKED` — não iniciar trabalho que dependa das blocking questions abertas.
2. **Herança de categorias:** premissas do Brief continuam premissas no trabalho derivado — consumir uma `ASSUMPTION` não a promove a fato (CLAUDE.md §5).
3. **Contradições abertas não se resolvem por consumo:** o workflow que precisar de um dos lados devolve a decisão ao usuário.
