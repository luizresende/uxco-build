# Accessibility Skill

> **Propósito:** identificar barreiras de acessibilidade **identificáveis no design** — e declarar, para cada uma, o quanto ela foi de fato verificada. É a profundidade da camada **L7 — Accessibility** do `standards/critique-framework.md` e o método que aplica o piso de `standards/accessibility-baseline.md`.
> **Quando consultar:** em todo review formal (Accessibility é dimensão crítica ★ do `standards/quality-framework.md`) e quando houver barreiras a investigar — formulários, autenticação, status por cor, alvos pequenos, controles customizados, gestos, mensagens de erro e de status — pelos sinais de `standards/skill-routing.md`.

Esta skill opera sob a constituição e o contrato comum do Critique Engine. **Herda por referência, sem repetir:** Inputs, Context Integration, Impact Test, Behavior Scenarios A–F e Failure Conditions de `skills/design-critique/SKILL.md`. **O piso vem do baseline e não é redefinido aqui** — áreas, referências práticas, pisos de severidade (`High`; `Critical` quando excludente) e a regra de honestidade de verificação são de `standards/accessibility-baseline.md`; a escala e as lentes de severidade, de `standards/severity-framework.md`; Confidence e blocos, de `standards/design-output-format.md`. Esta skill acrescenta o método, a classificação de verificação e o mapeamento para WCAG.

## Purpose

Responder: **"quem fica impedido ou prejudicado de completar esta tarefa — e quanto disso foi realmente verificado?"**

A segunda metade da pergunta é o que diferencia esta skill de uma checklist: inspeção de design alcança uma parte da acessibilidade, não toda. Um design pode ter contraste adequado e ser inoperável por teclado; o canvas não mostra isso. A skill **nunca declara uma interface acessível** nem **conforme a WCAG** — ela declara barreiras encontradas, riscos e o que falta verificar.

## When to Use

- Review formal (perfil `full-review` — primária).
- Pedido de auditoria de acessibilidade (perfil `accessibility-audit`) ou revisão de formulário (perfil `form`).
- Sinal na varredura: informação só por cor, texto claro sobre fundo claro, alvos pequenos, ícone sem rótulo, erro só por borda, interação por gesto, CAPTCHA.

## Boundary

| Se o problema é... | Camada | Quem aprofunda |
| --- | --- | --- |
| Barreira de acesso: abaixo do piso, informação inacessível por um canal, operação impossível sem um sentido ou dispositivo | **L7** | **Esta skill** |
| Contraste/tamanho que afeta só a proeminência relativa, acima do piso | L5 | `skills/visual-hierarchy/SKILL.md` |
| Redação do rótulo ou da mensagem | L4 | `skills/ux-writing/SKILL.md` |
| Estado de erro ou foco ausente como comportamento do fluxo | L8 / L3 | `skills/interaction-design/SKILL.md` |

Contraste e tamanho abaixo do piso são **sempre L7**, qualquer que seja a manifestação visual (Desambiguação do framework).

## Required Context

| Informação | Por que importa | Se ausente |
| --- | --- | --- |
| Plataforma (web, mobile, toque, desktop) | Alvos, gestos e navegação dependem dela | Declarar a plataforma assumida |
| Valores de cor e tamanhos de texto (estilos computados, valores declarados) | Contraste e legibilidade só são calculáveis com valores | Contraste vira `Requires Technical Verification` — nunca estimado |
| Dimensões dos elementos interativos | Target size | Idem |
| Estados desenhados (foco, erro, disabled) | Focus visibility, error identification | Ausência no artefato ≠ ausência no produto: `Potential Issue` ou pergunta |
| Meta de conformidade declarada (ex.: contrato exige WCAG 2.2 AA) | Calibra o que é obrigatório | Avaliar contra o baseline, citando WCAG como referência técnica |

## Evaluation Dimensions

Cada dimensão, a área do baseline que ela aplica, a referência WCAG 2.2 quando houver correspondência confiável, e **até onde o design deixa verificar**:

