# Visual Hierarchy Skill

> **Propósito:** análise de como a composição visual direciona atenção, compreensão e ação — se o que a tarefa exige primeiro é o que o olhar encontra primeiro. É a profundidade da camada **L5 — Visual Hierarchy** do `standards/critique-framework.md`.
> **Quando consultar:** quando a organização visual for relevante à tarefa — pedido de revisão de hierarquia ou layout, ação primária sem destaque, elementos competindo, tela densa — pelos sinais de `standards/skill-routing.md`.

Esta skill opera sob a constituição e o contrato comum do Critique Engine. **Herda por referência, sem repetir:** Inputs, Context Integration, Impact Test, Behavior Scenarios A–F e Failure Conditions de `skills/design-critique/SKILL.md`. Severidade vem de `standards/severity-framework.md`; Confidence e blocos de `standards/design-output-format.md`; o piso de contraste e tamanho de `standards/accessibility-baseline.md`.

## Purpose

Responder: **"a composição faz o usuário ver, entender e agir na ordem que a tarefa exige?"**

Hierarquia é a relação entre **importância** (definida pela tarefa) e **proeminência** (produzida pelo visual). Um problema de hierarquia é um desalinhamento entre as duas **com efeito na tarefa** — o usuário não encontra, confunde ou aciona o errado. Não é sobre beleza, modernidade nem tendência: uma tela austera com a ordem certa tem hierarquia boa.

## When to Use

- Pedido de revisão de hierarquia, layout, escaneabilidade ou "o CTA não aparece" (perfil `visual-hierarchy`).
- Sinal encontrado na varredura da Design Critique: ação primária sem destaque proporcional, informação de decisão enterrada, competição entre elementos, densidade excessiva.
- Review formal, quando o escopo tiver artefato visual observável (perfil `full-review`, condicional).

**Quando não usar:** artefato sem nenhuma dimensão visual observável (fluxo descrito só em texto sem propriedades) — L5 vai para `not-evaluable`; pedido de "deixar mais bonito" sem problema declarado — não é tarefa de crítica.

## Boundary

| Se o problema é... | Camada | Quem aprofunda |
| --- | --- | --- |
| Proeminência desalinhada com importância, agrupamento ambíguo, competição, densidade | **L5** | **Esta skill** |
| Contraste ou tamanho abaixo do piso do baseline | L7 | `skills/accessibility/SKILL.md` — sempre L7, qualquer que seja a manifestação visual |
| Rótulo que não diz o que a ação faz | L4 | `skills/ux-writing/SKILL.md` |
| Variante ou componente existente que não foi usado | causa em L6, ou `System Action` no achado de L5 | `skills/design-systems/SKILL.md` |
| Informação organizada no lugar errado da estrutura (navegação, seção) | L2 | Design Critique |

Quando duas delas tocam o mesmo elemento (ex.: CTA sem destaque **e** com rótulo vago), são dois problemas só se as correções forem independentes; senão, é um achado na camada causal, com as outras manifestações na Evidence (Consolidação do `workflows/uxco-review.md`).

## Required Context

| Informação | Por que importa | Se ausente |
| --- | --- | --- |
| Tarefa principal da tela e a ação/informação que ela exige primeiro | Importância vem da tarefa, não do layout | A ordem "correta" não é julgável: competição e ambiguidade observáveis seguem reportáveis; "X deveria dominar" vira recomendação condicional; Confidence no máximo `Medium` |
| Artefato visual com propriedades (estilos computados do canvas, valores declarados na descrição, imagem) | Proeminência depende de tamanho, peso, cor, posição e área | Só comparações relativas a partir do que a fonte mostra — **nenhuma medida estimada apresentada como fato** |
| Padrões do produto (componentes, variantes de ênfase) | O mesmo nível de importância deve ter a mesma ênfase em todo o produto | Consistência entre telas não avaliável; declarar |
| Plataforma e viewport | Densidade e escaneabilidade mudam com a tela | Declarar o viewport observado; outros ficam fora |

