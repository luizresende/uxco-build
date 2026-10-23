# Expectations — Confirmação de transferência (Trilho) — controle positivo

- **Fixture:** `examples/skill-tests/02-transfer-confirmation/fixture.md`
- **Cenários:** DC-2 (falso positivo) · ID-3 (estados corretamente tratados) · VH-2 (hierarquia adequada) · UXW-3 (microcopy adequada)
- **Skills-alvo:** design-critique · interaction-design · visual-hierarchy · ux-writing
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential (ausência de qualquer um reprova o cenário correspondente)

| Comportamento esperado | Camada | Severidade aprox. |
| --- | --- | --- |
| DC-2 — Nenhuma issue `Critical`, `High` ou `Medium`; "nenhuma issue relevante" declarado no Executive Summary com a cobertura que o justifica | — | — |
| ID-3 — Os seis estados reconhecidos como tratados, incluindo a proteção contra transferência duplicada no timeout e o botão desabilitado durante o envio | L8 | — |
| VH-2 — Hierarquia reconhecida como adequada: valor (32px bold) domina, ação primária única e preenchida, "Voltar e editar" como link secundário é intencional | L5 | — |
| UXW-3 — Microcopy reconhecida como adequada: mensagens de erro dizem o que aconteceu, o impacto e o próximo passo, só com caminhos que o app oferece | L4 | — |
| Pendências de verificação técnica listadas (foco e anúncio das mensagens por leitor de tela — o material declara que não especifica), **não** como issues | L7 | — |

## Acceptable (legítimos, não obrigatórios)

- No máximo achados `Low` ou `Opportunity` com benefício declarado (ex.: oferecer "Salvar contato" na tela de sucesso).
- Observação de que a área de toque de 44px do link é declarada, não medida (limitação, não achado).

## False positives (presença como issue penaliza)

- "Voltar e editar" deveria ser botão ou ter mais destaque — a ação secundária menos proeminente é a hierarquia funcionando.
- Modal extra de "Tem certeza?" — a tela já é a confirmação; acrescentar passo é complexidade desnecessária.
- Exigir biometria ou senha como defeito de design (não há requisito no material).
- Afirmar contraste insuficiente: #4A4A4A/#FFFFFF = 8,86:1; #FFFFFF/#0B6E4F = 6,25:1; #0B6E4F/#FFFFFF = 6,25:1.
- Reescrever mensagens adequadas por estilo ("deixar mais amigável").
- Tratar a ausência de especificação de foco como `Confirmed Issue`.
- Declarar a tela "acessível" ou "conforme WCAG".

## Calibração

Este é o controle de falso positivo da suíte: o resultado correto é um report curto e confiante. Um report que "rende" achados `Medium` aqui falhou, mesmo que bem escrito. Confidence `High` na adequação dos estados descritos; as pendências de leitor de tela continuam pendências.
