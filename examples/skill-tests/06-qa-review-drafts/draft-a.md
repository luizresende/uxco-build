# Review draft — Cadastro "Agenda Já" (A)

> Entrada do STEP 8 (Design QA) do `/uxco-review`: um review com os STEPs 0–7 e o Quality Gate executados, ainda sem o veredito do QA. Artefato avaliado: `examples/skill-tests/03-clinic-signup-form/fixture.md`.

**Scope:**

```text
Scope:
  Type:        screen
  Name:        Seus dados
  Source:      explicit
  Includes:    tela "Seus dados" — estado padrão e estado de erro; fora: confirmação da consulta
  Confidence:  High
  Ambiguities: None
```

**Context:** sem memória de projeto — Brief com as sete fontes `MISSING`; contexto vindo da fixture (produto, usuário, tarefa). Execution Recommendation: `PROCEED WITH ASSUMPTIONS`. O dado "40% dos pacientes acima de 60 anos" é operacional, informado pelo time — usado para calibrar alcance, não tratado como pesquisa.

## Executive Summary

Review da tela de cadastro do Agenda Já. Diagnóstico principal: o formulário depende de canais frágeis — cor, placeholder e cinza claro — para comunicar o que pedir e o que corrigir. Cinco problemas: um `Critical` com Confidence `Low` (verificação de acesso possivelmente excludente, a confirmar), três `High` e um `Medium`. Risco geral alto para um público com muitos pacientes acima de 60 anos. Prioridade: confirmar a alternativa da verificação e trocar a sinalização de erro por texto junto aos campos.

## Issues

```text
Issue:          A verificação por transcrição de caracteres distorcidos não mostra
                nenhuma alternativa; se não houver, pacientes cegos ou com baixa visão
                não concluem o cadastro.
Category:       L7 — Accessibility
Severity:       Critical
Confidence:     Low
Evidence:       Fixture: "O material não mostra outra forma de verificação"; o fornecedor
                do CAPTCHA não foi documentado. Ausência no material ≠ ausência no produto.
User Impact:    Exclusão de quem não lê a imagem — a consulta não é confirmada.
Recommendation: Confirmar com o time se existe alternativa (áudio, verificação sem
                transcrição); se não existir, adotar uma que não dependa de teste cognitivo.
A11y Status:          Potential Issue
Applicable Criterion: Baseline áreas 5 e 10; WCAG 3.3.8 Accessible Authentication (Minimum) · AA;
                      1.1.1 Non-text Content · A
Verification Needed:  Resposta do time sobre o fornecedor + teste com leitor de tela
```

```text
Issue:          Campos inválidos são sinalizados só por borda vermelha, e a única
                mensagem ("Dados inválidos.") não diz qual campo nem como corrigir.
Category:       L7 — Accessibility
Severity:       High
Confidence:     High
Evidence:       Comportamento 1: borda 1px #D32F2F, nenhum texto junto ao campo; texto
                "Dados inválidos." no topo. Contribuição da UX Writing consolidada aqui.
User Impact:    Pessoas com daltonismo não identificam o campo; todos precisam adivinhar
                a correção (formato da data, CPF).
Recommendation: Mensagem de texto e ícone junto a cada campo inválido; o topo passa a
                dizer quantos campos corrigir.
Original:        "Dados inválidos."
Proposed Copy:   CPF: "Digite os 11 números do CPF." · Data: "Use o formato dd/mm/aaaa,
                 por exemplo 05/03/1958."
Rationale:       Diz o que está errado e como corrigir, no próprio campo.
Expected Impact: Menos tentativas repetidas no envio (hipótese).
A11y Status:          Confirmed Issue
Applicable Criterion: Baseline áreas 8 e 9; WCAG 1.4.1 Use of Color · A; 3.3.1 Error Identification · A
Verification Needed:  None para a barreira visual; associação programática erro↔campo em pendências
```

```text
Issue:          Texto de ajuda e placeholders com contraste de 2,61:1.
Category:       L7 — Accessibility
Severity:       High
Confidence:     High
Evidence:       #A0A0A0 sobre #FFFFFF (fixture), 12px e 16px — razão calculada 2,61:1,
                abaixo de 4,5:1 para texto normal.
User Impact:    Baixa visão e uso sob luz forte: a ajuda "Somente números" e os nomes dos
                campos ficam ilegíveis.
Recommendation: Usar uma cor com ≥ 4,5:1 sobre branco (ex.: #5F6368, 6,05:1) e
                recalcular com os valores finais.
A11y Status:          Confirmed Issue
Applicable Criterion: Baseline área 3; WCAG 1.4.3 Contrast (Minimum) · AA
Verification Needed:  None — valores computáveis
```

