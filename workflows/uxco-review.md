# UXCO Review — mapa

O `/uxco-review` executa a cadeia em `workflows/review/manifest.json`. Este arquivo não é mais o processo: é o mapa compartilhado e o que vale para qualquer fase. Outro comando (`/uxco-new-feature` e os demais, quando existirem) reusa o mesmo desenho — um manifesto, os prompts, `scripts/chain.mjs` — sem copiar esta orquestração.

As oito falhas de execução estão nomeadas em `workflows/review/failures.md`. O validador é quem barra o artefato. O catálogo não entra no contexto das fases.

## Purpose

Responder se o design está pronto e, se não está, o que muda primeiro. O primeiro diagnóstico não é a conclusão: `analyze` produz, `challenge` ataca e deixa um diagnóstico, `close` audita o review e pontua o design.

## Trigger

- **Comando:** `/uxco-review`, com alvo ou sem.
- **Pedido contextual:** review formal em linguagem natural, roteado por `docs/constitution/knowledge-routing.md` quando o orquestrador precisa saber que o comando existe.
- **Ciclo de trabalho:** a etapa `critique` elevada a avaliação formal, quando o usuário pede o rito.

Não dispara crítica pontual nem pedido de design novo.

## Preconditions

- **Artefato observável** é a única precondição absoluta. Sem ele, `scope` para em `no-artifact`.
- **Canvas como fonte** exige `PAPER_READY` por chamada real. A fase `inspect` é a única que lê o canvas. Sem o Paper, e sendo ele a única fonte, a cadeia para. Com outra fonte, segue.
- **Memória de projeto é opcional.** Ausência vira brief com `MISSING`.
- **Context Loader:** `npm run context:load` quando há caminho. Indisponível, a fase `ground` declara `loader: direct-read`. O fonte do loader não é contexto do modelo.

## Process

Seis fases. Pipeline canônico — o mapa abaixo conserva os 17 estágios. A inspeção vem antes do brief porque o snapshot é evidência do próprio brief. Crítica e revisão saem no mesmo artefato; o validador ainda exige o record e o diagnóstico único, com `cyclePass` 1.

| Estágio canônico | Fase |
| --- | --- |
| 1. Receive review request | scope |
| 2. Detect scope | scope |
| 3. Load project context | ground |
| 4. Inspect Paper | inspect |
| 5. Build Context Brief | ground |
| 6. Run Design Critique | analyze |
| 7. Run Interaction Design when relevant | analyze |
| 8. Normalize findings | analyze |
| 9. Classify severity | analyze |
| 10. Assign confidence | analyze |
| 11. Deduplicate findings | analyze |
| 12. Prioritize issues | analyze |
| 13. Challenge the diagnosis | challenge |
| 14. Revise the diagnosis | challenge |
| 15. Audit review quality | close |
| 16. Generate report | close |
| 17. Present next steps | close |

```text
scope → inspect (se canvas) → ground → analyze → challenge → close
```

Marcadores, uma vez cada, nesta ordem: `INITIAL_ANALYSIS`, `ADVERSARIAL_REVIEW`, `REVISION`, `FINAL_QA`.

## Safety Model

1. O review inteiro é operação `READ`. A camada adversarial **não abre exceção**: Critic e QA também são integralmente `READ`.
2. Canvas como fonte exige `PAPER_READY`. O Canvas Snapshot vive na fase inspect. Canvas indisponível não inventa análise.
3. Aceite de risco de um blocker é `decision` no artefato de close, não escrita silenciosa em memória.

## Output

O usuário recebe o Design Critique Report da fase `close`. Quality Gate sempre presente. O contrato de seções está em `standards/critique-framework.md` e o molde em `templates/reports/design-review.md`.

## Completion Criteria

O review está completo quando as seis fases rodaram até `close` com o validador em saída 0, ou quando uma parada válida (saída 2) foi mostrada com o motivo. Desvio de profundidade não pula gate.

1. Report na composição da fase close, com Quality Gate.
2. Scope com origem.
3. Review Limitations nas quatro origens.
4. Ciclo adversarial completo e observável, contagens fechadas com o challenge.
5. Um diagnóstico só: as issues são as revisadas.
6. Veredito do QA presente. `REVIEW NOT READY` aparece como tal.
7. Nenhuma escrita em canvas ou memória.

Gate reprovado não é review incompleto. O que volta ao ciclo é o design, não uma segunda passada do review.

## Failure Conditions

O review é inválido — refazer, não entregar — se:

1. Review sem artefato observável.
2. Escopo inventado, ou seleção e pedido explícito ignorados.
3. Brief pulado ou fabricado.
4. Blocking question respondida por invenção; conclusão sem a queda de Confidence; ou interrupção por ausência que não tornaria a análise enganosa (anti-pattern 10).
5. Qualquer escrita em canvas ou memória durante o review.
6. Report sem Quality Gate, ou gate reprovado entregue como aprovado.
7. Failure Condition de uma skill consumida.
8. Falsa precisão no Layer Coverage.
9. Ciclo adversarial pulado ou fabricado, ou contagem que não fecha com o record.
10. Mudança fabricada pelo Critic.
11. Diagnóstico contraditório entregue.
12. Mais de um ciclo adversarial, reflexão recursiva, ou QA reabrindo o Critic.
13. Confusão entre os dois blockers: QA blocker como falha do design, design blocker como falha do review, ou `REVIEW NOT READY` entregue como se o review estivesse pronto.
