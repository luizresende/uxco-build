---
description: Review formal de design — Context Engine + Critique Engine + Quality Gate (workflows/uxco-review.md)
argument-hint: [alvo do review — caminho de fixture/arquivo, "canvas", ou vazio para resolver na sessão]
---

Execute o **UXCO Review** — o workflow de review formal de design definido em `workflows/uxco-review.md`, sob a constituição (`CLAUDE.md`).

Alvo do review: $ARGUMENTS

Regras de execução:

1. Seguir os STEPs 0–6 do workflow, na ordem — nenhum pulado em silêncio.
2. Sem argumento, resolver o alvo no STEP 0 a partir da sessão (canvas ativo, arquivo citado, descrição fornecida); perguntar apenas se nenhuma fonte observável existir — artefato ausente é o único gap blocking estrutural.
3. O review inteiro é operação `READ`: nenhuma escrita em canvas ou memória de projeto; canvas como fonte exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1).
4. Contexto antes de julgamento: o Product Context Brief (STEP 2) precede a crítica, e sua `Execution Recommendation` governa o STEP 3 — respostas de blocking questions nunca são inventadas.
5. A saída é exclusivamente o **Design Critique Report** (`standards/critique-framework.md`) com a seção Quality Gate presente e veredito dos gates do `standards/quality-framework.md`.
