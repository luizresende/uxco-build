# Skill Routing

> **Propósito:** o registro das oito competências de Product Design do UXCO Design Engine e as regras que decidem **quais delas entram em cada tarefa** — para que nenhuma seja carregada sem motivo e nenhuma relevante fique de fora em silêncio.
> **Quando consultar:** antes de qualquer análise de design (review formal, crítica pontual, revisão de microcopy, auditoria de acessibilidade etc.), para escolher as competências; e no STEP 4 do `/uxco-review` (`workflows/uxco-review.md`).

Este standard **roteia; não contém método.** O que cada competência faz vive no arquivo dela; o contrato do achado, as camadas L0–L8 e o report vivem em `standards/critique-framework.md`; severidade e Confidence nos seus standards. Aqui só se decide **quem entra**.

## Como o runtime carrega as competências

As skills deste repositório vivem em `skills/` e os agents em `agents/` — **não** em `.claude/skills/`. O Claude Code não as descobre sozinho: elas são carregadas **por referência**, a partir da constituição (CLAUDE.md §9) e dos workflows. Este standard é o ponto único dessa referência: quem o consulta lê apenas os arquivos das competências selecionadas. Não há roteador executável — a seleção é um julgamento orientado por esta tabela, registrado de forma auditável (seção Registro da seleção).

## Registro de competências

Cada competência tem um território. As skills de profundidade são donas de camadas do `critique-framework.md` — o mesmo desenho que a Interaction Design já tinha para L1/L3/L8 desde a Sprint 3.

| Competência | Arquivo | Natureza | Território | Pergunta |
| --- | --- | --- | --- | --- |
| `product-context` | `skills/product-context/SKILL.md` | skill · contexto | Brief — alimenta L0 e a calibração de severidade | O que se sabe, o que se supõe e o que falta saber sobre o produto? |
| `design-critique` | `skills/design-critique/SKILL.md` | skill · amplitude + consolidação | L0–L8 em varredura; dona de L0 e L2 | O que, nesta interface, atrapalha a tarefa? |
| `interaction-design` | `skills/interaction-design/SKILL.md` | skill · profundidade | L1 · L3 · L8 | O que acontece quando o usuário age? |
| `ux-writing` | `skills/ux-writing/SKILL.md` | skill · profundidade | L4 | O texto orienta, no vocabulário do usuário? |
| `visual-hierarchy` | `skills/visual-hierarchy/SKILL.md` | skill · profundidade | L5 | O olhar encontra primeiro o que a tarefa exige primeiro? |
| `design-systems` | `skills/design-systems/SKILL.md` | skill · profundidade | L6 + o campo `System Action` em qualquer achado | O design reutiliza bem o que o produto já tem? |
| `accessibility` | `skills/accessibility/SKILL.md` | skill · profundidade | L7 | Que barreiras de acesso são identificáveis — e com que grau de verificação? |
| `design-qa` | `agents/design-qa.md` | agent · responsabilidade | O **review**, não o design (STEP 8) | Este review é confiável para ser entregue? |

Regras do registro:

1. **Uma camada, um dono de profundidade.** Nenhuma camada tem duas skills de profundidade; a Design Critique varre todas, mas aprofunda só as que não têm dono (L0, L2).
2. **Território não é exclusividade de observação.** Qualquer competência pode *notar* algo fora do seu território; o achado é registrado uma vez, na camada causal (Desambiguação do `critique-framework.md`), e a consolidação junta as contribuições.
3. **Design QA é responsabilidade, não capacidade de uso livre** (`agents/design-qa.md`): só existe acoplada a um review formal pronto para entrega. Nenhuma crítica pontual a carrega.
4. **Design Critic** (`agents/design-critic.md`) não está no registro de seleção: ele não é escolhido por tarefa — é um estágio fixo do review formal (STEP 6), sempre presente nele e nunca fora dele.

## Sinais de ativação

Uma competência entra quando há **sinal observável** — no pedido, no escopo ou no artefato. Sinal suposto não ativa nada.

| Competência | Ativa quando |
| --- | --- |
| `product-context` | Review formal (sempre — STEP 2); ou quando a severidade, o vocabulário ou a L0 dependem de entender o produto e esse entendimento não está na conversa (CLAUDE.md §4) |
| `design-critique` | Review geral ou pedido não classificável; ou quando duas ou mais competências produzem achados que precisam ser consolidados |
| `interaction-design` | Escopo de fluxo, multi-tela ou sequência de interação; estados, feedback, erro e recuperação, ações irreversíveis, formulários com validação |
| `ux-writing` | Pedido sobre texto, microcopy ou mensagens; telas com erro, confirmação, empty state ou instrução cujo texto decide a tarefa; termo que diverge do glossário |
| `visual-hierarchy` | Pedido sobre hierarquia, layout, atenção ou escaneabilidade; ação primária sem destaque, elementos competindo, tela densa — **e** artefato visual com propriedades observáveis |
| `design-systems` | Pedido sobre componentes, variantes, tokens ou consistência entre telas; **toda recomendação que proponha componente ou padrão novo** (CLAUDE.md §3.5); estilos divergentes para a mesma função |
| `accessibility` | Review formal (sempre — Accessibility é dimensão crítica ★ do `quality-framework.md`); formulários, autenticação, status por cor, alvos pequenos, controles customizados, gestos, mensagens de erro e de status |
| `design-qa` | Review formal, no STEP 8 — e apenas lá |

