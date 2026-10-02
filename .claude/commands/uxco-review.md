---
description: Review formal de design — Context Engine + Critique Engine + Adversarial Quality Engine + Quality Gate (workflows/uxco-review.md)
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

1. Seguir os STEPs 0–10 do workflow, na ordem — nenhum pulado em silêncio.
2. Escopo aceito: uma tela, um frame, uma seleção, um conjunto de frames ou um fluxo — resolvido pela ordem de Scope Resolution do workflow: escopo explícito do usuário → seleção ativa no Paper → contexto da sessão. Ambiguidade entre múltiplos candidatos plausíveis é sinalizada com os candidatos listados; escopo nunca é inventado.
   O argumento aceita **caminho** ou **nome** (ex.: `/uxco-review checkout`): o nome declara a intenção explicitamente, mas seu referente ainda é resolvido contra as fontes da sessão — frames do canvas, arquivos citados, conversa. Múltiplas correspondências plausíveis → ambiguidade sinalizada (caso 5); nenhuma correspondência → pedir a fonte (caso 4).
3. O review inteiro é operação `READ`: nenhuma escrita em canvas ou memória de projeto; canvas como fonte exige `PAPER_READY` verificado por chamada real (CLAUDE.md §6.1), e a leitura segue a seção Paper Inspection do workflow — Canvas Snapshot auditável, capacidades nunca presumidas, limitações sempre declaradas.
4. Contexto antes de julgamento: o Product Context Brief (STEP 2) precede a crítica, e sua `Execution Recommendation` governa o STEP 3 — respostas de blocking questions nunca são inventadas. Ausência de informação não bloqueia por padrão: o review continua com Confidence explicitamente reduzida nas conclusões afetadas; interromper é exceção, reservada a quando a falta de contexto tornaria a análise potencialmente enganosa.
5. **O primeiro diagnóstico não é a conclusão.** Depois da análise inicial e da consolidação, o diagnóstico passa obrigatoriamente pela camada adversarial (`standards/adversarial-quality.md`): STEP 6 — o **Design Critic** (`agents/design-critic.md`) desafia assumptions, evidência, severidade, confidence, causalidade, estados/edge cases omitidos, encaixe no contexto, recomendações e complexidade desnecessária, emitindo veredito por achado; STEP 7 — a **Revision** incorpora os vereditos em **um único** diagnóstico (o usuário nunca recebe duas análises contraditórias); STEP 8 — o **Design QA** (`agents/design-qa.md`) audita a qualidade do próprio review em sete dimensões, sem score composto e com blockers em lista própria. **Ciclo único:** uma passada de cada, nenhuma recursão; confirmar tudo é resultado válido, e mudança fabricada para o estágio parecer produtivo é falha.
6. A saída é exclusivamente o **Design Critique Report** (`standards/critique-framework.md`) com a seção Quality Gate presente e veredito dos gates do `standards/quality-framework.md`, mais a seção **Review Assurance** compacta (stage trace `INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA`, contagens do desafio, veredito e blockers do QA). As Issues são as revisadas, e só elas; a prioridade de leitura segue a mesma de sempre — Executive Summary, `Critical` → `Low`, Opportunities, Recommended Next Steps. Camadas L0–L8 varridas quando aplicáveis, sob o Gate de evidência por camada: sem dados suficientes, a camada é `not-evaluable` declarado (*not enough evidence*) — nunca falsa precisão, em nenhuma direção.