## Evaluation Dimensions

Avaliar **quando relevante ao escopo**, nunca como checklist — cada dimensão nomeia o sinal que vira candidata a achado:

| Dimensão | Pergunta | Sinal de problema (sempre com efeito na tarefa) |
| --- | --- | --- |
| **Visual priority** | O mais importante para a tarefa é o mais proeminente? | Ação ou informação crítica com proeminência menor que elementos secundários |
| **Typography** | Os níveis tipográficos são distinguíveis e usados com função consistente? | Dois níveis de importância com o mesmo estilo; o mesmo nível com estilos diferentes |
| **Contrast** (de ênfase) | O contraste relativo separa primário de secundário? | Ação primária com contraste igual ou menor que as secundárias (abaixo do piso → L7) |
| **Spacing** | O espaço comunica relação? | Espaço entre grupos igual ou menor que o espaço dentro do grupo |
| **Grouping** | Proximidade e contêiner correspondem à relação do conteúdo? | Rótulo mais próximo do campo errado; ação perto do objeto que ela não afeta |
| **Alignment** | O alinhamento cria trilhas de leitura e associa o que deve ser associado? | Desalinhamento que quebra a associação rótulo–valor; desalinhamento sem efeito é `Low` (regra 9 do framework) |
| **Density** | A quantidade de elementos simultâneos é compatível com a tarefa? | Decisão rápida enterrada em muitos elementos de mesmo peso |
| **Scannability** | O usuário encontra o que precisa por varredura, sem ler tudo? | Ausência de âncoras (títulos, valores-chave) numa tela de consulta |
| **Visual rhythm** | Estruturas repetidas se repetem de forma previsível? | Item quebrando o ritmo sem ser diferente — ou item diferente camuflado no ritmo |
| **Information emphasis** | A ênfase é reservada ao que é importante ou diferente? | Ênfase inflacionada (tudo em destaque = nada em destaque); conteúdo promocional mais proeminente que o conteúdo da tarefa |

## Procedure

```text
STEP 1  Fixar a tarefa e a ordem de importância — do Brief ou da conversa;
        sem isso, declarar UNKNOWN e aplicar a linha "Se ausente" de Required Context
STEP 2  Inventariar a proeminência observada — para os elementos relevantes, as
        propriedades realmente disponíveis (tamanho, peso, cor, posição, área,
        contêiner), cada valor com a sua fonte
STEP 3  Comparar importância × proeminência — onde as duas ordens divergem
STEP 4  Examinar grupos e trilhas — agrupamento, alinhamento, espaço entre e dentro
STEP 5  Examinar a carga — densidade, competição, escaneabilidade
STEP 6  Encontrar a causa — L5 genuína, ou causa em L2 (estrutura), L4 (rótulo),
        L6 (variante não usada), L7 (piso)? Registrar na camada causal
STEP 7  Impact Test + contrato; self-check estético (Failure Conditions)
```

O teste de desfoque ("o que domina se eu não conseguir ler?") é heurística útil no STEP 3 — e é **inferência**, declarada como tal; não substitui as propriedades observadas.

## Output

Achados no contrato comum de 7 campos (`Category: L5` ou a camada causal). Campos de **extensão**, opcionais, quando esclarecem — nunca substituindo os obrigatórios:

```text
Task Priority:      [o que a tarefa exige primeiro — com a fonte (Brief, conversa) ou ASSUMPTION]
Observed Emphasis:  [o que hoje domina, com as propriedades que sustentam e a fonte de cada valor]
Competing Elements: [elementos que disputam a atenção com o prioritário, quando houver]
```

Todo achado desta skill amarra a cadeia **tarefa → contexto → impacto → evidência → recomendação**: `Task Priority` (tarefa e contexto citado), `Evidence` + `Observed Emphasis` (evidência), `User Impact` (impacto) e `Recommendation`. Achado que não fecha a cadeia não passou no Impact Test.

