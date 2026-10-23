# UX Writing Skill

> **Propósito:** avaliar e melhorar a linguagem da interface — se cada texto diz ao usuário onde ele está, o que pode fazer, o que aconteceu e como prosseguir, no vocabulário dele. É a profundidade da camada **L4 — Content** do `standards/critique-framework.md`.
> **Quando consultar:** quando linguagem e conteúdo afetarem a experiência — revisão de microcopy, mensagens de erro, CTAs, empty states, confirmações — pelos sinais de `standards/skill-routing.md`.

Esta skill opera sob a constituição e o contrato comum do Critique Engine. **Herda por referência, sem repetir:** Inputs, Context Integration, Impact Test, Behavior Scenarios A–F e Failure Conditions de `skills/design-critique/SKILL.md`. Severidade em `standards/severity-framework.md`; Confidence e blocos em `standards/design-output-format.md`; a anatomia de erro acessível em `standards/accessibility-baseline.md` (área 9). O vocabulário canônico do produto vem do glossário da memória de projeto, via `skills/product-context/SKILL.md`.

## Purpose

Responder: **"o texto permite ao usuário entender e agir — sem adivinhar?"**

O critério é **compreensão antes de criatividade**. Texto bom aqui é o que o usuário não precisa reler: diz o que a ação faz, o que aconteceu e o que fazer em seguida, com as palavras que ele já usa. A skill não reescreve para soar melhor; reescreve quando o texto atual falha em uma tarefa nomeável.

## When to Use

- Pedido de revisão de textos, microcopy ou mensagens (perfil `microcopy`).
- Formulários, onde rótulos, ajudas e erros decidem a conclusão (perfil `form`).
- Sinal na varredura: CTA genérico, erro vago, termo que diverge do glossário, empty state mudo.

**Quando não usar:** textos legais e regulatórios (termos, consentimento) como objeto principal — a skill sinaliza problemas de clareza, mas não avalia adequação jurídica; criação de voz e tom de marca do zero — não é crítica.

## Boundary

| Se o problema é... | Camada | Quem aprofunda |
| --- | --- | --- |
| Microcopy, mensagens, instruções, tom, rótulos de ação | **L4** | **Esta skill** |
| Nome estrutural (itens de navegação, nomes de seção, o nome das coisas no sistema) | L2 | Design Critique — esta skill contribui com a redação |
| Estado de erro **ausente** (não há mensagem nenhuma) | L8 | `skills/interaction-design/SKILL.md` — esta skill entra se houver texto a avaliar |
| Rótulo não associado programaticamente, nome acessível ausente, instrução só por cor/posição | L7 | `skills/accessibility/SKILL.md` |
| Texto correto mas sem destaque | L5 | `skills/visual-hierarchy/SKILL.md` |

## Required Context

| Informação | Por que importa | Se ausente |
| --- | --- | --- |
| Idioma e variante do produto | A proposta preserva o idioma | Usar o idioma do texto original; nunca traduzir |
| Glossário / vocabulário do domínio | Termos do domínio não são substituídos por genéricos | Não impor vocabulário: propor só onde o problema independe do termo; divergência suspeita vira Open Question |
| Usuário e nível de familiaridade com o domínio | O mesmo termo é claro para um especialista e opaco para um leigo | Assumir o usuário declarado na fixture/Brief; sem usuário, Confidence rebaixada em clareza |
| **Capacidades reais do sistema** (o que o usuário pode fazer para se recuperar) | Texto de erro não pode prometer o que o sistema não faz | Proposta condicional + Open Question — nunca inventar um caminho de recuperação |
| Voz e tom definidos, limites de espaço | Restringem a proposta | Declarar que não foram fornecidos |

## Evaluation Dimensions

| Dimensão | Pergunta |
| --- | --- |
| **Clarity** | Um usuário do público declarado entende na primeira leitura? |
| **Conciseness** | Cada palavra trabalha — sem tornar o texto ambíguo por economia? |
| **Actionability** | O texto diz o que fazer, ou só descreve? O CTA nomeia a ação (verbo + objeto)? |
| **Terminology** | Usa o termo do domínio e do glossário, e um termo por conceito? |
| **Consistency** | O mesmo conceito tem o mesmo nome em todas as telas — e o mesmo rótulo não significa duas ações diferentes? |
| **Tone** | O tom é adequado ao momento (erro, perda, sucesso) — sem culpar o usuário nem minimizar o problema? |
| **Error Recovery** | A mensagem diz o que aconteceu, o impacto e como prosseguir — dentro do que o sistema realmente permite? |
| **Accessibility** (do texto) | O texto se sustenta fora do contexto visual (sem "clique no botão verde", sem "clique aqui")? |
| **Contextual Relevance** | O texto aparece no momento e no lugar em que é útil? |

### O que cada elemento precisa responder

| Elemento | Precisa responder |
| --- | --- |
| Título | Onde estou / do que se trata esta tela |
| Label | O que este campo recebe (e o formato, quando houver um) |
| CTA | O que acontece ao acionar — e a consequência, quando for irreversível |
| Helper text | Como evitar o erro antes de cometê-lo |
| Mensagem de erro | O que aconteceu · qual o impacto · como prosseguir |
| Instrução | Qual é o próximo passo |
| Confirmação | O que será afetado e se dá para desfazer |
| Empty state | Por que está vazio e o que fazer para deixar de estar |
| Loading | Que algo está acontecendo — e o quê, quando demorar |
| Sucesso | O que foi concluído e o próximo passo, quando houver |
| Feedback de sistema | Qual estado mudou e o que isso significa para o usuário |

