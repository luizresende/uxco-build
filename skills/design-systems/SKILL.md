# Design Systems Skill

> **Propósito:** garantir consistência e reutilização — se o design usa, e usa bem, os componentes, variantes, estados e tokens que o produto já tem; e, quando precisa de algo novo, se a novidade é justificada e governável. É a profundidade da camada **L6 — System Consistency** do `standards/critique-framework.md`.
> **Quando consultar:** quando componentes, padrões ou consistência forem relevantes — e **sempre que uma recomendação propuser componente ou padrão novo** (CLAUDE.md §3.5) — pelos sinais de `standards/skill-routing.md`.

Esta skill opera sob a constituição e o contrato comum do Critique Engine. **Herda por referência, sem repetir:** Inputs, Context Integration, Impact Test, Behavior Scenarios A–F e Failure Conditions de `skills/design-critique/SKILL.md`. Severidade em `standards/severity-framework.md`; Confidence e o bloco Design Decision em `standards/design-output-format.md`. Alteração de componentes globais e tokens é `DESTRUCTIVE_WRITE` (CLAUDE.md §6) — esta skill apenas recomenda.

## Purpose

Responder: **"este design resolve o problema com o que o produto já tem — e, se não resolve, qual é a menor extensão governável?"**

Consistência não é uniformidade estética: é o mesmo problema resolvido do mesmo jeito, para que o usuário aprenda uma vez. Variação com função é legítima; variação sem função é custo — para o usuário, que reaprende, e para o time, que mantém dois caminhos.

## When to Use

- Pedido sobre uso de componentes, variantes, tokens ou consistência entre telas (perfil `design-system-consistency`).
- Recomendação de qualquer outra skill que proponha componente, variante ou padrão novo — antes de ela chegar ao report.
- Sinal na varredura: estilos divergentes para a mesma função, componente "destacado" da biblioteca, valores de cor ou espaçamento que não aparecem em nenhum outro lugar.

**Quando não usar:** produto sem nenhuma evidência de sistema (nem biblioteca, nem padrões recorrentes) — a saída honesta é `Insufficient evidence`, não a criação de um design system.

## Boundary

| Se o problema é... | Camada | Quem aprofunda |
| --- | --- | --- |
| Mesmo problema resolvido de jeitos diferentes; variante, estado ou token fora do sistema | **L6** | **Esta skill** |
| Hierarquia falha **porque** a variante certa não foi usada | o achado fica na camada causal; esta skill acrescenta `System Action` | Consolidação |
| Estados interativos de um elemento (hover, focus, disabled) não especificados | L3 | `skills/interaction-design/SKILL.md` — esta skill verifica se o componente do sistema já os define |
| Inconsistência de termo entre telas | L4 | `skills/ux-writing/SKILL.md` |

Esta skill tem um papel transversal: o campo `System Action` pode enriquecer achado de **qualquer** camada, sem criar um segundo achado.

## Required Context

| Informação | Por que importa | Se ausente |
| --- | --- | --- |
| Inventário de componentes, variantes e estados existentes (biblioteca no canvas, documentação, memória de projeto, código fornecido) | Reuso só é recomendável sobre o que se sabe que existe | `Insufficient evidence` — nunca supor uma biblioteca |
| Qual implementação é a canônica | Resolver inconsistência exige saber qual lado é o padrão | Inconsistência descrita; escolha do canônico vira Open Question |
| Tokens definidos (cor, tipografia, espaçamento) | Valor fora do token é desvio | Valor observado é **valor**, não token — não nomear tokens não documentados |
| Quem governa o sistema e o que exige aprovação | Mudança global não é decisão local | Recomendação como proposta, com aprovação declarada como pendente |

## Evaluation Dimensions

| Dimensão | Pergunta |
| --- | --- |
| **Component reuse** | Existe componente que resolve isto? Ele foi usado? |
| **Tokens** | Cores, tipografia e espaçamentos vêm dos tokens — ou são valores soltos? |
| **Variants** | A variante usada é a que corresponde à função (primária, destrutiva, selecionada)? Falta uma variante? |
| **States** | O componente traz os estados de que este uso precisa (disabled, loading, erro, selecionado)? |
| **Naming** | Componentes e variantes têm nomes que dizem a função — e o nome bate com o uso? |
| **Consistency** | O mesmo problema é resolvido do mesmo jeito em todas as telas do escopo? |
| **Pattern governance** | A solução nova foi criada fora da biblioteca (componente destacado, cópia local)? |
| **Scalability** | A solução proposta serve aos próximos casos, ou é um caso especial que vai se multiplicar? |

## Procedure

Antes de recomendar qualquer componente novo — obrigatório, nesta ordem:

```text
STEP 1  Inspecionar componentes existentes — o inventário disponível, com a fonte
STEP 2  Identificar padrões reutilizáveis — o que já resolve o problema, inteiro ou em parte
STEP 3  Verificar variantes — a função pedida já tem variante?
STEP 4  Verificar estados — o componente cobre os estados deste uso?
STEP 5  Identificar inconsistências — mesma função, soluções diferentes, com as ocorrências
STEP 6  Avaliar a necessidade de extensão — variante ou estado novo resolve?
STEP 7  Justificar criação — só se 1–6 não resolverem; com Design Decision
```

