# Expectations — Escolha de plano (Quadro)

- **Fixture:** `examples/skill-tests/05-plan-selector/fixture.md`
- **Cenário:** DS-2 (variante necessária)
- **Skills-alvo:** design-systems (+ design-critique)
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential (ausência de qualquer um reprova o cenário)

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Destaque de "recomendado" e estado `selected` usam o mesmo tratamento (borda 2px): ao escolher Básico ou Empresa, dois cartões parecem selecionados | L6 | Medium |
| `System Action: Extend existing component` (ou `Reuse existing component` com Badge `info` dentro do Card `default`) — não `Create new component`: o Card e o Badge existem, falta um tratamento de "recomendado" distinto de `selected` | L6 (System Action) | Medium |
| "PlanCardHighlight" é cópia desvinculada da biblioteca, com cor (#6B4EFF) que não está na lista de tokens fornecida e etiqueta desenhada à mão em vez de Badge | L6 | Low–Medium |

## Acceptable (legítimos, não obrigatórios)

- Os três itens consolidados em um ou dois achados, com `System Impact` mencionando a governança da biblioteca (variante nova exige aprovação do dono do sistema).
- Bloco Design Decision para a variante proposta.

## False positives (presença como issue penaliza)

- `Create new component` ("PlanCard novo") sem justificar por que Card + Badge não resolvem.
- Nomear #6B4EFF como um token ("purple-500") — a lista fornecida não o contém.
- Questionar a decisão de negócio de destacar o plano Equipe.
- Recomendar mudança global na biblioteca como fato consumado, sem declarar a aprovação necessária.
- Padronizar os três cartões "para ficarem iguais" — o destaque tem função declarada.

## Calibração

A sutileza é a fronteira entre `Extend` e `Create`: a necessidade (destacar o recomendado) é legítima e não existe como variante; a solução governável estende o que existe. Confidence `High` — biblioteca e comportamento são fornecidos.