## Perfis canônicos de pedido

A tabela é o ponto de partida previsível. `Primárias` sempre entram no perfil; `Condicionais` entram só com o sinal da tabela anterior; `Não carregar` exige justificativa registrada para entrar (regra 3 abaixo).

| Perfil | Pedido típico | Primárias | Condicionais | Não carregar |
| --- | --- | --- | --- | --- |
| `full-review` | `/uxco-review`, "review formal do checkout" | product-context, design-critique, accessibility, design-qa | interaction-design, ux-writing, visual-hierarchy, design-systems | — |
| `microcopy` | "revise os textos desta tela", "melhore as mensagens de erro" | ux-writing | product-context, accessibility | design-systems, visual-hierarchy, interaction-design, design-qa |
| `form` | "revise este formulário de cadastro" | interaction-design, ux-writing, accessibility, design-critique | product-context, visual-hierarchy, design-systems | design-qa |
| `visual-hierarchy` | "a hierarquia desta tela funciona?", "o CTA não aparece" | visual-hierarchy, design-critique | product-context, design-systems, accessibility | ux-writing, interaction-design, design-qa |
| `flow` | "analise o fluxo de onboarding", "o que acontece se o pagamento falhar?" | interaction-design, design-critique | product-context, ux-writing, accessibility | visual-hierarchy, design-systems, design-qa |
| `accessibility-audit` | "esta tela tem barreiras de acessibilidade?" | accessibility | product-context, ux-writing, interaction-design | visual-hierarchy, design-systems, design-qa |
| `design-system-consistency` | "estas telas usam nossos componentes corretamente?" | design-systems, design-critique | visual-hierarchy, accessibility | ux-writing, interaction-design, design-qa |

## Regras de seleção

1. **Conjunto mínimo.** Partir das primárias do perfil; acrescentar condicionais apenas com sinal observável; cada competência selecionada carrega um motivo de uma linha. Carregar tudo "por garantia" é o anti-padrão que este standard existe para impedir (CLAUDE.md §9.1).
2. **Pedido composto → união de perfis.** "Revise o formulário e os textos" é `form` ∪ `microcopy`. Pedido que não se encaixa em nenhum perfil → `design-critique` sozinha, escalando por sinal (regra 3).
3. **Escalada sob demanda, declarada.** Uma competência fora do conjunto inicial — inclusive da coluna `Não carregar` — entra quando a análise encontra o sinal dela no meio do caminho (ex.: revisão de microcopy descobre que o CTA ambíguo também está sem destaque visual). A entrada é registrada com o sinal que a motivou; entrada sem sinal é carga indevida.
4. **O gate de evidência prevalece sobre o roteamento.** Competência selecionada sem material para trabalhar não fabrica achado: a camada dela vai para o Layer Coverage como `not-evaluable — [o que faltou]` (`workflows/uxco-review.md`, Gate de evidência por camada). Selecionar não obriga a produzir.
5. **Consolidação quando há mais de uma fonte de achados.** Duas ou mais competências produzindo achados → a Design Critique consolida (um problema, um achado, na camada causal). Com uma única skill de profundidade em pedido direto, ela entrega os achados no contrato comum sem consolidação adicional.
6. **Profundidade proporcional.** Selecionar uma skill não exige percorrer todas as suas dimensões: avalia-se o que o escopo contém (CLAUDE.md §2; "Not a Checklist" da Design Critique).
7. **Nenhuma competência simulada.** Competência fora do registro não existe — o roteamento nunca "inventa" uma skill para cobrir um pedido (CLAUDE.md §9.3).

## Registro da seleção

A seleção é auditável por uma linha única:

```text
Skills: <competência> [motivo] · <competência> [motivo] · ... | escalated: <competência> [sinal] | not routed: <competência>, ...
```

Exemplo, revisão de formulário que escalou para hierarquia visual:

```text
Skills: interaction-design [validação e erro] · ux-writing [mensagens] · accessibility [formulário] · design-critique [consolidação] | escalated: visual-hierarchy [CTA sem destaque] | not routed: design-systems, design-qa
```

- **Review formal:** a linha entra no bloco `## Review Assurance` (`standards/adversarial-quality.md`), onde o Design QA a audita.
- **Crítica direta:** a linha acompanha o campo `Context` do report — ou a primeira linha da resposta, quando a entrega for só Findings.
- A linha registra **o que foi selecionado e por quê** — nunca o raciocínio interno da análise.
