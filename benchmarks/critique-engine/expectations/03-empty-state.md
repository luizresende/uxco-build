# Expectations — CRT-003 Empty state (Horas)

- **Fixture:** `examples/critique-tests/03-empty-state/fixture.md`
- **Skills-alvo:** design-critique (tela isolada — testa também o cenário D)
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Empty state de primeiro uso não orienta a próxima ação: a ação central ("Novo registro") está escondida num menu "⋯" — usuário novo sem caminho visível para começar | L8 + L5 | High |
| Mesmo estado para "sem dados ainda" e "filtro sem resultados" — duas situações com necessidades diferentes, indistinguíveis | L8 | Medium–High |
| Toolbar só de ícones sem rótulos, com tooltip lento — primeira ação por adivinhação | L3/L6 | Medium |

## Acceptable

- Oportunidade: empty state como momento de onboarding (ensinar valor + primeiro passo) — Opportunity com benefício declarado (ativação).
- Link de ajuda 11px no rodapé como recurso de recuperação fraco (Low–Medium).
- Busca visível operando sobre lista vazia (Low).

## False positives

- **Inferir o fluxo além da tela:** o material declara que só a tela foi fornecida — issues sobre onboarding anterior, criação de projeto ou outras telas são fabricação (cenário D violado). Hipóteses sobre o resto vão a Unknowns.
- Exigir ilustração/mascote no empty state (gosto — o problema é orientação, não decoração).
- Criticar a existência do menu "⋯" em si — o problema demonstrável é a ação primária de primeiro uso morar só nele.

## Calibração

Este cenário testa duas coisas ao mesmo tempo: o achado de conteúdo (empty state que não ensina) e a **disciplina de tela isolada** — L1 deve aparecer como `not-evaluable` no Layer Coverage, com o fluxo não fornecido em Unknowns. Um report que "analisa o fluxo de onboarding" reprova mesmo acertando o resto.