## Evidence Requirements

1. **Valor só com fonte.** "fontSize 13px — estilo computado do canvas", "24px bold — declarado na fixture". Sem fonte, apenas descrição relativa e declarada ("visivelmente maior na imagem — estimativa visual").
2. **Nunca inventar medidas, cores, espaçamentos ou valores de contraste.** Screenshot sem estilos sustenta comparações relativas, com Confidence no máximo `Medium`.
3. **Atenção real não é observável.** Sem dado de comportamento (eye tracking, mapa de cliques, teste), "o usuário não vê o botão" é inferência sobre o mecanismo — `Confidence: High` só quando o desalinhamento é observado **e** a importância é fato do contexto.
4. **Princípios qualificam, não substituem.** Gestalt e "a ação primária deve dominar" explicam o mecanismo; a evidência é a propriedade observada.

## Limitations

- Sem a tarefa, a skill não decide qual elemento deveria dominar — só aponta competição e ambiguidade.
- Não mede atenção real nem prevê conversão.
- Viewports não observados (responsividade, outros dispositivos) ficam fora.
- Preferências de marca e estética pertencem ao dono do produto: atender a elas é escolha legítima, não defeito (regra 1 do framework).
- Quando o Paper expõe a árvore mas não os estilos computados, as limitações vão ao `Limitations` do Canvas Snapshot e ao Layer Coverage.

## Failure Conditions (adicionais às herdadas)

1. Medida, cor, espaçamento ou contraste citado sem fonte.
2. Mudança visual recomendada por modernidade, tendência ou gosto, sem mecanismo de impacto.
3. "A ação X deveria dominar" afirmado sem tarefa declarada ou contexto citado.
4. Contraste que fere o piso registrado em L5 (é L7 — Desambiguação do framework).
5. Um achado por dimensão, como checklist — dimensão sem sinal não gera achado.
6. Hierarquia intencional tratada como defeito: ação secundária menos proeminente que a primária é a hierarquia **funcionando**.

## Quality Checklist

- [ ] Tarefa e ordem de importância declaradas — ou `UNKNOWN` com a consequência aplicada?
- [ ] Toda propriedade citada tem fonte; nenhuma medida estimada como fato?
- [ ] Cada achado fecha a cadeia tarefa → contexto → impacto → evidência → recomendação?
- [ ] Causa buscada antes do sintoma (L2/L4/L6/L7 descartadas ou assumidas)?
- [ ] Nenhuma recomendação sustentada em estética; preferências declaradas como tal, fora de Issues?
- [ ] Hierarquia correta reconhecida como correta — sem achado fabricado para a camada "render"?

## Example

```text
Issue:          Na tela de pedido de reembolso, o valor a ser reembolsado — a informação
                que o analista precisa para aprovar — tem menos destaque que o banner
                de política de reembolso.
Category:       L5 — Visual Hierarchy
Severity:       Medium
Confidence:     Medium
Evidence:       Descrição da tela: valor em 14px regular cinza no rodapé do card; banner
                em 20px bold no topo. A tarefa (aprovar ou recusar o reembolso) vem do
                Brief; o efeito sobre a atenção é inferência — não há dado de uso.
User Impact:    O analista lê o banner a cada pedido antes de achar o valor; risco de
                aprovar sem conferir o valor nas filas longas.
Recommendation: Promover o valor para o nível tipográfico de título do card e mover o
                banner para um link de ajuda; validar com 3–5 analistas se o valor passa
                a ser o primeiro elemento lido.
Task Priority:      Conferir valor e motivo → decidir (Brief, tarefa principal)
Observed Emphasis:  Banner 20px bold (descrição) > valor 14px regular (descrição)
Competing Elements: Banner de política
```

Não é achado: na mesma tela, "Recusar" como botão de texto ao lado de "Aprovar" preenchido — a ação secundária menos proeminente é a hierarquia funcionando.