## Procedure

```text
STEP 1  Inventariar os textos do escopo — citação exata, onde aparecem, em que estado
STEP 2  Carregar vocabulário e capacidades — glossário, público, o que o sistema permite
STEP 3  Para cada texto relevante, perguntar o que o elemento precisa responder
        (tabela acima) — e se responde
STEP 4  Verificar consistência transversal — mesmo conceito/mesmo nome; mesmo
        rótulo/mesma ação
STEP 5  Impact Test — texto que falha numa tarefa nomeável vira candidata; texto
        apenas "melhorável" é preferência
STEP 6  Propor a redação — mesmo idioma, termos do produto, sem prometer capacidade
        inexistente
STEP 7  Self-check — Failure Conditions
```

## Output

Achados no contrato comum de 7 campos (`Category: L4` ou a camada causal). Quando a recomendação for uma alteração textual, o achado carrega a cadeia de reescrita:

```text
Original:        "[texto exato, como aparece na fonte]"
Problem:         [o que o texto falha em responder — a dimensão nomeada]
Proposed Copy:   "[a proposta — mesmo idioma e terminologia do produto]"
Rationale:       [por que esta redação: termo do glossário, regra, padrão do produto]
Expected Impact: [o efeito esperado — hipótese, nunca métrica prometida]
```

Sem redundância com o contrato: no report, `Problem` é o próprio `Issue` (não se repete), `Original` sustenta a `Evidence`, `Proposed Copy` é a `Recommendation` e `Expected Impact` é o ganho esperado — distinto do `User Impact`, que descreve o dano atual. Em revisão direta de microcopy, a cadeia pode ser entregue sozinha, um bloco por texto, desde que Severity e Confidence acompanhem.

Uma proposta por texto. Alternativas só quando houver trade-off real (ex.: espaço × clareza) — e, então, a recomendada e o porquê.

## Evidence Requirements

1. **Citação exata do original** e onde aparece (tela, estado, componente).
2. **Terminologia se sustenta em fonte:** glossário, pesquisa, padrão de outras telas do produto. "O usuário não entende este termo" sem pesquisa é inferência — `Confidence: Medium` ou `Low`.
3. **Inconsistência exige as duas ocorrências citadas.**
4. **`Expected Impact` é hipótese declarada.** Nenhum percentual, nenhuma métrica — esta skill não tem dados de uso.

## Limitations

- Compreensão real não é mensurável sem pesquisa com usuários; o julgamento de clareza é heurístico.
- Adequação a voz e tom de marca depende de uma definição que, ausente, é declarada.
- Truncamento em dispositivos reais, localização e comprimento em outros idiomas não são observáveis.
- Conteúdo jurídico e regulatório tem restrições que esta skill não avalia.

## Failure Conditions (adicionais às herdadas)

1. Reescrita por estilo, sem uma tarefa que o texto atual faça falhar.
2. Termo do domínio substituído por genérico ("conciliação" virando "ajuste") sem evidência de que o público não o usa.
3. **Proposta que promete capacidade inexistente** — "tente recuperar sua sessão" sem que o sistema permita recuperar a sessão.
4. Proposta em outro idioma ou com terminologia alheia ao produto, sem pedido explícito.
5. Métrica inventada em `Expected Impact`.
6. Proposta vaga do tipo "Algo deu errado" ou "Ocorreu um erro" como correção de mensagem vaga.

## Quality Checklist

- [ ] Todo achado cita o texto original exato e onde ele aparece?
- [ ] Toda proposta preserva idioma e terminologia do produto?
- [ ] Mensagens de erro propostas dizem o que aconteceu, o impacto e como prosseguir — só com caminhos que o sistema oferece?
- [ ] Capacidades desconhecidas tratadas como condicionais, com Open Question?
- [ ] Texto adequado reconhecido como adequado — sem reescrita por gosto?
- [ ] `Expected Impact` declarado como hipótese, sem números?

## Example

```text
Issue:          A mensagem de rejeição do comprovante de entrega não diz por que ele
                foi rejeitado nem o que o motorista deve fazer.
Category:       L4 — Content
Severity:       High
Confidence:     High
Evidence:       Tela "Finalizar entrega", estado pós-envio: única mensagem exibida para
                foto ilegível, arquivo grande demais e entrega já finalizada.
User Impact:    O motorista reenvia a mesma foto ou abandona a entrega aberta; a
                entrega fica pendente no sistema.
Recommendation: Uma mensagem por causa — condicional: o material não diz se o sistema
                distingue as três (Open Question); para a foto ilegível, a proposta abaixo.
Original:        "Falha na operação."
Proposed Copy:   "Não foi possível ler a foto do comprovante. Tire outra foto com o
                  documento inteiro visível e boa iluminação."
Rationale:       Diz o que aconteceu e o próximo passo; "comprovante" é o termo do
                 glossário do produto.
Expected Impact: Menos reenvios da mesma foto (hipótese — validar com o volume de
                 reenvios por entrega).
```

Não é achado: "Entrega finalizada" como confirmação de sucesso — curta, específica, no termo do produto. Trocar por algo "mais caloroso" seria preferência.
