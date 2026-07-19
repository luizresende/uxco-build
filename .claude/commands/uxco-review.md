---
description: Review formal de design — Context Engine + Critique Engine + Quality Gate (workflows/uxco-review.md)
argument-hint: [alvo do review — caminho de fixture/arquivo, "canvas", ou vazio para resolver na sessão]
---

Execute o **UXCO Review** — o workflow de review formal de design definido em `workflows/uxco-review.md`, sob a constituição (`CLAUDE.md`).

Alvo do review: $ARGUMENTS

Regras de execução:

1. Seguir os STEPs 0–6 do workflow, na ordem — nenhum pulado em silêncio.
2. Escopo aceito: uma tela, um frame, uma seleção, um conjunto de frames ou um fluxo — resolvido pela ordem de Scope Resolution do workflow: escopo explícito do usuário → seleção ativa no Paper → contexto da sessão. Ambiguidade entre múltiplos candidatos plausíveis é sinalizada com os candidatos listados; escopo nunca é inventado.
3. O review inteiro é operação `READ`: nenhuma escrita em canvas ou memória de projeto; canvas como fonte exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1), e a leitura segue a seção Paper Inspection do workflow — Canvas Snapshot auditável, capacidades nunca presumidas, limitações sempre declaradas.
4. Contexto antes de julgamento: o Product Context Brief (STEP 2) precede a crítica, e sua `Execution Recommendation` governa o STEP 3 — respostas de blocking questions nunca são inventadas. Ausência de informação não bloqueia por padrão: o review continua com Confidence explicitamente reduzida nas conclusões afetadas; interromper é exceção, reservada a quando a falta de contexto tornaria a análise potencialmente enganosa.
5. A saída é exclusivamente o **Design Critique Report** (`standards/critique-framework.md`) com a seção Quality Gate presente e veredito dos gates do `standards/quality-framework.md`. Camadas L0–L8 varridas quando aplicáveis, sob o Gate de evidência por camada: sem dados suficientes, a camada é `not-evaluable` declarado (*not enough evidence*) — nunca falsa precisão, em nenhuma direção.
