# Design Critique Skill

> **Propósito:** análise crítica de interfaces e fluxos digitais — identificar problemas reais de experiência, priorizá-los por impacto e produzir recomendações acionáveis, no contrato de `standards/critique-framework.md`.
> **Quando consultar:** sempre que uma interface, tela ou fluxo precisar ser avaliado criticamente; é a etapa `critique` do ciclo (CLAUDE.md §2) elevada a capacidade própria.

Esta skill opera sob a constituição e **referencia** — nunca redefine — os standards: camadas L0–L8, contrato do achado e formato do report em `critique-framework.md`; severidade em `severity-framework.md`; dimensões e gates em `quality-framework.md`; piso de acessibilidade em `accessibility-baseline.md`; blocos e Confidence em `design-output-format.md`; contexto de produto em `standards/product-context-brief.md`.

## Purpose

Responder: **"o que, nesta interface, atrapalha o usuário a realizar a tarefa — com que gravidade, com que certeza, e o que fazer a respeito?"**

A saída é o Design Critique Report. A skill **não redesenha, não corrige e não escreve no canvas** — crítica é operação `READ` (CLAUDE.md §6); recomendar é o limite da sua atuação.

## When to Use

- Pedido explícito de crítica, review ou QA de uma interface, tela ou fluxo.
- Etapa `critique` formalizada sobre trabalho produzido na própria sessão.
- Futuro: `/uxco-review` e `/uxco-design-qa` a consumirão (não implementados — não simular).

**Quando não usar:** pedido de design novo (crítica não é geração); ajuste pontual que não pede avaliação — o rito é proporcional à tarefa (CLAUDE.md §2).

## Inputs

| Fonte | Papel | Obrigatória |
| --- | --- | --- |
| Artefato de design — canvas (somente `READ`, exige `PAPER_READY`), descrição textual ou imagem | O objeto sob análise | **Sim** — sem artefato observável não há crítica |
| Product Context Brief | Contexto de produto: alimenta L0 e calibra severidade | Não — ausência degrada a análise (cenários B/C), não a impede |
| Conversa atual | Escopo, tarefa-alvo, restrições declaradas | Não |
| Memória/arquivos do projeto | Requisitos, decisões, glossário | Não |

Pedido de crítica **sem artefato observável** é gap blocking: pedir a fonte, nunca criticar de memória ou suposição.

## Context Integration

Como esta skill consome o Context Engine (Sprint 2):

1. **Contexto antes de julgamento** — antes de criticar, procurar contexto existente (ordem da Source Priority de `skills/product-context/SKILL.md`); nenhuma pergunta antes dessa busca.
2. **Brief disponível** → é a fonte de L0 (Product Intent), calibra severidade (task criticality vem da tarefa real do usuário, não de suposição) e fornece o vocabulário canônico (glossary).
3. **Brief inexistente, memória disponível** → em avaliação formal, executar a Product Context Skill primeiro; em crítica pontual, extrair o contexto mínimo da conversa e declará-lo.
4. **O contexto usado é sempre declarado** no campo `Context` do report — incluindo a `Execution Recommendation` do Brief: um Brief `REQUEST BLOCKING CONTEXT` ativa o cenário C.
5. **Fluxo unidirecional preservado:** a crítica lê contexto; nunca atualiza a memória do projeto.

## Analysis Process

Sequência obrigatória — entender antes de julgar:

```text
STEP 1  Understand intent — objetivo da interface e tarefa principal do usuário
        (do Brief/conversa; sem isso, declarar UNKNOWN e limitar L0)
STEP 2  Load constraints — restrições, decisões ativas, estágio do produto, glossário
STEP 3  Observe the artifact — inventariar o que está visível (telas, estados
        presentes, elementos), sem julgar ainda
STEP 4  Sweep L0→L8 — varredura da estrutural para a superficial
        (critique-framework.md), apenas nas camadas relevantes ao escopo
STEP 5  Find structural causes — agrupar sintomas por causa; reportar na camada causal
STEP 6  Classify and prioritize — severidade, Confidence, ordenação por impacto
STEP 7  Self-check — falsos positivos, gosto disfarçado, inflação (Quality Checklist)
STEP 8  Report — Design Critique Report completo
```

## Not a Checklist

A varredura L0–L8 orienta **onde olhar**, não quanto produzir:

- Camada relevante ≠ camada com problema: "nenhum achado nesta camada" é resultado válido e frequente.
- **Não há cota de issues.** Zero problemas é veredito legítimo para um bom design; o report não precisa "render".
- A pergunta da varredura é *"o que impede ou encarece a tarefa?"* — nunca *"o que eu mudaria?"*.
- Toda candidata a issue passa pelo Impact Test antes de entrar no report.

## Impact Test

Filtro anti-superficialidade: uma candidata só vira issue se responder às três perguntas —

1. **Efeito:** qual efeito observável em percepção, compreensão, prioridade, legibilidade ou comportamento? (`critique-framework.md`, regra 9)
2. **Tarefa:** qual tarefa fica mais difícil, mais lenta ou mais arriscada — e para quem?
3. **Evidência:** o que, observável no artefato ou no contexto, sustenta a resposta?

