# Índice da constituição

Mapa do que saiu de `CLAUDE.md` e do que ficou. A cadeia de STEPs (passo 3 deste refactor, ainda não construída) carrega uma linha por vez. Até lá, o `/uxco-review` continua sendo o workflow em `workflows/uxco-review.md`: onde ele cita um destes arquivos, o agente abre esse arquivo.

`CLAUDE.md` prevalece em conflito. Nada aqui revoga a constituição.

## O que ficou sempre carregado

| Bloco em `CLAUDE.md` | Por que ficou |
| --- | --- |
| Evidence Taxonomy | Toda afirmação depende da categoria. Sem isso no contexto, o resto não tem como ser honesto. |
| Gaps (blocking / non-blocking) | A decisão de perguntar ou seguir é de toda tarefa, não de um STEP. |
| Action Safety | Classificar a ação antes de executar. Inclui leitura subsequente antes de dar escrita por concluída, e a regra de que ferramenta sem escopo não tem `SAFE_WRITE`. |
| Quatro anti-patterns | Não fabricar pesquisa, não fabricar requisitos, não apresentar suposição como fato, nunca simular componente inexistente. |
| Contrato de saída | Categoria na afirmação, Assumption / Open Question / Design Decision, report formal único, gate reprovado não se esconde. |

Também ficaram, e estão marcados como julgamento em aberto mais abaixo: duas frases de identidade, o ciclo numa linha, e a frase de procurar contexto antes de classificar o gap.

## Para onde foi o resto

| Antiga seção | Arquivo | O que contém | Quem precisa |
| --- | --- | --- | --- |
| §1 Identity, §2 Mission | `identity-and-mission.md` | Texto integral. O ciclo numa linha ficou em `CLAUDE.md`. | STEP 0 (proporcionalidade), STEP 10 (`critique`) |
| §3 Princípios 1–12 | `operating-principles.md` | Os doze, na mesma ordem. | STEP 4 (princípios 5 e 6), STEP 9–10 (princípio 12), Design Critic (princípio 11) |
| §4 procedimento | `context-protocol.md` | Os 7 passos e a sequência de product design. A definição de blocking ficou em `CLAUDE.md`. | STEP 2, com a Product Context Skill |
| §5 Taxonomia | — | Ficou inteira em `CLAUDE.md`. Não há cópia. | Todos os STEPs |
| §6 Action Safety | — | Ficou inteira em `CLAUDE.md`, sem o detalhe do Paper. Não há cópia. | Todos os STEPs; o review inteiro é `READ` |
| §6.1 Paper | `canvas-safety.md` | Preflight, não assumir conexão, documento de teste, leitura subsequente no canvas. | STEP 1, só quando o canvas é fonte. Fora do review, antes de qualquer escrita no canvas |
| §7 Decision Framework | `decision-framework.md` | O que torna uma decisão relevante e o que considerar antes. | STEP 9, quando um blocker vira aceite de risco |
| §8 Quality Gate | `quality-gate.md` | O índice das dez dimensões e a regra do "quando aplicável". Critérios: `standards/quality-framework.md`. | STEP 9 e STEP 10 |
| §9 Hierarquia e inventário | `knowledge-routing.md` | Hierarquia, "consultar só o relevante", inventário do que existe, nunca simular. | Uma vez, ao rotear o pedido. De novo na Falha 5 |
| §10 Anti-patterns 1–10 | `anti-patterns.md` | Lista numerada, números preservados. | STEP 0 e STEP 3 (10); STEP 4 e Design Critic (9) |
| §11 Harness | `harness.md` | Runtime, `npm test` / `verify`, protocolo de sessão. | Sessão que altera o repositório. Não é insumo do review |

## O que cada STEP do review precisa além do workflow

O workflow, o comando e `CLAUDE.md` estão no contexto a run inteira, até a cadeia seletiva existir. A coluna "constituição sob demanda" é o que o passo 3 deve abrir naquele STEP, e não antes. A coluna "já era dependência" repete a tabela Skill Dependencies e as âncoras do workflow — o baseline em `benchmarks/harness-refactor/baseline.md` mede esse conjunto no corpus anterior a este split.