## Classificação — `System Action`

Todo achado desta skill termina numa destas cinco ações:

| `System Action` | Quando | Evidência mínima |
| --- | --- | --- |
| `Reuse existing component` | Um componente/variante existente resolve e não foi usado | O componente existente citado, com a fonte |
| `Extend existing component` | O componente existe, mas falta variante ou estado para esta função | O componente citado + o que falta + por que as variantes atuais não servem |
| `Create new component` | Nada existente resolve, mesmo estendido | Inventário inspecionado (STEPs 1–6) + necessidade recorrente ou justificada + bloco **Design Decision** com alternativas descartadas |
| `Resolve inconsistency` | A mesma função tem duas ou mais soluções, e o canônico é conhecido | As ocorrências citadas + a fonte que define o canônico |
| `Insufficient evidence` | Não há inventário, ou o canônico é desconhecido | O que faltou — vai a Unknowns como Open Question, nunca como recomendação de padronizar |

`Insufficient evidence` não é falha da skill: é a saída correta quando o Paper ou o material não expõem o sistema. Ela pode acompanhar um achado de outra camada (o problema existe, a ação de sistema é que não é decidível) ou ficar só em Unknowns.

## Output

Achados no contrato comum de 7 campos (`Category: L6` ou a camada causal). Campos de **extensão**:

```text
System Action:    [Reuse existing component | Extend existing component | Create new component | Resolve inconsistency | Insufficient evidence]
Existing Pattern: [componente / variante / token existente que fundamenta a ação — com a fonte]
System Impact:    [o que a mudança afeta além desta tela — outras telas, outros times, aprovação necessária]
```

`Create new component` vem sempre acompanhado do bloco Design Decision (`standards/design-output-format.md`) — decisão que afeta várias partes do produto é decisão relevante (CLAUDE.md §7).

## Evidence Requirements

1. **Componente existente só com fonte:** "biblioteca 'Core', componente Button, variante `primary` — documentação fornecida". Sem fonte, ele não existe para esta análise.
2. **Inconsistência exige as ocorrências** (onde está cada versão) — uma só ocorrência não é inconsistência.
3. **Um valor não é um token.** `#6B4EFF` lido no canvas é um valor de cor; dizer que ele "não está nos tokens" exige a lista de tokens.
4. **Efeito no usuário quando houver:** inconsistência visível que sugere diferença de significado inexistente é problema de L6 com impacto; divergência invisível ao usuário é custo de manutenção — `Low`, ou nota de handoff.

## Limitations

- O Paper pode expor instâncias sem expor a definição dos componentes, suas variantes ou o vínculo com tokens; estilos computados não dizem se um valor veio de um token. Limitações vão ao Canvas Snapshot e ao Layer Coverage.
- A skill não vê o código: divergência entre design system de design e de implementação fica fora.
- Governança (quem aprova, qual o roadmap do sistema) só é conhecida quando documentada.

## Failure Conditions (adicionais às herdadas)

1. `Create new component` sem o inventário inspecionado e sem Design Decision.
2. Padronização recomendada só por uniformidade estética, sem função ou impacto.
3. Componente, variante, biblioteca ou token **inferido** sem fonte.
4. Alteração de componente global ou token recomendada como fato consumado, sem declarar que exige aprovação (CLAUDE.md §6).
5. Canônico escolhido por palpite numa inconsistência.

## Quality Checklist

- [ ] Inventário inspecionado e citado antes de qualquer recomendação de componente?
- [ ] Toda recomendação termina em uma das cinco `System Action`?
- [ ] `Create new component` só depois dos STEPs 1–6, com Design Decision?
- [ ] Nenhum token ou biblioteca nomeado sem fonte?
- [ ] Mudança global declarada como proposta que exige aprovação?
- [ ] Variação com função reconhecida como legítima?

## Example

```text
Issue:          O status "Reservada" das salas aparece como badge em Agenda e como
                texto colorido em Detalhes da sala — o mesmo estado com dois padrões.
Category:       L6 — System Consistency
Severity:       Low
Confidence:     High
Evidence:       Tela Agenda: componente Badge, variante `warning`. Tela Detalhes: texto
                laranja sem contêiner. Biblioteca fornecida define Badge como o padrão
                de status (documentação, seção Feedback).
User Impact:    Leitura do status mais lenta em Detalhes; nenhum erro de tarefa provável.
Recommendation: Usar Badge `warning` em Detalhes.
System Action:    Reuse existing component
Existing Pattern: Badge `warning` — biblioteca, seção Feedback
System Impact:    Só a tela Detalhes; sem mudança na biblioteca.
```

Contraste: se a biblioteca não tivesse sido fornecida, a mesma observação seria `Insufficient evidence` — sem saber qual dos dois é o padrão, recomendar um deles é palpite.
