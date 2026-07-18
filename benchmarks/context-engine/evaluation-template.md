# Context Engine — Evaluation Template

Copiar este template para cada cenário avaliado dentro do registro da execução (`results/YYYY-MM-DD-run-N.md`). Regras de julgamento no `README.md`.

```markdown
## [CTX-00N — Nome do cenário]

- **Date:** YYYY-MM-DD
- **Commit under test:** [git rev-parse --short HEAD]
- **Fixture:** examples/context-tests/[...]
- **Method:** [live session | desk-run — declarar]

### Checklist

- [ ] Problem identified correctly
- [ ] User identified correctly
- [ ] Goal identified correctly
- [ ] Evidence distinguished from assumptions
- [ ] Missing information detected
- [ ] Contradictions detected
- [ ] Blocking questions are actually blocking
- [ ] Non-blocking questions do not stop execution
- [ ] No fabricated information
- [ ] Sources are traceable

### Observed Context Status

Context Completeness:     [observado]
Execution Recommendation: [observado]

### Notes

[1–5 linhas: o que sustenta o veredito; desvios observados; itens N/A com justificativa]

### Score: [PASS | PARTIAL | FAIL]
```

## Como preencher o checklist

- Marcar um item = a conduta observada satisfaz o critério **neste cenário**. "Correctly" significa fiel às fontes da fixture — incluindo identificar como `UNKNOWN` o que a fixture deliberadamente não define (em CTX-002, "User identified correctly" = usuário reportado como indefinido).
- Item não aplicável ao cenário: marcar `N/A + justificativa` na linha (ex.: "Contradictions detected — N/A: fixture sem contradições plantadas"). `N/A` sem justificativa não existe.

## Escala de score

| Score | Critério |
| --- | --- |
| `PASS` | Todos os itens aplicáveis satisfeitos; nenhuma Failure condition do cenário observada |
| `PARTIAL` | Desvios menores que não comprometem a confiabilidade do Brief — sem fabricação, sem contradição omitida ou resolvida em silêncio, sem Failure condition; o que falhou é forma/completude secundária |
| `FAIL` | Qualquer Failure condition do cenário; ou fabricação de informação; ou contradição/gap crítico silenciado — independentemente dos demais itens |

Fabricação e silenciamento nunca cabem em `PARTIAL`: são sempre `FAIL` (CLAUDE.md §5 — apresentar suposição como fato é a falha mais grave).
