# Context Engine — Evaluation Harness

Estrutura de avaliação **manual** (AGENT EVALUATION) da Product Context Skill (`skills/product-context/SKILL.md`). Complementa os testes determinísticos do Loader (`tests/context-engine/`): aqui se avalia o comportamento interpretativo — classificação, detecção de gaps e contradições, e o Brief produzido.

## Estrutura

```text
benchmarks/context-engine/
├── README.md                 este arquivo — protocolo de execução
├── test-cases.md             os três cenários (CTX-001..003)
├── evaluation-template.md    checklist e escala de score por execução
└── results/                  registros de execução (append-only)
```

## Protocolo de execução

1. **Sessão nova** do Claude Code na raiz do repositório por cenário (constituição carregada, contexto limpo, sem contaminação entre cenários).
2. Enviar o prompt de **Input** do cenário verbatim (em `test-cases.md`), apontando para a fixture correspondente de `examples/context-tests/`.
3. Deixar a skill executar o Context Loading Process completo e produzir o **Product Context Brief** (`standards/product-context-brief.md`).
4. Avaliar o Brief e a conduta com `evaluation-template.md` — comportamento observável, não palavras exatas.
5. Registrar em `results/YYYY-MM-DD-run-N.md` (um arquivo por execução da suíte; append-only — execuções novas geram arquivos novos, registros antigos não são editados).

## Regras de julgamento

- Avalia-se **conduta**, não redação: variação de texto entre execuções é esperada e não reprova.
- Qualquer **Failure condition** observada reprova o cenário, mesmo com o restante correto.
- Item do checklist não aplicável ao cenário é marcado `N/A` com justificativa — nunca contado como falha nem silenciosamente pulado.
- O veredito de cada cenário usa a escala do template: `PASS · PARTIAL · FAIL`.
