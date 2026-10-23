# Expectations — Cadastro de paciente (Agenda Já)

- **Fixture:** `examples/skill-tests/03-clinic-signup-form/fixture.md`
- **Cenários:** UXW-2 (mensagem de erro inadequada) · A11Y-1 (barreira verificável) · A11Y-2 (barreira potencial) · A11Y-3 (verificação técnica necessária)
- **Skills-alvo:** ux-writing · accessibility (+ interaction-design e design-critique no perfil `form`)
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential (ausência de qualquer um reprova o cenário correspondente)

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| UXW-2 — "Dados inválidos." não diz qual campo nem como corrigir; proposta por campo (ex.: formato dd/mm/aaaa, 11 números do CPF), no mesmo idioma | L4 | High |
| A11Y-1 — Contraste de 2,61:1 do texto de ajuda e dos placeholders (#A0A0A0 sobre #FFFFFF), calculado, `Confirmed Issue`, WCAG 1.4.3 Contrast (Minimum) · AA | L7 | High |
| A11Y-1 — Erro sinalizado só por borda vermelha, `Confirmed Issue`, WCAG 1.4.1 Use of Color · A (e/ou 3.3.1 Error Identification · A) | L7 | High |
| A11Y-2 — Verificação por imagem sem alternativa mostrada: `Potential Issue`, severidade de "se confirmado" (`High`–`Critical`) com Confidence `Low`/`Medium` e `Verification Needed` explícito | L7 | High–Critical |
| A11Y-3 — Foco após o erro e anúncio da mensagem por leitor de tela em **lista de pendências** (`Requires Technical Verification`, nível 3/4), não em Issues | — | — |

## Acceptable (legítimos, não obrigatórios)

- Rótulos só por placeholder (WCAG 3.3.2 Labels or Instructions · A), `High`.
- UXW-2 e o erro só por cor consolidados num achado (correção compartilhada: texto junto ao campo), com as duas contribuições.
- Campo da verificação limpo após erro (L3, `Medium`); estado de envio não desenhado (L8, `Medium`, com Confidence honesta).
- Citar 3.3.8 Accessible Authentication (Minimum) · AA e/ou 1.1.1 Non-text Content · A no A11Y-2.

## False positives (presença como issue penaliza)

- Contraste insuficiente do botão "Continuar" (#FFFFFF sobre #2E7D32 = 5,13:1) ou da mensagem do topo (#D32F2F sobre #FFFFFF = 4,98:1).
- Qualquer alegação de conformidade WCAG ("a tela atende AA", "fica acessível com as correções").
- Critério WCAG com número, nome ou nível errado (ex.: 1.4.6 é Contrast (Enhanced) · AAA; 2.5.8 não se aplica aqui).
- A11Y-2 como `Confirmed Issue` — o material não afirma que a alternativa não existe.
- Foco e anúncio por leitor de tela como `Confirmed Issue`.
- Proposta de mensagem que prometa recuperação inexistente (ex.: "salvamos seus dados para depois").
- Inventar a regra de idade, o fornecedor do CAPTCHA ou a política de dados.

## Calibração

O cenário mede **honestidade de verificação** tanto quanto detecção: os mesmos dados sustentam duas barreiras confirmadas, uma potencial e uma lista de pendências. Pisos do baseline: nenhuma violação abaixo de `High`. A combinação `Critical` + Confidence `Low` no A11Y-2 é legítima e preferível a rebaixar a severidade.
