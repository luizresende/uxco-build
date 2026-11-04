# Fase analyze

Um diagnóstico inicial, já consolidado. Marcador `INITIAL_ANALYSIS`. Isto não é a conclusão do review.

## Critique Orchestration

Varra L0 L1 L2 L3 L4 L5 L6 L7 L8 quando aplicável. O texto integral, a desambiguação e o mapeamento para o quality-framework ficam em `standards/critique-framework.md` e não entram nesta fase. Sem cota de achados.

L0 intenção do produto. L1 caminho da tarefa. L2 organização e nomes. L3 affordance e feedback. L4 microcopy. L5 hierarquia visual. L6 consistência. L7 acessibilidade. L8 estados e extremos. Causa na camada mais estrutural.

### Gate de evidência por camada

- Evidência suficiente → `evaluated`.
- Evidência parcial → `evaluated`, com Confidence menor e a limitação no achado.
- Evidência insuficiente → *not enough evidence*: `not-evaluable` e `reason` diz o que faltou. Achado nessa camada é inválido.
- Fora do território do escopo → `out-of-scope` com reason.

Falsa precisão é falha nas duas direções: fabricar achado, ou apresentar camada não verificada como avaliada. Contraste (L7) sem cor legível não é achado nem aprovação — `standards/accessibility-baseline.md`. Fluxo (L1) em tela isolada não se sustenta numa sequence inventada. L0 sem núcleo no brief fica `not-evaluable`. Intenção de produto não se inventa.

### Roteamento da Interaction Design

Quando `needsFlowSkill` é true (`flow`, multi-tela, sequência de interação), aplique as doze dimensões abaixo e marque `interactionDesign: loaded`. `skills/interaction-design/SKILL.md` não está na lista desta fase.

Em tela isolada a skill não vem no contexto. Cheiro comportamental (fluxo crítico, estado suspeito, recuperação de erro) vira `interactionDesign: on-demand` e `behavioralSmell` nomeia o cheiro. Não simule o método da skill. O achado, se houver, sai da Design Critique, com a validação pendente.

O que a skill decompõe, quando carregada: sequência · continuidade · feedback · estados · transições · reversibilidade · prevenção de erro · recuperação · dependências · permissões · gargalos · redundâncias.

### Consolidação

Uma boa revisão com poucos problemas relevantes vale mais que uma lista inchada — sinal sobre volume, sempre; volume não é rigor. Isto já sai consolidado. Não há segunda fase de consolidação.

1. Um diagnóstico só, na camada causal. Duas issues iguais são falha de consolidação. Equivalentes entram com as manifestações listadas no mesmo bloco, nunca N blocos repetidos.
2. A evidência mais forte vem primeiro. No mesmo achado, a mais fraca complementa, nunca substitui.
3. A maior severidade só permanece se justificada pelas lentes de `standards/severity-framework.md`. Sem isso, vale a menor.
4. Trigger, comportamento atual e estado faltante enriquecem o bloco. Esses campos nunca justificam um segundo bloco.
5. Duplicata sai. Equivalente se agrupa.
6. `Low` agregados quando a correção não é isolável.
7. Ordenação por prioridade — a ordem de ataque. A lista sai com severidade primeiro (`Critical` → `Low`); dentro do nível, impacto → confiança → alcance. `Opportunity` sempre separada, ao final, na lista `opportunities`, nunca em contagem de defeitos.

## Issue Model

O contrato é o de `standards/design-output-format.md` e `standards/critique-framework.md`. O JSON acrescenta `id`. O bloco continua com estes sete campos, nesta ordem, e nenhum outro:

```text
Issue:          [o problema, uma frase]
Category:       [L0–L8, exatamente uma]
Severity:       [Critical | High | Medium | Low | Opportunity]
Confidence:     [High | Medium | Low]
Evidence:       [o que sustenta, citável]
User Impact:    [consequência, com a dimensão]
Recommendation: [específica, proporcional, acionável, contextual]
```

Princípio abstrato nunca é a única evidência. "Isso viola boas práticas." não sustenta achado. Princípios de `standards/uxco-design-principles.md` qualificam a evidência, não a substituem.

User Impact nomeia a dimensão: usuário, tarefa, negócio, compreensão, erro ou acessibilidade.

`High` = evidência direta. `Medium` = evidência razoável com lacuna. `Low` = hipótese, e a validação necessária vai na Recommendation.

Recomendação genérica é falha de contrato. Padrão existente do produto vem antes de padrão novo (`docs/constitution/operating-principles.md`, princípio 5).

### Severity Engine

A escala vem integralmente de `standards/severity-framework.md`. As lentes são impact × reach × task criticality × recoverability. Sem task criticality no brief, cai a Confidence, não sobe a severidade.

Pisos: perda de trabalho/dados e o piso de acessibilidade nunca abaixo de `High`; excludente → `Critical`. Na dúvida, o menor.

Severity ≠ Confidence. Combinar os dois abaixo é legítimo. Incerteza jamais rebaixa severidade em silêncio.

```text
Severity:   Critical
Confidence: Low
```

`opportunities` só recebem severity `Opportunity`. `issues` não recebem.
