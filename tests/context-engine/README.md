# Context Engine — Testes (Sprint 2)

O Context Engine tem duas naturezas de comportamento, e cada uma exige um tipo de teste. **Comportamento probabilístico não é fingido como teste unitário determinístico** — a fronteira entre os dois tipos é explícita:

## DETERMINISTIC

Comportamento mecânico do Context Loader (`scripts/context-loader.mjs`) — mesmo input, mesmo output, sempre. Automatizados em `loader.test.mjs`, rodando no runner nativo do Node (sem dependências):

```bash
npm test
```

Cobrem:

| Teste | O que valida |
| --- | --- |
| detects existing files | Arquivo presente aparece como `loaded` |
| detects missing files | Arquivo ausente aparece como `missing` |
| detects empty files | Template todo `_Not filled_` aparece como `empty` |
| known memory files are loaded | Os 7 arquivos conhecidos são carregados com conteúdo |
| unknown files do not crash | Arquivos estranhos no diretório não quebram nem entram no inventário |
| complete fixture loads successfully | `complete/` → 7 loaded · 0 empty · 0 missing |
| incomplete fixture exposes missing sources | `incomplete/` → 2 loaded · 1 empty · 4 missing |
| contradictory fixture loads all conflicting sources | Os dois lados de cada conflito chegam intactos à análise |

## AGENT EVALUATION

Comportamento interpretativo da Product Context Skill — classificação de evidência, detecção de contradições, blocking vs non-blocking, Context Status do Brief. Depende do julgamento do Claude sob a constituição: é **avaliado por execução de cenário e critérios observáveis**, não por assert automatizado (mesmo protocolo de `tests/foundation/scenarios.md`).

O harness completo vive em `benchmarks/context-engine/`: cenários em `test-cases.md` (CTX-001..003, um por fixture de `examples/context-tests/`), checklist e score em `evaluation-template.md`, execuções registradas em `benchmarks/context-engine/results/` (append-only, `YYYY-MM-DD-run-N.md`) — mesmo protocolo da suíte da Sprint 1.

A regra de leitura dos resultados: um cenário AGENT EVALUATION passa se a **conduta observável** satisfaz os critérios, qualquer que seja a redação; a variabilidade de redação entre execuções é esperada e não constitui falha.