| Dimensão | Baseline | Referência WCAG 2.2 (critério · nível) | Verificável no design? |
| --- | --- | --- | --- |
| **Contrast** | 3 | 1.4.3 Contrast (Minimum) · AA; 1.4.11 Non-text Contrast · AA | Sim, com valores de cor; sem eles, não |
| **Readability** | 2, 10 | Sem critério WCAG de tamanho mínimo de fonte — o piso de tamanho é heurística do baseline; 1.4.4 Resize Text · AA e 1.4.12 Text Spacing · AA são comportamento do código | Tamanhos sim; redimensionamento não |
| **Target Size** | 4 | 2.5.8 Target Size (Minimum) · AA (24×24 CSS px, com exceções); 2.5.5 Target Size (Enhanced) · AAA (44×44 CSS px) | Dimensões sim; área de toque real é do código |
| **Color Dependence** | 8 | 1.4.1 Use of Color · A | Sim — teste de dessaturação |
| **Focus Visibility** | 7 | 2.4.7 Focus Visible · AA; 2.4.11 Focus Not Obscured (Minimum) · AA | Se o estado de foco foi especificado, sim; o comportamento real, não |
| **Navigation** | 5 | 2.1.1 Keyboard · A; 2.4.3 Focus Order · A | Só a intenção (ordem inferível do layout); operabilidade é do código |
| **Semantics** | 1, 6 | 1.1.1 Non-text Content · A; 1.3.1 Info and Relationships · A; 2.4.6 Headings and Labels · AA; 4.1.2 Name, Role, Value · A | Intenção e rótulos previstos sim; semântica programática não |
| **Error Identification** | 9 | 3.3.1 Error Identification · A; 3.3.3 Error Suggestion · AA; 3.3.4 Error Prevention (Legal, Financial, Data) · AA | Conteúdo e posição previstos sim; disparo e foco não |
| **Instructions** | 6, 10 | 3.3.2 Labels or Instructions · A; 1.3.3 Sensory Characteristics · A | Sim |
| **Status Feedback** | 9 | 4.1.3 Status Messages · AA | A mensagem visual sim; o anúncio por tecnologia assistiva não |
| **Interaction Alternatives** | 5, 10 | 2.5.1 Pointer Gestures · A; 2.5.7 Dragging Movements · AA; 3.3.8 Accessible Authentication (Minimum) · AA | Sim, se a alternativa está prevista no material |

**Atenção ao alvo de toque:** a referência de 44×44 do baseline corresponde ao critério **AAA** 2.5.5, não ao AA 2.5.8 (24×24). Um alvo de 32×32 viola o baseline (piso `High`) e atende o 2.5.8 — o achado diz exatamente isso, sem citar 2.5.8 como violado.

### Quatro níveis de verificabilidade

Todo achado declara de qual nível vem a sua evidência:

| Nível | O que alcança | Exemplos |
| --- | --- | --- |
| 1 · **visualmente observável** | Inspeção do artefato (imagem, descrição, canvas) | Informação só por cor; ícone sem rótulo visível; erro sem texto |
| 2 · **propriedades estruturadas** | Valores lidos ou declarados (estilos computados, dimensões) | Razão de contraste calculada; tamanho do alvo; tamanho da fonte |
| 3 · **inspeção do código** | Implementação | Nome acessível, roles, ordem de tabulação, foco gerenciado após erro |
| 4 · **teste com tecnologia assistiva** | Uso real com leitor de tela, navegação por teclado, ampliação | Se a mensagem de status é anunciada; se o fluxo é operável |

Esta skill trabalha nos níveis 1 e 2. Os níveis 3 e 4 nunca são concluídos aqui — viram verificação pendente.

## Classificação — `A11y Status`

| `A11y Status` | Quando | Destino no report |
| --- | --- | --- |
| `Confirmed Issue` | Evidência de nível 1 ou 2 mostra a barreira | Issue — severidade pelos pisos do baseline, `Confidence: High` |
| `Potential Issue` | Há evidência observável de risco, mas não decisiva (valor ausente, estado possivelmente não mostrado) | Issue — severidade de "se confirmado" (pisos mantidos), `Confidence: Low` ou `Medium`, com `Verification Needed` obrigatório |
| `Requires Technical Verification` | A questão vive nos níveis 3 ou 4 | **Não é Issue:** lista de pendências de verificação em Unknowns and Assumptions (baseline, Uso em avaliação, regra 3) |
| `Not Assessable` | O material não permite nem levantar o risco | Layer Coverage / Unknowns, com o que faltou — **nunca aprovação implícita** |

`Potential Issue` mantém a severidade de "se confirmado" porque severidade e Confidence são ortogonais (`standards/design-output-format.md`): a incerteza fica na Confidence, nunca rebaixa a severidade em silêncio. O efeito no Quality Gate é decidido pelo `standards/quality-framework.md` — esta skill não aprova nem reprova o design.

## Procedure

```text
STEP 1  Fixar plataforma, público e meta de conformidade (ou a ausência dela)
STEP 2  Inventariar o que o material expõe: valores de cor, tamanhos, dimensões,
        estados desenhados, alternativas previstas — cada um com a fonte
STEP 3  Percorrer as dimensões relevantes ao escopo — para cada uma, nível de
        verificabilidade possível com o material
STEP 4  Calcular o que for calculável (contraste a partir de valores; dimensões)
        — mostrando os insumos
STEP 5  Classificar cada candidata em A11y Status
STEP 6  Mapear o critério aplicável — área do baseline e critério WCAG quando a
        correspondência for confiável
STEP 7  Montar a lista de verificações pendentes (níveis 3–4) — explícita, por área
STEP 8  Self-check — Failure Conditions
```

