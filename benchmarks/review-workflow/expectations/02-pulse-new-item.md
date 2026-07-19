# Expectations — RVW-004 Novo Feedback Item (Pulse)

- **Fixture:** `examples/review-tests/02-pulse-new-item/fixture.md`
- **Memória:** `examples/demo-project/` (deve ser carregada no STEP 2 do workflow)
- **Alvo:** tela única com memória — escopo explícito, ordenação correta e report válido **sem nenhuma issue Critical**
- **Referência de avaliação — nunca fornecer durante a execução.**

## Essential

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Campos rotulados apenas por texto-guia que desaparece ao digitar — sem rótulo persistente, pendência direta do baseline de acessibilidade (rótulos), com piso do severity-framework | L7 | High |
| "Salvar" sem qualquer indicador entre o clique e a resposta (2–4 s), com o modal aberto e o botão inalterado — a ação parece não ter registrado; convite a cliques repetidos | L3 | Medium |
| Vocabulário da UI contraria o glossário do produto: "card" e "feedback bruto" no título, no texto-guia e no texto auxiliar (canônicos: Feedback Item, Signal) — detectável apenas com a memória carregada | L4 | Medium |

## Acceptable

- Ausência de estado de falha do envio e de validação de campos obrigatórios — a fixture declara que não foram desenhados (L8, agregável; ausência no material ≠ ausência no produto).
- **Oportunidade** (exatamente uma esperada): sugerir Feedback Items semelhantes durante a digitação do título — prevenção de duplicatas a favor do ranking do Board, com benefício declarado; sempre separada dos problemas, nunca na contagem de defeitos.

## False positives

- **Qualquer issue `Critical`:** nada na tela impede a tarefa nem destrói trabalho de forma irreversível por um clique; `Critical` aqui é inflação de severidade — na dúvida entre dois níveis, o menor.
- Criticar o modelo de triage em lote, ou propor a vinculação de Signals dentro do próprio modal como "correção": a decisão de lote é `DECISION` ativa (`decisions.md`, 2026-07-08) — no máximo citá-la.
- Achados de fluxo multi-tela (L1) afirmados como observados: o material é uma tela única (cenário D) — L1 no máximo limitado ao que a tela evidencia, ou `not-evaluable`.

## Calibração

Este cenário avalia escopo de tela única e a validade do report sem achado grave:

1. **Escopo:** `Type: screen`, `Source: explicit`, `Confidence: High` — a fixture é o alvo nomeado; as demais telas do Pulse não entram como objeto.
2. **Brief real:** inventário das 7 fontes do Pulse com status; o achado de vocabulário é o sinal mais direto de STEP 2 real — sem a memória carregada, ele não existe.
3. **Ordenação:** High antes de Medium; dentro de Medium, desempate por impacto → confiança → alcance; a Opportunity fora da lista de defeitos, ao final.
4. **Report válido sem Critical:** o Executive Summary declara a ausência (ex.: `Nenhuma issue Critical identificada`); nenhum subtítulo `### Critical` vazio aparece; Quality Gate presente com veredito — a validade do report não depende de existir achado grave, e nenhum achado é inflacionado para "justificar" o rito formal.
5. **Interaction Design:** acionamento automático não é exigido (tela única); entrada sob demanda pelo cheiro comportamental do "Salvar" é aceitável — nunca obrigatória.
