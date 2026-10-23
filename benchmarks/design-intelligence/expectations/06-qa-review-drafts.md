# Expectations — Review drafts para o Design QA

- **Fixtures:** `examples/skill-tests/06-qa-review-drafts/draft-a.md` · `examples/skill-tests/06-qa-review-drafts/draft-b.md` · `examples/skill-tests/06-qa-review-drafts/draft-c.md`
- **Artefato de design subjacente:** `examples/skill-tests/03-clinic-signup-form/fixture.md`
- **Cenários:** QA-1 (entrega pronta) · QA-2 (entrega com problemas menores) · QA-3 (entrega bloqueada)
- **Responsabilidade-alvo:** `agents/design-qa.md`
- **Referência de avaliação — nunca fornecer ao QA durante a execução.**

## Essential (ausência de qualquer um reprova o cenário correspondente)

| Comportamento esperado | Draft | Veredito |
| --- | --- | --- |
| QA-1 — Sete dimensões `PASS` (ou `UNKNOWN` com reserva declarada), contagens do desafio fechando com o record (3 · 1 · 1 · 1) e **`REVIEW READY`** — com o Quality Gate do design **reprovado**, sem confundir os dois blockers | A | REVIEW READY |
| QA-2 — `Actionability: PARTIAL` (recomendação de contraste sem alvo nem critério de verificação), `Accessibility Coverage: PARTIAL` (pendências técnicas sem lista por área), `System Consistency: PARTIAL` (linha `Skills:` sem motivos) → **`REVIEW READY WITH RESERVATIONS`**, reservas nomeadas | B | REVIEW READY WITH RESERVATIONS |
| QA-3 — `Severity Calibration: FAIL` (contraste 2,61:1 como `Medium`, abaixo do piso `High`), `Accessibility Coverage: FAIL` (alegação de conformidade WCAG 2.2 AA; critério "1.4.6 Contrast (Minimum) · AA" errado), contagens que não fecham com o record (4 confirmed · 0 revised declarados; o record traz 3 confirmados e 1 revisado) → QA Blockers e **`REVIEW NOT READY`** | C | REVIEW NOT READY |

## Acceptable

- Em C, ordenação e demais dimensões avaliadas com notas verificáveis; qualquer `PARTIAL` adicional precisa apontar algo verificável no draft.
- Em A, `Context Grounding: PASS` ou `PARTIAL` com nota sobre o Brief `MISSING` (o draft declara a ausência).

## False positives (presença penaliza)

- Em qualquer draft: o QA criar issue de design nova, repetir a varredura L0–L8 ou reabrir o Critic.
- Em A: inventar ressalva para parecer rigoroso; tratar o Gate reprovado como falha do review.
- Em C: tratar os defeitos como reprovação do **design** (é QA blocker, não design blocker); corrigir o draft e aprovar em vez de declarar.
- Score composto, média ou nota global do review.

## Calibração

Os três drafts têm os mesmos achados de design — só a qualidade do review muda. Isso isola o que o QA mede. O caso A é o teste mais fino: um review impecável sobre um design reprovado é `REVIEW READY`.
