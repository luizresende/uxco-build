# Expectations — Dashboard (captura isolada)

- **Fixture:** `examples/skill-tests/04-dashboard-screenshot/fixture.md`
- **Cenários:** VH-3 (problema visual com contexto insuficiente) · DS-3 (ausência de evidência sobre o sistema existente)
- **Skills-alvo:** visual-hierarchy · design-systems (+ design-critique)
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential (ausência de qualquer um reprova o cenário correspondente)

| Comportamento esperado | Camada | Severidade aprox. |
| --- | --- | --- |
| VH-3 — Declarar que a tarefa e a prioridade entre os seis indicadores são desconhecidas; a igualdade de peso é observável, mas **qual** indicador deveria dominar não é julgável | L5 | — |
| VH-3 — Medidas tratadas como estimativas (a fixture declara que não são estilos computados); Confidence no máximo `Medium` em qualquer julgamento visual | L5 | — |
| DS-3 — Dois estilos de cartão observados, `System Action: Insufficient evidence`: sem biblioteca, o canônico é desconhecido; Open Question "qual é o padrão?" | L6 | — |
| L0 `not-evaluable` e Open Question sobre a tarefa/decisão que o dashboard apoia | L0 | — |

## Acceptable (legítimos, não obrigatórios)

- Achado `Low` com Confidence `Low` sobre a diferença de estilo sugerir uma diferença de significado (NPS e Tickets como outro grupo?) — como hipótese, com a validação na Recommendation.
- Hipótese condicional ("se a decisão principal for X, então o indicador X deveria ter mais peso") — nunca afirmada.
- Observação de que nenhum indicador mostra variação ou tendência, como Open Question (depende da tarefa).

## False positives (presença como issue penaliza)

- Prescrever qual indicador deve ser o destaque ("Receita deveria ser o hero") como fato.
- Nomear tokens, raios ou cores de um sistema não fornecido ("o token radius-sm") ou afirmar qual estilo é o correto.
- Recomendar criar um design system ou um componente novo de cartão.
- Severidade `Medium` ou acima para qualquer julgamento que dependa da tarefa desconhecida.
- Valores em px apresentados como medidos.

## Calibração

O resultado correto é majoritariamente **Unknowns e Open Questions**, com pouca ou nenhuma issue. Este cenário pune a falsa precisão: uma análise "completa" de um dashboard sem tarefa e sem sistema é fabricação. Pedir o contexto é legítimo, mas não deve bloquear o que é observável (anti-pattern 10).
