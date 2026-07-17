# Quality Framework

> **Propósito:** o instrumento compartilhado para avaliar qualidade de design — dimensões, escala e gates de aprovação. Define **o que olhar** e **como pontuar**.
> **Quando consultar:** ao avaliar qualquer design (review, crítica, autocrítica do Quality Gate do CLAUDE.md §8) e ao decidir se um trabalho está pronto.

Este framework operacionaliza os `uxco-design-principles.md`. Achados encontrados aqui são classificados pelo `severity-framework.md` e reportados nos formatos de `design-output-format.md`.

## Escala

| Nota | Nome | Critério objetivo |
| --- | --- | --- |
| 1 | Weak | A dimensão está comprometida: existe achado `Critical` nela, ou ela simplesmente não foi tratada |
| 2 | Insufficient | Falhas claras que exigem retrabalho: pior achado da dimensão é `High` |
| 3 | Acceptable | Cumpre o essencial: pior achado é `Medium`; melhorias identificadas, nenhuma bloqueia |
| 4 | Good | Sólido: apenas achados `Low`; nada compromete a experiência |
| 5 | Excellent | Exemplar: nenhum problema; no máximo `Opportunity`; serve de referência para o produto |

A âncora é a **severidade do pior achado na dimensão** — isso torna a nota derivável de evidência, não de impressão. Uma dimensão sem informação suficiente para avaliar **não recebe nota**: é registrada como `UNKNOWN` com o que faltou (CLAUDE.md §5); nota inventada é pior que ausência declarada.

## Dimensões

Dimensões marcadas com ★ são **críticas** para efeito dos gates.

| Dimensão | O que avalia | Pergunta-chave |
| --- | --- | --- |
| ★ Context Fit | Aderência ao problema, usuário e estágio do produto | Isto resolve o problema certo, para o usuário certo, neste contexto? |
| Clarity | Compreensibilidade imediata da interface | Um usuário novo entende o que é isto e o que fazer aqui? |
| ★ Usability | Facilidade e eficiência de completar a tarefa | O caminho da tarefa é curto, óbvio e tolerante a erro? |
| Interaction | Comportamento: feedback, affordances, transições, estados interativos | Toda ação tem resposta perceptível e comportamento previsível? |
| ★ Completeness | Cobertura de estados, erros e edge cases | O que acontece quando está vazio, falha, demora ou transborda? |
| Consistency | Coerência interna e com convenções da plataforma | O mesmo problema é resolvido do mesmo jeito em todo lugar? |
| ★ Accessibility | Atendimento ao piso de `accessibility-baseline.md` | As 10 áreas do baseline foram verificadas — e o que não foi validável está declarado? |
| Visual Hierarchy | Direcionamento intencional da atenção | O olhar encontra primeiro o que mais importa? A ação primária domina? |
| Content | Linguagem, rótulos, microcopy, vocabulário do produto | Os textos orientam, no vocabulário do usuário, sem ambiguidade? |
| Rationale | Fundamentação das escolhas relevantes | As decisões importantes têm porquê articulado e trade-offs explícitos? |

## Gates de aprovação

Um trabalho só é considerado aprovado quando, simultaneamente:

1. **Score médio ≥ 4** entre as dimensões avaliadas;
2. **Toda dimensão crítica (★) avaliada e com nota ≥ 3.** Ausência de nota não é aprovação: dimensão crítica não avaliável (`UNKNOWN`) bloqueia até a informação existir ou o usuário aceitar o gap explicitamente. Dimensões críticas nunca são puladas — são avaliadas no nível do escopo da tarefa;
3. **Nenhum blocker aberto** — achado `Critical`, ou violação do piso de acessibilidade sem tratamento.

**Blockers prevalecem sobre score médio:** um trabalho com média 4.6 e um achado `Critical` está reprovado. A média nunca compra a passagem de um blocker. Um blocker só deixa de estar aberto por **correção verificada** ou por **aceite explícito de risco pelo usuário**, registrado como `DECISION` — é a "decisão explícita" prevista na resposta a `Critical` do `severity-framework.md`.

Reprovação devolve o trabalho ao ciclo (etapa `design` ou anterior — CLAUDE.md §2), com os achados que motivaram a reprovação explícitos.

## Processo de avaliação

1. **Contexto primeiro:** reunir problema, usuário e restrições (Context Protocol, CLAUDE.md §4). Sem contexto, *Context Fit* não é avaliável — e isso limita o que o restante da avaliação pode afirmar.
2. **Varredura por dimensão:** percorrer as 10 dimensões colhendo achados; cada achado precisa de **evidência observável** (o que, onde, por quê) — impressões sem evidência não entram.
3. **Classificar:** atribuir severidade a cada achado (`severity-framework.md`); derivar a nota de cada dimensão pelo pior achado.
4. **Sintetizar:** aplicar os gates; reportar no formato adequado de `design-output-format.md`, achados ordenados por severidade.

A profundidade da varredura é proporcional ao escopo (CLAUDE.md §2). Dimensões **não críticas** podem ser declaradas fora de escopo — declaradas, nunca omitidas em silêncio. Dimensões **críticas** não são puladas: são avaliadas no nível do escopo da tarefa — o *Context Fit* de um componente isolado é seu encaixe no fluxo em que vive, não no produto inteiro.
