---
description: Review formal de design — Context Engine + Critique Engine + Quality Gate (workflows/uxco-review.md)
argument-hint: [alvo — nome de fluxo/tela/frame (ex.: checkout), caminho de arquivo, ou vazio para resolver pela seleção/contexto]
---

Execute o **UXCO Review** — o workflow de review formal de design definido em `workflows/uxco-review.md`, sob a constituição (`CLAUDE.md`).

Alvo do review: $ARGUMENTS

Formas de invocação equivalentes:

```text
/uxco-review                                       escopo pela seleção ativa do Paper ou pelo contexto da sessão (casos 3–5)
/uxco-review checkout                              alvo nomeado — referente resolvido contra canvas, arquivos e conversa
/uxco-review examples/.../fixture.md               caminho explícito (casos 1–2)
"faça o review formal do fluxo de checkout"        pedido contextual — mesmo workflow, roteado pela constituição (§9)
```

Regras de execução:

1. Seguir os STEPs 0–7 do workflow, na ordem — nenhum pulado em silêncio.
2. Escopo aceito: uma tela, um frame, uma seleção, um conjunto de frames ou um fluxo — resolvido pela ordem de Scope Resolution do workflow: escopo explícito do usuário → seleção ativa no Paper → contexto da sessão. Ambiguidade entre múltiplos candidatos plausíveis é sinalizada com os candidatos listados; escopo nunca é inventado.
   O argumento aceita **caminho** ou **nome** (ex.: `/uxco-review checkout`): o nome declara a intenção explicitamente, mas seu referente ainda é resolvido contra as fontes da sessão — frames do canvas, arquivos citados, conversa. Múltiplas correspondências plausíveis → ambiguidade sinalizada (caso 5); nenhuma correspondência → pedir a fonte (caso 4).
3. O review inteiro é operação `READ`: nenhuma escrita em canvas ou memória de projeto; canvas como fonte exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1), e a leitura segue a seção Paper Inspection do workflow — Canvas Snapshot auditável, capacidades nunca presumidas, limitações sempre declaradas.
4. Contexto antes de julgamento: o Product Context Brief (STEP 2) precede a crítica, e sua `Execution Recommendation` governa o STEP 3 — respostas de blocking questions nunca são inventadas. Ausência de informação não bloqueia por padrão: o review continua com Confidence explicitamente reduzida nas conclusões afetadas; interromper é exceção, reservada a quando a falta de contexto tornaria a análise potencialmente enganosa.
5. A saída é exclusivamente o **Design Critique Report** (`standards/critique-framework.md`) com a seção Quality Gate presente e veredito dos gates do `standards/quality-framework.md`. Camadas L0–L8 varridas quando aplicáveis, sob o Gate de evidência por camada: sem dados suficientes, a camada é `not-evaluable` declarado (*not enough evidence*) — nunca falsa precisão, em nenhuma direção.
