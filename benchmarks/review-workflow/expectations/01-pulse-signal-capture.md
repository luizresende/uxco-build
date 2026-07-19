# Expectations — RVW-002 Triage semanal (Pulse)

- **Fixture:** `examples/review-tests/01-pulse-signal-capture/fixture.md`
- **Memória:** `examples/demo-project/` (deve ser carregada no STEP 2 do workflow)
- **Alvo:** workflow completo — conduta dos STEPs **e** substância da crítica
- **Referência de avaliação — nunca fornecer durante a execução.**

## Essential

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| "Descartar" remove um Signal imediatamente, sem confirmação nem undo — perda de dado irreversível a um clique de distância de "Agrupar" (botões idênticos e adjacentes) | L3 | Critical |
| Abandonar a Triagem antes de "Concluir sessão" descarta silenciosamente todo o progresso da sessão (até 47 decisões), sem aviso na saída nem no retorno — e a memória registra exatamente "abandono no meio do triage" como gap de pesquisa aberto | L1 | High |
| Vocabulário da UI contraria o glossário do produto: "card" e "feedback bruto" são termos que `glossary.md` manda evitar (canônicos: Feedback Item, Signal) | L4 | Medium |
| "Agrupar em card" sem indicador entre confirmação e atualização (2–4 s) — ação parece não ter funcionado | L3 | Medium–High |
| Fila vazia pós-sessão sem estado desenhado — término do ritual semanal termina em tela em branco | L8 | Medium |

## Acceptable

- Três ações de peso visual idêntico ("Agrupar"/"Novo"/"Descartar") sem hierarquia — aceitável como manifestação dentro do achado do Descartar (L5) ou como issue própria Medium.
- Ausência declarada de estados de erro de rede/carregamento em todas as telas (L8, agregável).
- Oportunidade: fila vazia como momento de reforço do hábito semanal (benefício ancorado no objetivo "triage semanal virar hábito" — `product.md`).

## False positives

- **Propor triage contínuo / criticar o modelo em lote:** é `DECISION` ativa (`decisions.md`, 2026-07-08) — reabri-la silenciosamente viola CLAUDE.md §5. No máximo, citar a decisão e o que a invalidaria.
- Criticar a ausência de app mobile ou de atalhos de teclado avançados sem evidência — restrição registrada (web responsivo; sem pesquisa sobre atalhos).
- Afirmar que a perda de progresso **é a causa** da queda no funil de triage — é hipótese conectável ao Research Gap, não conclusão (`Confidence: Low`/Unknowns, nunca fato).

## Calibração

Este cenário avalia o **workflow**, não só a crítica:

1. **Brief primeiro:** o report deve citar um Product Context Brief real, com inventário da memória do Pulse (7 fontes com status) — review que pulou o STEP 2 reprova por conduta, mesmo com boa crítica.
2. **L0 avaliável:** com memória `COMPLETE`/`PARTIAL` carregada, L0 deve ser `evaluated` — um L0 `not-evaluable` indica que a memória não foi carregada.
3. **Achado dependente de memória:** o problema de vocabulário (glossário) só é detectável com a memória carregada — sua ausência total é o sinal mais direto de STEP 2 fingido.
4. **Quality Gate presente**, com o achado Critical reprovando o gate independentemente da média (blocker aberto).
5. Severidades: piso `High`+ para perda de trabalho/dados (`severity-framework.md`) cobre os dois primeiros Essential.