**Contraste, quando há valores:** razão pela luminância relativa da WCAG, `(L1 + 0.05) / (L2 + 0.05)`, com os dois valores de cor citados e o resultado com duas casas. Texto grande (≥ 24px regular ou ≥ 18,66px bold, aproximadamente 18pt/14pt) usa a referência de 3:1. Transparência, gradiente ou imagem de fundo → `Requires Technical Verification`.

## Output

Achados no contrato comum de 7 campos (`Category: L7`). A cadeia da skill — **Issue → Evidence → Accessibility Impact → Applicable Criterion → Recommendation → Verification Needed** — encaixa no contrato assim: `Accessibility Impact` é o `User Impact` (nomeando quem é excluído ou prejudicado, e como), e três campos de extensão completam o resto:

```text
A11y Status:          [Confirmed Issue | Potential Issue | Requires Technical Verification | Not Assessable]
Applicable Criterion: [área do baseline + critério WCAG (número · nome · nível) — ou "sem critério WCAG específico identificado com confiança"]
Verification Needed:  [como confirmar — ferramenta de contraste sobre os valores reais, teste de teclado na build, leitor de tela — ou "None" quando Confirmed por nível 1/2]
```

A lista de pendências (`Requires Technical Verification`) usa uma linha por item: área · o que verificar · nível (3 ou 4) · como.

## Evidence Requirements

1. **Valores citados com fonte** — os dois valores de cor e o tamanho do texto, para qualquer afirmação de contraste.
2. **Critério WCAG só quando a correspondência é confiável.** Na dúvida, citar a área do baseline e declarar que o critério específico não foi identificado com confiança. **Citar um critério errado é pior que não citar.**
3. **O que o artefato não mostra não é ausência no produto** (Failure Condition 4 da Interaction Design): estado não desenhado é `Potential Issue` ou pergunta — nunca `Confirmed Issue`.
4. **Impacto nomeia pessoas e situações:** baixa visão, daltonismo, uso só por teclado, leitor de tela, motricidade fina, situação temporária (sol na tela, uma mão ocupada).

## Limitations

- **Nenhuma conformidade WCAG é declarada.** Conformidade exige auditoria do produto implementado (baseline, Sobre conformidade normativa).
- Contraste adequado não torna uma interface acessível: o achado de contraste não fala pelas outras dimensões.
- Os níveis 3 e 4 não são alcançáveis pelo design nem pelo Paper.
- Compreensão cognitiva real varia por público; sem pesquisa, a avaliação de carga cognitiva é heurística.

## Failure Conditions (adicionais às herdadas)

1. Interface declarada "acessível", "conforme WCAG" ou "AA" com base na inspeção do design.
2. Critério WCAG citado com número, nome ou nível incorreto — ou citado sem correspondência real com o problema.
3. Contraste afirmado (violação **ou** aprovação) sem os dois valores de cor.
4. Questão de nível 3 ou 4 apresentada como `Confirmed Issue`.
5. Violação do baseline abaixo de `High` (piso do baseline).
6. `Requires Technical Verification` ou `Not Assessable` omitidos — pendência silenciosa é aprovação implícita.

## Quality Checklist

- [ ] Todo achado tem `A11y Status` e o nível de verificabilidade da evidência?
- [ ] Todo contraste citado tem os dois valores e a razão calculada?
- [ ] Todo critério WCAG citado tem número, nome e nível corretos — ou a limitação declarada?
- [ ] Pisos do baseline respeitados, e `Potential Issue` com severidade de "se confirmado" e Confidence baixa?
- [ ] Pendências de nível 3–4 listadas explicitamente?
- [ ] Nenhuma alegação de conformidade ou de "interface acessível"?

## Example

```text
Issue:          No mapa de assentos, "disponível" e "ocupado" são distinguidos apenas
                pela cor (verde × cinza).
Category:       L7 — Accessibility
Severity:       High
Confidence:     High
Evidence:       Descrição da tela de seleção de assentos: mesmo ícone, mesmo tamanho,
                sem texto ou padrão; legenda também só por cor. Nível 1 (observável).
User Impact:    Pessoas com daltonismo (deuteranopia) e com baixa visão não distinguem
                assentos livres; tentam selecionar ocupados ou desistem da escolha.
Recommendation: Acrescentar um segundo canal ao estado — ícone ou padrão no ocupado e
                legenda com texto.
A11y Status:          Confirmed Issue
Applicable Criterion: Baseline área 8 (Color independence); WCAG 1.4.1 Use of Color · A
Verification Needed:  None para a barreira visual; nível 3 pendente — o estado precisa
                      ser exposto ao leitor de tela (4.1.2 Name, Role, Value · A)
```