```text
Issue:          Os campos são identificados só por placeholder; o nome do campo some
                ao digitar.
Category:       L7 — Accessibility
Severity:       High
Confidence:     High
Evidence:       Fixture: "identificados apenas por placeholder"; "não há rótulo fora do campo".
User Impact:    Quem revisa o que digitou não sabe mais o que cada campo pede — carga de
                memória maior, relevante para o público acima de 60 anos.
Recommendation: Rótulo visível e permanente acima de cada campo.
A11y Status:          Confirmed Issue
Applicable Criterion: Baseline áreas 6 e 10; WCAG 3.3.2 Labels or Instructions · A
Verification Needed:  None para a barreira visual
```

```text
Issue:          O estado de envio não foi desenhado.
Category:       L8 — States & Edge Cases
Severity:       Medium
Confidence:     Medium
Evidence:       Fixture: "Estado de envio não foi desenhado." Pode existir na implementação.
User Impact:    Sem resposta ao toque, risco de toque repetido em "Continuar".
Recommendation: Especificar o estado de envio do botão (desabilitado + indicador).
Missing State:  Enviando
```

## Patterns Detected

- Informação essencial do formulário apoiada em canais frágeis (cor, placeholder, cinza claro) — manifestações nos achados 2, 3 e 4.

## Opportunities

Nenhuma oportunidade registrada.

## Unknowns and Assumptions

- **Open Question** — Existe alternativa à verificação por imagem? · Blocking: No · Decide a severidade final do achado 1.
- **Pendências de verificação técnica** (`Requires Technical Verification`):
  - Navigation · ordem de foco e destino do foco após o erro · nível 3 · teste de teclado na build.
  - Status Feedback · anúncio de "Dados inválidos." · nível 4 · leitor de tela (WCAG 4.1.3 Status Messages · AA).
  - Semantics · associação programática rótulo↔campo e erro↔campo · nível 3 · inspeção do código.

## Layer Coverage

```text
L0: evaluated
L1: not-evaluable — tela única; o fluxo de agendamento não foi fornecido
L2: evaluated
L3: evaluated
L4: evaluated
L5: evaluated
L6: not-evaluable — nenhuma biblioteca de componentes fornecida
L7: evaluated
L8: evaluated
```

## Quality Gate

Context Fit ★ 3 · Usability ★ 2 · Completeness ★ 3 · Accessibility ★ 1 · Content 2 · Interaction 3 · Visual Hierarchy 5 · Clarity 3 · Consistency UNKNOWN · Rationale UNKNOWN. Veredito: **reprovado** — blocker aberto (achado 1, `Critical`, até verificação ou aceite de risco) e violações do piso de acessibilidade (achados 2–4).

## Review Assurance

```text
Skills:       product-context [Brief] · interaction-design [estados de erro] · ux-writing [mensagens do formulário] · accessibility [formulário; sempre no review] · design-critique [consolidação] | escalated: — | not routed: visual-hierarchy, design-systems
Stage trace:  INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → (FINAL_QA — este estágio)
Adversarial:  3 confirmed · 1 revised · 1 rejected · 1 added
```

Adversarial Critique Record (resumo das entradas):

- `confirmed` — achados 2, 3 e 4.
- `revised` — achado 1: `Confidence: Medium → Low`; `A11y Status: Confirmed Issue → Potential Issue` (o material não afirma a ausência da alternativa).
- `rejected` — "botão Continuar com contraste insuficiente": 5,13:1 calculado (#FFFFFF sobre #2E7D32), acima de 4,5:1.
- `added` — achado 5 (estado de envio), evidência na seção Estados conhecidos da fixture.

## Recommended Next Steps

1. Confirmar com o time a alternativa da verificação por imagem. [← achado 1, validação de Confidence Low]
2. Trocar a sinalização de erro por texto e ícone junto aos campos. [← achado 2]
3. Ajustar a cor do texto de ajuda e dos placeholders, recalculando o contraste. [← achado 3]
4. Acrescentar rótulos permanentes. [← achado 4]
5. Executar as três verificações técnicas pendentes na build. [← pendências]