| STEP | Constituição sob demanda | Já era dependência do workflow |
| --- | --- | --- |
| 0 Resolve scope | `anti-patterns.md` (10), `identity-and-mission.md` (proporcionalidade) | `skills/design-critique/SKILL.md`, `standards/critique-framework.md`, `standards/design-output-format.md` |
| 1 Paper, se o canvas for fonte | `canvas-safety.md` | `docs/architecture.md`, `experiments/paper-mcp/smoke-test.md`, `standards/accessibility-baseline.md` |
| 2 Context phase | `context-protocol.md` | `skills/product-context/SKILL.md`, `standards/product-context-brief.md`, `scripts/context-loader.mjs` quando há memória |
| 3 Context gate | `anti-patterns.md` (10) | `standards/product-context-brief.md`, `skills/product-context/SKILL.md` |
| 4 Initial Analysis | `operating-principles.md` (5, 6, 7) | `skills/design-critique/SKILL.md`, `skills/interaction-design/SKILL.md` se o escopo pedir, `standards/critique-framework.md`, `standards/severity-framework.md`, `standards/design-output-format.md`, `standards/accessibility-baseline.md`, `standards/uxco-design-principles.md` |
| 5 Consolidation | — | `standards/severity-framework.md`, `standards/critique-framework.md` |
| 6 Adversarial Critique | `operating-principles.md` (11), `anti-patterns.md` (9) | `agents/design-critic.md`, `standards/adversarial-quality.md` |
| 7 Revision | — | `standards/adversarial-quality.md`, `standards/severity-framework.md`, `standards/critique-framework.md` |
| 8 Review QA | `quality-gate.md` (não esconder reprovação) | `agents/design-qa.md`, `standards/adversarial-quality.md` |
| 9 Quality Gate | `quality-gate.md`, `decision-framework.md` se houver aceite de risco | `standards/quality-framework.md` |
| 10 Report | `quality-gate.md`, `identity-and-mission.md` (etapa critique) | `standards/critique-framework.md`, `templates/reports/design-review.md`, `standards/adversarial-quality.md` |
| Falha 5 | `knowledge-routing.md` | a dependência que não abriu |
| Rotear pedido em linguagem natural | `knowledge-routing.md` | `.claude/commands/uxco-review.md` |

`harness.md` não entra nessa tabela.

## Julgamentos em aberto

Decisões tomadas para caber em uma constituição curta, sem certeza de que o dono as quer assim. Nenhuma é fato sobre a preferência dele.

1. **Ciclo numa linha ficou sempre carregado.** O texto integral foi para `identity-and-mission.md`. Dá para tirar a linha, e o ciclo só aparecer quando um passo carregar aquele arquivo. Ficou porque "não pular etapa em silêncio" vale para tarefa que não é review.

2. **Duas frases de identidade ficaram.** O parágrafo longo saiu. Dá para tirar as duas frases se o runtime já fixa quem é o agente.

3. **As quatro regras do Paper não ficaram duplicadas em `CLAUDE.md`.** Ficou a regra geral: sem escopo carregado, não há `SAFE_WRITE`. Consequência: uma sessão que não abrir `canvas-safety.md` não escreve no canvas como escrita segura — precisa tratar como `DESTRUCTIVE_WRITE` ou carregar o arquivo. Se `PAPER_READY` e o documento de teste tiverem de estar sempre visíveis, este julgamento está errado e as quatro regras voltam para a constituição.

4. **Os doze princípios operacionais saíram por inteiro.** Os que mais doem fora do review são o 1 (não começar pela interface), o 6 (estética não é problema), o 7 (estados) e o 11 (autocriticar). A identidade que ficou cobre só uma parte do 1. Se esses quatro tiverem de valer sem carga extra, voltam para `CLAUDE.md`.

5. **A lista `objetivo · contexto · fluxo · …` saiu** para `quality-gate.md`. Em `CLAUDE.md` ficou a regra de não declarar conclusão com gate reprovado. Se a lista em si for memória de trabalho, e não índice, ela volta.

6. **Anti-pattern 10 (não transformar ambiguidade pequena em bloqueio) ficou só na lista numerada.** O review cita o número o tempo todo. A regra de gaps em `CLAUDE.md` já diz que interrogatório e invenção falham juntos, mas não repete o item 10. Se a redação numerada tiver de estar sempre visível, o item volta — a numeração continua canônica em `anti-patterns.md`.

7. **O inventário do que existe saiu do sempre-carregado.** A proibição de simular ficou. O agente sem `knowledge-routing.md` sabe que não pode simular, e não sabe de cor quais comandos já existem. É intencional; confirma se o roteamento de pedido em linguagem natural pode depender de abrir esse arquivo.

8. **O protocolo de sessão (ler `PROGRESS.md`, `npm run verify` no fim) saiu** para `harness.md`. Uma sessão de desenvolvimento que só tiver `CLAUDE.md` não vê mais esse protocolo. Se ele for dever de toda sessão, e não só de sessão que mexe no repositório com o harness carregado, volta.

9. **Os 7 passos do Context Protocol saíram.** Ficou em `CLAUDE.md` a ordem "procurar contexto antes de classificar" e a definição de blocking. Os passos e a sequência em inglês estão em `context-protocol.md`.