Reprovada em qualquer uma → não é issue: é **preferência** (declarável como tal, fora de Issues) ou **suspeita sem evidência** (→ Unknowns and Assumptions).

Aplicação aos clássicos superficiais:

- *"O botão poderia ser maior"* — só é issue se o alvo estiver abaixo do piso de target size (→ L7) ou se a proeminência da ação primária estiver comprometida com efeito na tarefa (→ L5). Sem isso: preferência.
- *"O layout poderia ser mais moderno"* — estética sem mecanismo de impacto: preferência, sempre.
- *"Adicione mais espaçamento"* — só é issue se a densidade comprometer legibilidade ou agrupamento percebido, com efeito nomeado (→ L5/L2). Sem isso: preferência.

## Behavior Scenarios

| Cenário | Conduta |
| --- | --- |
| **A. Contexto suficiente** (Brief `HIGH`/`PROCEED` ou equivalente) | Análise completa, L0 incluída; severidades calibradas pela tarefa real. |
| **B. Contexto parcialmente ausente** | A análise continua; cada julgamento dependente do que falta carrega a limitação explícita; Unknowns and Assumptions lista o que mudaria com o contexto completo. |
| **C. Contexto crítico ausente** (usuário/objetivo desconhecidos; Brief `REQUEST BLOCKING CONTEXT`) | Sem afirmações fortes nas camadas dependentes: L0 vira `not-evaluable`; severidades que dependem de task criticality caem de Confidence. As camadas observáveis (L3, L5, L7, L8) seguem criticáveis com escopo declarado. |
| **D. Apenas uma tela disponível** | **Não inferir o fluxo.** L1 fica `not-evaluable` (ou limitada ao que a tela evidencia); hipóteses sobre o resto do fluxo vão a Unknowns, nunca a Issues. |
| **E. Fluxo completo disponível** | Analisar as relações entre etapas e estados: continuidade da tarefa e custo acumulado (L1), consistência entre telas (L6), estados atravessando o fluxo (L8). |
| **F. Evidência insuficiente** | Com evidência fraca: issue com `Confidence: Low`, incerteza explicada e validação indicada na Recommendation. Sem evidência nenhuma: **não é issue** (contrato do achado, regra 3) — vai a Unknowns. |

## Output Format

Exclusivamente o **Design Critique Report** de `critique-framework.md`: Context obrigatório, Executive Summary, Issues (blocos completos — Issue, Category, Severity, Confidence, Evidence, User Impact, Recommendation), Patterns Detected, Opportunities, Unknowns and Assumptions, Layer Coverage (tokens canônicos), Quality Gate quando avaliação formal for pedida, e Recommended Next Steps.

Proporcionalidade: crítica pontual pode entregar apenas Issues + Context — nunca, porém, sem o Context declarado.

## Failure Conditions

O report é **inválido** — refazer, não entregar — se:

1. Qualquer issue sem um dos 7 campos do contrato do achado.
2. Severidade sustentada em gosto pessoal (viola regras 1/8/9 do `critique-framework.md`).
3. Contexto inventado — para viabilizar L0, inflar severidade ou fabricar User Impact.
4. Fluxo inferido a partir de uma tela e tratado como observado (cenário D violado).
5. Contradição entre artefato e contexto resolvida silenciosamente — nomear e devolver, como no Context Engine.
6. Checklist mecânica: issues fabricadas para "cobrir" camadas.
7. Camada ausente do Layer Coverage sem declaração.

## Quality Checklist

Autocrítica antes de entregar (etapa `critique` do ciclo aplicada a si mesma):

- [ ] Objetivo da interface e tarefa principal declarados — ou `UNKNOWN` declarado?
- [ ] Contexto usado citado no report, com as limitações dos cenários B/C aplicadas?
- [ ] Toda issue passou no Impact Test e tem os 7 campos?
- [ ] Observação, inferência e hipótese distinguidas via Confidence?
- [ ] Sintomas agrupados por causa estrutural (Patterns), sem repetição por tela?
- [ ] Severidades pelas quatro lentes do severity-framework, sem inflação — e Lows agregados quando não acionáveis isoladamente?
- [ ] Opportunities com benefício declarado, separadas de Issues?
- [ ] Layer Coverage completo, com tokens canônicos?

## Example

Agrupamento estrutural (regra 10) — três sintomas, um achado:

```text
Sintomas observados: usuários não encontram "Exportar" (menu ⋯); "Configurar widget"
vive em Settings mas "Instalar widget" no onboarding; busca não cobre arquivados.

Issue:          Ações de ciclo de vida do feedback estão distribuídas sem critério único
                de localização — três manifestações observadas.
Category:       L2 — Information Architecture
Severity:       Medium
Confidence:     Medium
Evidence:       As três manifestações acima (telas Board, Settings, Onboarding); nenhuma
                observação direta de usuários perdidos — inferência a partir da estrutura.
User Impact:    Localização por tentativa e erro; retrabalho leve e recorrente no triage.
Recommendation: Definir um critério único de localização por objeto (ação vive onde o
                objeto vive) e realocar as três ocorrências — correção na causa, não
                três correções cosméticas.
```

Um sintoma reportado três vezes em L5/L4 seria a versão errada deste achado.
