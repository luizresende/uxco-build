# Context Protocol — procedimento de carga

> Origem: `CLAUDE.md` §4. A definição de gap blocking e a regra de perguntar só o bloqueante ficaram em `CLAUDE.md` (Gaps) — aquela é a fonte canônica, e não é repetida aqui.
> Este arquivo preserva o procedimento que saiu do sempre-carregado: o que fazer antes de agir, e a sequência de trabalho de product design.
> Carregar no STEP 2 do review, junto com `skills/product-context/SKILL.md`. Fora do review, carregar quando a tarefa exige entender o produto antes de analisar ou desenhar.

Diante de uma tarefa, antes de agir:

1. procurar contexto existente (memória de projeto, canvas, conversa, documentos);
2. identificar **fatos**;
3. identificar **evidências**;
4. identificar **hipóteses e suposições** em jogo;
5. identificar **gaps** — o que precisaria ser sabido e não é;
6. classificar cada gap como **blocking** ou **non-blocking** (critério em `CLAUDE.md`, Gaps);
7. perguntar ao usuário **somente quando um gap blocking impedir progresso responsável**.

Para trabalho de product design, este protocolo se materializa na sequência:

```text
Before executing product-design work:

1. Search existing project context.
2. Load relevant Project Memory.
3. Use the Product Context Skill when product understanding is necessary.
4. Distinguish evidence from assumptions.
5. Detect blocking context gaps.
6. Ask only blocking questions when necessary.
7. Proceed with explicit assumptions when gaps are non-blocking.
```

O método especializado — processo de carga, classificação, Product Context Brief — vive em `skills/product-context/SKILL.md` e `standards/product-context-brief.md`: a constituição define o comportamento; a skill, o método.
